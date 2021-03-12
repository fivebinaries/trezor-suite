import React from 'react';
import TrezorConnect from 'trezor-connect';
import { useSpring, useTransition, config, animated } from 'react-spring';
import styled from 'styled-components';
import { Text } from '@onboarding-components';
import { Translation, WebusbButton } from '@suite-components';
import { variables, Button } from '@trezor/components';

const Wrapper = styled(animated.div)`
    display: flex;
    justify-content: space-between;
    padding: 20px 28px;
    border-radius: 6px;
    background: ${props => props.theme.BG_WHITE};
    border-radius: 1px solid ${props => props.theme.STROKE_GREY};
`;

interface Props {
    offerWebUsb: boolean;
}
const NoDeviceDetected = ({ offerWebUsb }: Props) => {
    const fadeStyles = useSpring({
        config: { ...config.default },
        delay: 1000,
        from: { opacity: 0 },
        to: { opacity: 1 },
    });
    return (
        <Wrapper style={fadeStyles}>
            {/* box with helpful copy what might be the reasons why we cant detect the device + webusb button */}
            {offerWebUsb && (
                <WebusbButton ready>
                    <Button icon="SEARCH">
                        <Translation id="TR_CHECK_FOR_DEVICES" />
                    </Button>
                </WebusbButton>
                // User downloads bridge, now he may need to disable WebUSB to switch to bridge
                // <Button
                //     variant="secondary"
                //     data-test="@onboarding/try-bridge-button"
                //     onClick={() => TrezorConnect.disableWebUSB()}
                // >
                //     <Translation id="TR_TRY_BRIDGE" />
                // </Button>
            )}
            {/* TODO: blabla message and box with helpful tips */}
            <Text>Device not detected? HALP</Text>
        </Wrapper>
    );
};

export default NoDeviceDetected;
