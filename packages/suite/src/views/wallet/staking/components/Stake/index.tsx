import React, { useEffect } from 'react';
import styled from 'styled-components';
import { formatNetworkAmount } from '@wallet-utils/accountUtils';
import { Button, Icon, Tooltip } from '@trezor/components';
import { Translation } from '@suite-components/Translation';
import { useCardanoStaking, getReasonForDisabledAction } from '@wallet-hooks/useCardanoStaking';
import ActionInProgress from '../ActionInProgress';
import { Account } from '@wallet-types';
import {
    Title,
    Row,
    Column,
    InfoBox,
    Actions,
    Heading,
    ValueSmall,
    Text,
    StyledCard,
    Content,
    StyledH1,
} from '../primitives';

const ColumnDeposit = styled(Column)`
    margin-left: 30px;
`;

const Delegate = (props: { account: Account }) => {
    const {
        address,
        delegate,
        deposit,
        calculateFeeAndDeposit,
        fee,
        loading,
        actionAvailable,
        deviceAvailable,
        pendingStakeTx,
    } = useCardanoStaking();
    const { account } = props;

    useEffect(() => {
        calculateFeeAndDeposit('delegate');
    }, [calculateFeeAndDeposit]);

    const actionButton = (
        <Button
            isDisabled={
                account.availableBalance === '0' ||
                !actionAvailable.status ||
                !deviceAvailable.status ||
                !!pendingStakeTx
            }
            isLoading={loading}
            onClick={() => delegate()}
            icon="T2"
        >
            <Translation id="TR_STAKING_DELEGATE" />
        </Button>
    );

    const reasonMessageId = getReasonForDisabledAction(actionAvailable?.reason);

    return (
        <StyledCard>
            <StyledH1>
                <Icon icon="CROSS" size={25} />
                <Heading>
                    <Translation id="TR_STAKING_STAKE_TITLE" />
                </Heading>
            </StyledH1>
            <Text>
                <Translation id="TR_STAKING_STAKE_DESCRIPTION" values={{ br: <br /> }} />
            </Text>
            <Row>
                <Content>
                    <Column>
                        <Title>
                            <Translation id="TR_STAKING_STAKE_ADDRESS" />
                        </Title>
                        <ValueSmall>{address}</ValueSmall>
                    </Column>
                </Content>
            </Row>
            <Row>
                {actionAvailable.status && !pendingStakeTx ? (
                    // delegation is allowed
                    <>
                        <Column>
                            <Title>
                                <Translation id="TR_STAKING_DEPOSIT" />
                            </Title>
                            <ValueSmall>
                                {formatNetworkAmount(deposit || '0', account.symbol)}{' '}
                                {account.symbol.toUpperCase()}
                            </ValueSmall>
                        </Column>
                        <ColumnDeposit>
                            <Title>
                                <Translation id="TR_STAKING_FEE" />
                            </Title>
                            <ValueSmall>
                                {formatNetworkAmount(fee || '0', account.symbol)}{' '}
                                {account.symbol.toUpperCase()}
                            </ValueSmall>
                        </ColumnDeposit>
                    </>
                ) : (
                    // If building a transaction fails we don't have the information about used deposit and fee required
                    <>
                        {!actionAvailable.status &&
                            actionAvailable.reason === 'UTXO_BALANCE_INSUFFICIENT' && (
                                <Column>
                                    <InfoBox>
                                        <Translation id="TR_STAKING_NOT_ENOUGH_FUNDS" />
                                        <Translation
                                            id="TR_STAKING_DEPOSIT_FEE_DECRIPTION"
                                            values={{ feeAmount: 2 }}
                                        />
                                    </InfoBox>
                                </Column>
                            )}
                        {pendingStakeTx && <ActionInProgress />}
                    </>
                )}
            </Row>
            <Actions>
                {deviceAvailable.status && actionAvailable.status ? (
                    actionButton
                ) : (
                    <Tooltip
                        maxWidth={285}
                        content={reasonMessageId ? <Translation id={reasonMessageId} /> : undefined}
                    >
                        {actionButton}
                    </Tooltip>
                )}
            </Actions>
        </StyledCard>
    );
};

export default Delegate;
