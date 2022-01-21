import { useEffect, useState, useCallback, useMemo } from 'react';
import { CardanoStaking, PoolsResponse } from '@wallet-types/cardanoStaking';
import { SUITE } from '@suite-actions/constants';
import trezorConnect, { CardanoTxSigningMode } from 'trezor-connect';
import { useActions, useSelector } from '@suite-hooks';
import * as notificationActions from '@suite-actions/notificationActions';
import * as cardanoStakingActions from '@wallet-actions/cardanoStakingActions';
import {
    getStakingPath,
    getProtocolMagic,
    getNetworkId,
    getChangeAddressParameters,
    getDelegationCertificates,
    composeTxPlan,
    isPoolOverSaturated,
    getStakePoolForDelegation,
    getTtl,
} from '@wallet-utils/cardanoUtils';
import { trezorUtils, CoinSelectionError } from '@fivebinaries/coin-selection';
import { getNetwork, isTestnet } from '@wallet-utils/accountUtils';
import { AppState } from '@suite-types';
import { CARDANO_STAKE_POOL_TESTNET, CARDANO_STAKE_POOL_MAINNET } from '@suite-constants/urls';

const getDeviceAvailability = (
    device: AppState['suite']['device'],
    locks: AppState['suite']['locks'],
) => {
    // Handle all external cases where it is not possible to make delegate or withdrawal action
    if (!device?.connected) {
        return {
            status: false,
            reason: 'DEVICE_DISCONNECTED',
        } as const;
    }
    if (locks.includes(SUITE.LOCK_TYPE.DEVICE)) {
        return {
            status: false,
            reason: 'DEVICE_LOCK',
        } as const;
    }

    return {
        status: true,
    };
};

export const getReasonForDisabledAction = (reason: CardanoStaking['actionAvailable']['reason']) => {
    switch (reason) {
        case 'POOL_ID_FETCH_FAIL':
            return 'TR_STAKING_TREZOR_POOL_FAIL';
        case 'UTXO_BALANCE_INSUFFICIENT':
            return 'TR_STAKING_NOT_ENOUGH_FUNDS';
        default:
            return null;
    }
};

export const useCardanoStaking = (): CardanoStaking => {
    const account = useSelector(state => state.wallet.selectedAccount.account);
    if (!account || account.networkType !== 'cardano') {
        throw Error('useCardanoStaking used for other network');
    }

    const { derivationType, device, locks, pendingStakeTxs } = useSelector(state => ({
        derivationType: state.wallet.settings.cardanoDerivationType,
        device: state.suite.device,
        locks: state.suite.locks,
        pendingStakeTxs: state.wallet.cardanoStaking.pendingTx,
    }));
    const { addToast, setPendingStakeTx } = useActions({
        addToast: notificationActions.addToast,
        setPendingStakeTx: cardanoStakingActions.setPendingStakeTx,
    });
    const [trezorPools, setTrezorPools] = useState<PoolsResponse>(undefined);
    const [deposit, setDeposit] = useState<undefined | string>(undefined);
    const [fee, setFee] = useState<undefined | string>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [actionAvailable, setActionAvailable] = useState<CardanoStaking['actionAvailable']>({
        status: false,
    });
    const [error, setError] = useState<string | undefined>(undefined);

    const network = getNetwork(account.symbol);
    const stakingPath = getStakingPath(account.accountType, account.index);
    const pendingStakeTx = pendingStakeTxs.find(tx => tx.accountKey === account.key);

    const {
        rewards: rewardsAmount,
        address: stakeAddress,
        poolId: registeredPoolId,
        isActive: isStakingActive,
    } = account.misc.staking;

    const currentPool =
        registeredPoolId && trezorPools
            ? trezorPools?.pools.find(p => p.bech32 === registeredPoolId)
            : null;
    const isStakingOnTrezorPool = !isFetching ? !!currentPool : true; // fallback to true to prevent flickering in UI while we fetch the data
    const isCurrentPoolOversaturated = currentPool ? isPoolOverSaturated(currentPool) : false;

    const changeAddress = useMemo(() => getChangeAddressParameters(account), [account]);

    const prepareTxPlan = useCallback(
        (action: 'delegate' | 'withdrawal') => {
            if (!changeAddress) return null;

            const pool = trezorPools
                ? getStakePoolForDelegation(trezorPools, account.balance).hex
                : '';

            const certificates =
                action === 'delegate'
                    ? getDelegationCertificates(stakingPath, pool, !isStakingActive)
                    : [];
            const withdrawals =
                action === 'withdrawal'
                    ? [
                          {
                              amount: rewardsAmount,
                              path: stakingPath,
                              stakeAddress,
                          },
                      ]
                    : [];

            return composeTxPlan(
                account.descriptor,
                account.utxo,
                certificates,
                withdrawals,
                changeAddress,
                getTtl(isTestnet(account.symbol)),
            );
        },
        [
            changeAddress,
            trezorPools,
            account.balance,
            account.descriptor,
            account.utxo,
            account.symbol,
            stakingPath,
            isStakingActive,
            rewardsAmount,
            stakeAddress,
        ],
    );

    const calculateFeeAndDeposit = useCallback(
        (action: 'delegate' | 'withdrawal') => {
            setLoading(true);
            try {
                const composeRes = prepareTxPlan(action);
                if (composeRes) {
                    setFee(composeRes.txPlan.fee);
                    setDeposit(composeRes.txPlan.deposit);
                    setActionAvailable(
                        composeRes.txPlan.type === 'final'
                            ? {
                                  status: true,
                              }
                            : {
                                  status: false,
                                  reason: 'TX_NOT_FINAL',
                              },
                    );
                }
            } catch (err) {
                setActionAvailable({
                    status: false,
                    reason: err instanceof CoinSelectionError ? err.code : err.message,
                });
            }

            setLoading(false);
        },
        [prepareTxPlan],
    );

    const signAndPushTransaction = useCallback(
        async (action: 'delegate' | 'withdrawal') => {
            const composeRes = prepareTxPlan(action);
            if (!composeRes) return;

            const { txPlan, certificates, withdrawals, changeAddress } = composeRes;

            if (!txPlan || txPlan.type !== 'final') return;

            const res = await trezorConnect.cardanoSignTransaction({
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
                device,
                useEmptyPassphrase: device?.useEmptyPassphrase,
                inputs: trezorUtils.transformToTrezorInputs(txPlan.inputs, account.utxo ?? []),
                outputs: trezorUtils.transformToTrezorOutputs(
                    txPlan.outputs,
                    changeAddress.addressParameters,
                ),
                fee: txPlan.fee,
                protocolMagic: getProtocolMagic(account.symbol),
                networkId: getNetworkId(account.symbol),
                derivationType: derivationType.value,
                ttl: getTtl(isTestnet(account.symbol)).toString(),
                ...(certificates.length > 0 ? { certificates } : {}),
                ...(withdrawals.length > 0 ? { withdrawals } : {}),
            });

            if (!res.success) {
                if (res.payload.error === 'tx-cancelled') return;
                addToast({
                    type: 'sign-tx-error',
                    error: res.payload.error,
                });
            } else {
                const signedTx = trezorUtils.signTransaction(
                    txPlan.tx.body,
                    res.payload.witnesses,
                    {
                        testnet: isTestnet(account.symbol),
                    },
                );
                const sentTx = await trezorConnect.pushTransaction({
                    tx: signedTx,
                    coin: account.symbol,
                });

                if (sentTx.success) {
                    const { txid } = sentTx.payload;
                    addToast({
                        type: 'raw-tx-sent',
                        txid,
                    });
                    setPendingStakeTx(account, txid);
                } else {
                    addToast({
                        type: 'sign-tx-error',
                        error: sentTx.payload.error,
                    });
                }
            }
        },
        [account, addToast, derivationType.value, device, prepareTxPlan, setPendingStakeTx],
    );

    const action = useCallback(
        async (action: 'delegate' | 'withdrawal') => {
            setError(undefined);
            setLoading(true);
            try {
                await signAndPushTransaction(action);
            } catch (error) {
                if (
                    error instanceof CoinSelectionError &&
                    error.code === 'UTXO_BALANCE_INSUFFICIENT'
                ) {
                    setError('AMOUNT_IS_NOT_ENOUGH');
                    addToast({
                        type:
                            action === 'delegate'
                                ? 'cardano-delegate-error'
                                : 'cardano-withdrawal-error',
                        error: error.code,
                    });
                } else {
                    addToast({
                        type: 'sign-tx-error',
                        error: error.message,
                    });
                }
            }
            setLoading(false);
        },
        [addToast, signAndPushTransaction],
    );

    const delegate = useCallback(() => action('delegate'), [action]);
    const withdraw = useCallback(() => action('withdrawal'), [action]);

    useEffect(() => {
        // Fetch ID of Trezor stake pool that will be used in delegation transaction
        const fetchTrezorPoolId = async () => {
            setLoading(true);
            setIsFetching(true);
            const url = network?.testnet ? CARDANO_STAKE_POOL_TESTNET : CARDANO_STAKE_POOL_MAINNET;
            try {
                const response = await fetch(url, { credentials: 'same-origin' });
                const responseJson = (await response.json()) as PoolsResponse;

                if (!responseJson || !('next' in responseJson) || !('pools' in responseJson)) {
                    throw Error('Invalid data format');
                }
                setTrezorPools(responseJson);
                setLoading(false);
            } catch (err) {
                setActionAvailable({
                    status: false,
                    reason: 'POOL_ID_FETCH_FAIL',
                });
            }
            setLoading(false);
            setIsFetching(false);
        };

        if (!trezorPools) {
            fetchTrezorPoolId();
        }
    }, [setTrezorPools, network, trezorPools]);

    return {
        deposit,
        fee,
        loading,
        pendingStakeTx,
        deviceAvailable: getDeviceAvailability(device, locks),
        actionAvailable,
        registeredPoolId,
        isActive: isStakingActive,
        rewards: rewardsAmount,
        address: stakeAddress,
        isStakingOnTrezorPool,
        isCurrentPoolOversaturated,
        trezorPools,
        delegate,
        withdraw,
        calculateFeeAndDeposit,
        error,
    };
};
