import { CoinmarketAmountContainer, CoinmarketAmountWrapper } from 'src/views/wallet/coinmarket';
import { FormattedCryptoAmount } from 'src/components/suite';
import { useCoinmarketInfo } from 'src/hooks/wallet/coinmarket/useCoinmarketInfo';
import { CoinmarketCoinLogo } from 'src/views/wallet/coinmarket/common/CoinmarketCoinLogo';
import { CryptoId } from 'invity-api';

interface CoinmarketCryptoAmountProps {
    amount: string | number;
    cryptoId: CryptoId;
}

export const CoinmarketFormOfferCryptoAmount = ({
    amount,
    cryptoId,
}: CoinmarketCryptoAmountProps) => {
    const { cryptoIdToCoinSymbol } = useCoinmarketInfo();
    const networkSymbol = cryptoIdToCoinSymbol(cryptoId);

    if (!networkSymbol) {
        return;
    }

    return (
        <CoinmarketAmountContainer>
            <CoinmarketAmountWrapper>
                <CoinmarketCoinLogo cryptoId={cryptoId} />
                <FormattedCryptoAmount
                    value={amount}
                    symbol={networkSymbol}
                    isRawString
                    isBalance
                />
            </CoinmarketAmountWrapper>
        </CoinmarketAmountContainer>
    );
};
