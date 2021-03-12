import React from 'react';
import TrezorConnect from 'trezor-connect';
import styled from 'styled-components';
import { Text } from '@onboarding-components';
import { Button, variables } from '@trezor/components';
import { Translation } from '@suite/components/suite';
import { ConnectedDeviceStatus } from '@onboarding-types';

const Wrapper = styled.div`
    display: flex;
`;

interface Props {
    deviceStatus: ConnectedDeviceStatus;
}
const UnexpectedDeviceState = ({ deviceStatus }: Props) => {
    return (
        <>
            {deviceStatus === 'unreadable' && (
                <>
                    user ocnnected unreadable device, we don't really know what happened show box
                    with helpful copy + button to disable webusb if relevant
                    <Text>
                        <Translation id="TR_YOUR_DEVICE_IS_CONNECTED_BUT_UNREADABLE" />
                    </Text>
                    <Button onClick={() => TrezorConnect.disableWebUSB()}>
                        <Translation id="TR_TRY_BRIDGE" />
                    </Button>
                </>
            )}
            {deviceStatus === 'in-bootloader' && (
                <>
                    bah bootloader, but we need normal mode for now
                    <Text>
                        <Translation id="TR_CONNECTED_DEVICE_IS_IN_BOOTLOADER" />
                    </Text>
                </>
            )}
            {deviceStatus === 'seedless' && (
                <Text>
                    seedless device, stop onboarding
                    <Translation id="TR_YOUR_DEVICE_IS_SEEDLESS" />
                </Text>
            )}
        </>
    );
};

export default UnexpectedDeviceState;
