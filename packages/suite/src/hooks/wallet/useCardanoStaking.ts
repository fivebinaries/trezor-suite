import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { Props, ContextValues } from '@wallet-types/cardanoStaking';
import { SUITE } from '@suite-actions/constants';
import trezorConnect, {
    CardanoCertificate,
    CardanoCertificateType,
    CardanoTxSigningMode,
} from 'trezor-connect';
import { useActions } from '@suite-hooks';
import * as notificationActions from '@suite-actions/notificationActions';
import * as accountActions from '@wallet-actions/accountActions';
import {
    getStakingPath,
    prepareCertificates,
    transformUtxos,
    getProtocolMagic,
    getNetworkId,
    getChangeAddressParameters,
} from '@wallet-utils/cardanoUtils';
import { coinSelection, trezorUtils, CoinSelectionError } from '@fivebinaries/coin-selection';
import { isTestnet } from '@suite/utils/wallet/accountUtils';

export const useCardanoStaking = (props: Props): ContextValues => {
    const URL_MAINNET = 'https://trezor-cardano-mainnet.blockfrost.io/api/v0/pools/';
    const URL_TESTNET = 'https://trezor-cardano-testnet.blockfrost.io/api/v0/pools/';
    const { addToast, fetchAndUpdateAccount } = useActions({
        addToast: notificationActions.addToast,
        fetchAndUpdateAccount: accountActions.fetchAndUpdateAccount,
    });
    const [trezorPoolId, setTrezorPoolId] = useState<undefined | string>(undefined);
    const [deposit, setDeposit] = useState<undefined | string>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [fee, setFee] = useState<undefined | string>(undefined);
    const { account, network } = props.selectedAccount;
    const utxos = transformUtxos(account.utxo);
    const stakingPath = getStakingPath(account.accountType, account.index);
    const isStakingActive =
        account.networkType === 'cardano' ? account.misc.staking.isActive : false;

    const getCertificates = useCallback(() => {
        if (account.networkType !== 'cardano') return [];
        const result: CardanoCertificate[] = [
            {
                type: CardanoCertificateType.STAKE_DELEGATION,
                path: stakingPath,
                pool: trezorPoolId,
            },
        ];

        if (!isStakingActive) {
            result.unshift({
                type: CardanoCertificateType.STAKE_REGISTRATION,
                path: stakingPath,
            });
        }

        return result;
    }, [account.networkType, isStakingActive, stakingPath, trezorPoolId]);

    const composeTxPlan = useCallback(
        (action: 'delegate' | 'withdrawal') => {
            const changeAddress = getChangeAddressParameters(account);
            if (!changeAddress || account.networkType !== 'cardano') return null;
            const certificates = action === 'delegate' ? getCertificates() : [];
            const withdrawals =
                action === 'withdrawal'
                    ? [
                          {
                              amount: account.misc.staking.rewards,
                              path: stakingPath,
                              stakeAddress: account.misc.staking.address,
                          },
                      ]
                    : [];
            const txPlan = coinSelection(
                utxos,
                [],
                changeAddress.address,
                prepareCertificates(certificates),
                withdrawals,
                account.descriptor,
            );
            console.log('txPlan', txPlan);
            return { txPlan, certificates, withdrawals, changeAddress };
        },
        [account, getCertificates, stakingPath, utxos],
    );

    const calculateFeeAndDeposit = useCallback(
        (action: 'delegate' | 'withdrawal') => {
            setLoading(true);
            try {
                const composeRes = composeTxPlan(action);
                if (composeRes) {
                    setFee(composeRes.txPlan.fee);
                    setDeposit(composeRes.txPlan.deposit);
                }
            } catch (err) {
                console.warn(err);
            }

            setLoading(false);
        },
        [composeTxPlan],
    );

    const signAndPushTransaction = async (action: 'delegate' | 'withdrawal') => {
        const composeRes = composeTxPlan(action);
        if (!composeRes || !account.utxo) return;

        const { txPlan, certificates, withdrawals, changeAddress } = composeRes;
        if (!txPlan || txPlan.type !== 'final') return;

        const res = await trezorConnect.cardanoSignTransaction({
            signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            device: props.device,
            useEmptyPassphrase: props.device?.useEmptyPassphrase,
            inputs: trezorUtils.transformToTrezorInputs(txPlan.inputs, account.utxo),
            outputs: trezorUtils.transformToTrezorOutputs(
                txPlan.outputs,
                changeAddress.addressParameters,
            ),
            fee: txPlan.fee,
            protocolMagic: getProtocolMagic(network.symbol),
            networkId: getNetworkId(network.symbol),
            derivationType: props.derivationType.value,
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
            const signedTx = trezorUtils.signTransaction(txPlan.tx.body, res.payload.witnesses, {
                testnet: isTestnet(account.symbol),
            });
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
                fetchAndUpdateAccount(account);
            }
        }
    };

    const delegate = async () => {
        setError(undefined);
        setLoading(true);
        try {
            await signAndPushTransaction('delegate');
        } catch (error) {
            if (error instanceof CoinSelectionError && error.code === 'UTXO_BALANCE_INSUFFICIENT') {
                setError('AMOUNT_IS_NOT_ENOUGH');
                addToast({
                    type: 'cardano-delegate-error',
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
    };

    const withdraw = async () => {
        setError(undefined);
        setLoading(true);
        try {
            await signAndPushTransaction('withdrawal');
        } catch (error) {
            if (error instanceof CoinSelectionError && error.code === 'UTXO_BALANCE_INSUFFICIENT') {
                setError('AMOUNT_IS_NOT_ENOUGH');
                addToast({
                    type: 'cardano-withdrawal-error',
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
    };

    useEffect(() => {
        const fetchTrezorPoolId = async () => {
            setLoading(true);
            const url = network.testnet ? URL_TESTNET : URL_MAINNET;
            try {
                const response = await fetch(url, { credentials: 'same-origin' });
                const responseJson: { pool: string } = await response.json();
                setTrezorPoolId(responseJson.pool);
                setLoading(false);
            } catch (err) {
                console.log('err', err);
            }
            setLoading(false);
        };

        if (!trezorPoolId) {
            fetchTrezorPoolId();
        }
    }, [setTrezorPoolId, network, trezorPoolId]);

    return {
        account,
        deposit,
        fee,
        isLocked: props.locks.includes(SUITE.LOCK_TYPE.DEVICE),
        registeredPoolId: account.networkType === 'cardano' ? account.misc.staking.poolId : null,
        isActive: account.networkType === 'cardano' ? account.misc.staking.isActive : false,
        rewards: account.networkType === 'cardano' ? account.misc.staking.rewards : '0',
        address: account.networkType === 'cardano' ? account.misc.staking.address : '',
        trezorPoolId,
        delegate,
        withdraw,
        loading,
        calculateFeeAndDeposit,
        error,
    };
};

export const CardanoStakingContext = createContext<ContextValues | null>(null);
CardanoStakingContext.displayName = 'CardanoStakingContext';

export const useCardanoStakingContext = () => {
    const context = useContext(CardanoStakingContext);
    if (context === null) throw Error('CardanoStakingContext used without Context');
    return context;
};
