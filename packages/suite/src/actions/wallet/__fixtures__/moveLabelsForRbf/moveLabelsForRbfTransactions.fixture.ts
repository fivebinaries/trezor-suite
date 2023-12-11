import { TransactionsRootState } from '@suite-common/wallet-core';
import { WalletAccountTransaction } from '@suite-common/wallet-types';
import { accountReceivingCoins, accountSpendingCoins } from './moveLabelsForRbfAccounts.fixture';

export const originalTransactionSpendAccount: WalletAccountTransaction = {
    descriptor: accountSpendingCoins.descriptor,
    deviceState: 'mvbu1Gdy8SUjTenqerxUaZyYjmveZvt33q@AC94BB9C1B08FE73BE1E3322:0',
    symbol: 'regtest',
    type: 'sent',
    txid: '4ec6d03abb2e3e52a50301ee353621cbda13d7a6cb57bc8f373519af5b25026b(originalTransaction)',
    blockTime: 1702460477,
    blockHeight: undefined,
    blockHash: '2aa61579eee0e8a8263361c63c1632281a0b88af496fa9d1ff50380aa7931bc9',
    amount: '1800000000',
    fee: '6890',
    vsize: 240,
    feeRate: '28.71',
    targets: [
        {
            n: 1,
            addresses: ['bcrt1qq80deypyenykvjm6sws5522937u344vuhjk4qq'],
            isAddress: true,
            amount: '900000000',
        },
        {
            n: 2,
            addresses: ['bcrt1q7r9yvcdgcl6wmtta58yxf29a8kc96jkyyk8fsw'],
            isAddress: true,
            amount: '900000000',
        },
    ],
    tokens: [],
    internalTransfers: [],
    rbf: true,
    details: {
        vin: [
            {
                txid: '17b3aa686f4da9b5e12cdb556d277fe407fb4b3be7c571c527a53309824f76f7',
                sequence: 4294967293,
                n: 0,
                addresses: ['bcrt1qldlynaqp0hy4zc2aag3pkenzvxy65saej0huey'],
                isAddress: true,
                isOwn: true,
                value: '1000000000',
                isAccountOwned: true,
            },
            {
                txid: '1f10a72efb295d2161800fce9ae6496dfa23f1f08f816a76b4dcae34102f88f2',
                vout: 1,
                sequence: 4294967293,
                n: 1,
                addresses: ['bcrt1qkvwu9g3k2pdxewfqr7syz89r3gj557l374sg5v'],
                isAddress: true,
                isOwn: true,
                value: '1000000000',
                isAccountOwned: true,
            },
        ],
        vout: [
            {
                value: '199993110',
                n: 0,
                hex: '0014cc8067093f6f843d6d3e22004a4290cd0c0f336b',
                addresses: ['bcrt1qejqxwzfld7zr6mf7ygqy5s5se5xq7vmt8ntmj0'],
                isAddress: true,
                isOwn: true,
                isAccountOwned: true,
            },
            {
                value: '900000000',
                n: 1,
                spent: true,
                hex: '001401dedc9024ccc9664b7a83a14a29458fb91ad59c',
                addresses: ['bcrt1qq80deypyenykvjm6sws5522937u344vuhjk4qq'],
                isAddress: true,
            },
            {
                value: '900000000',
                n: 2,
                spent: true,
                hex: '0014f0ca4661a8c7f4edad7da1c864a8bd3db05d4ac4',
                addresses: ['bcrt1q7r9yvcdgcl6wmtta58yxf29a8kc96jkyyk8fsw'],
                isAddress: true,
            },
        ],
        size: 402,
        totalInput: '2000000000',
        totalOutput: '1999993110',
    },
};

export const transactionSendingCoinsReplacement: WalletAccountTransaction = {
    ...originalTransactionSpendAccount,
    txid: 'fd763c2bdf671f896a83b95d46a66c886812e1908abbf68540bb218be818868d(replacementTransaction)',
};

export const originalTransactionReceivingAccount: WalletAccountTransaction = {
    descriptor: accountReceivingCoins.descriptor,
    deviceState: 'mvbu1Gdy8SUjTenqerxUaZyYjmveZvt33q@AC94BB9C1B08FE73BE1E3322:0',
    symbol: 'regtest',
    type: 'recv',
    txid: '4ec6d03abb2e3e52a50301ee353621cbda13d7a6cb57bc8f373519af5b25026b(originalTransaction)',
    blockTime: 1702460477,
    blockHeight: undefined,
    blockHash: '2aa61579eee0e8a8263361c63c1632281a0b88af496fa9d1ff50380aa7931bc9',
    amount: '1800000000',
    fee: '6890',
    vsize: 240,
    feeRate: '28.71',
    targets: [
        {
            n: 1,
            addresses: ['bcrt1qq80deypyenykvjm6sws5522937u344vuhjk4qq'],
            isAddress: true,
            amount: '900000000',
            isAccountTarget: true,
        },
        {
            n: 2,
            addresses: ['bcrt1q7r9yvcdgcl6wmtta58yxf29a8kc96jkyyk8fsw'],
            isAddress: true,
            amount: '900000000',
            isAccountTarget: true,
        },
    ],
    tokens: [],
    internalTransfers: [],
    rbf: true,
    details: {
        vin: [
            {
                txid: '17b3aa686f4da9b5e12cdb556d277fe407fb4b3be7c571c527a53309824f76f7',
                sequence: 4294967293,
                n: 0,
                addresses: ['bcrt1qldlynaqp0hy4zc2aag3pkenzvxy65saej0huey'],
                isAddress: true,
                value: '1000000000',
            },
            {
                txid: '1f10a72efb295d2161800fce9ae6496dfa23f1f08f816a76b4dcae34102f88f2',
                vout: 1,
                sequence: 4294967293,
                n: 1,
                addresses: ['bcrt1qkvwu9g3k2pdxewfqr7syz89r3gj557l374sg5v'],
                isAddress: true,
                value: '1000000000',
            },
        ],
        vout: [
            {
                value: '199993110',
                n: 0,
                hex: '0014cc8067093f6f843d6d3e22004a4290cd0c0f336b',
                addresses: ['bcrt1qejqxwzfld7zr6mf7ygqy5s5se5xq7vmt8ntmj0'],
                isAddress: true,
            },
            {
                value: '900000000',
                n: 1,
                spent: true,
                hex: '001401dedc9024ccc9664b7a83a14a29458fb91ad59c',
                addresses: ['bcrt1qq80deypyenykvjm6sws5522937u344vuhjk4qq'],
                isAddress: true,
                isOwn: true,
                isAccountOwned: true,
            },
            {
                value: '900000000',
                n: 2,
                spent: true,
                hex: '0014f0ca4661a8c7f4edad7da1c864a8bd3db05d4ac4',
                addresses: ['bcrt1q7r9yvcdgcl6wmtta58yxf29a8kc96jkyyk8fsw'],
                isAddress: true,
                isOwn: true,
                isAccountOwned: true,
            },
        ],
        size: 402,
        totalInput: '2000000000',
        totalOutput: '1999993110',
    },
};

export const chainSpendingReceivedCoins: WalletAccountTransaction = {
    descriptor: accountReceivingCoins.descriptor,
    deviceState: 'mvbu1Gdy8SUjTenqerxUaZyYjmveZvt33q@AC94BB9C1B08FE73BE1E3322:0',
    symbol: 'regtest',
    type: 'self',
    txid: '46c84bcd1ef55ea64dab2853e577dffb26f31022fbf49c18981f2c186a3a2d80(chainSpendingReceivedCoins)',
    blockTime: 1702460477,
    blockHeight: undefined,
    blockHash: '2aa61579eee0e8a8263361c63c1632281a0b88af496fa9d1ff50380aa7931bc9',
    amount: '2090',
    fee: '2090',
    vsize: 209,
    feeRate: '10',
    targets: [
        {
            n: 1,
            addresses: ['bcrt1q6p7we05ktaksrp9c3m0rgnheqstdaljdx9gjaf'],
            isAddress: true,
            amount: '1700000000',
            isAccountTarget: true,
        },
    ],
    tokens: [],
    internalTransfers: [],
    rbf: true,
    details: {
        vin: [
            {
                txid: '4ec6d03abb2e3e52a50301ee353621cbda13d7a6cb57bc8f373519af5b25026b(originalTransaction)',
                vout: 1,
                sequence: 4294967293,
                n: 0,
                addresses: ['bcrt1qq80deypyenykvjm6sws5522937u344vuhjk4qq'],
                isAddress: true,
                isOwn: true,
                value: '900000000',
                isAccountOwned: true,
            },
            {
                txid: '4ec6d03abb2e3e52a50301ee353621cbda13d7a6cb57bc8f373519af5b25026b(originalTransaction)',
                vout: 2,
                sequence: 4294967293,
                n: 1,
                addresses: ['bcrt1q7r9yvcdgcl6wmtta58yxf29a8kc96jkyyk8fsw'],
                isAddress: true,
                isOwn: true,
                value: '900000000',
                isAccountOwned: true,
            },
        ],
        vout: [
            {
                value: '99997910',
                n: 0,
                hex: '0014f53c0a3c0fda171358099e53f6716125966644d1',
                addresses: ['bcrt1q757q50q0mgt3xkqfneflvutpyktxv3x3jfupg8'],
                isAddress: true,
                isOwn: true,
                isAccountOwned: true,
            },
            {
                value: '1700000000',
                n: 1,
                hex: '0014d07cecbe965f6d0184b88ede344ef90416defe4d',
                addresses: ['bcrt1q6p7we05ktaksrp9c3m0rgnheqstdaljdx9gjaf'],
                isAddress: true,
                isOwn: true,
                isAccountOwned: true,
            },
        ],
        size: 372,
        totalInput: '1800000000',
        totalOutput: '1799997910',
    },
};

export const moveLabelsForRbfTransactionsFixture: TransactionsRootState['wallet']['transactions']['transactions'] =
    {
        [accountSpendingCoins.key]: [originalTransactionSpendAccount],
        [accountReceivingCoins.key]: [
            originalTransactionReceivingAccount,
            chainSpendingReceivedCoins,
        ],
    };
