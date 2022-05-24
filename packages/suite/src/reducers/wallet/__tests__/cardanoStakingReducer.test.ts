import reducer, { initialState } from '@wallet-reducers/cardanoStakingReducer';
import { CARDANO_STAKING } from '@wallet-actions/constants';

describe('cardanoStakingReducer reducer', () => {
    it('test initial state', () => {
        expect(
            reducer(undefined, {
                // @ts-ignore
                type: 'none',
            }),
        ).toEqual(initialState);
    });

    it('CARDANO_STAKING.ADD_PENDING_STAKE_TX', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.ADD_PENDING_STAKE_TX,
                pendingStakeTx: {
                    accountKey: 'key',
                    txid: 'txxid',
                    blockHeight: 1,
                },
            } as any),
        ).toEqual({
            isFetchError: false,
            isFetchLoading: false,
            trezorPools: undefined,
            pendingTx: [
                {
                    accountKey: 'key',
                    blockHeight: 1,
                    txid: 'txxid',
                },
            ],
        });
    });

    it('CARDANO_STAKING.REMOVE_PENDING_STAKE_TX', () => {
        expect(
            reducer(
                {
                    pendingTx: [
                        {
                            accountKey: 'key',
                            ts: 1,
                            txid: 'txxid',
                        },
                    ],
                    trezorPools: {
                        pools: [],
                        next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                    },
                    isFetchError: false,
                    isFetchLoading: false,
                },
                {
                    type: CARDANO_STAKING.REMOVE_PENDING_STAKE_TX,
                    accountKey: 'key',
                } as any,
            ),
        ).toEqual({
            pendingTx: [],
            trezorPools: {
                pools: [],
                next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
            },
            isFetchError: false,
            isFetchLoading: false,
        });
    });
});
