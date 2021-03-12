import React from 'react';
import { useSpring, useTransition, config, animated } from 'react-spring';
import { H1, TrezorLogo, Button, variables, Icon } from '@trezor/components';
import { TrezorLink, Translation } from '@suite-components';
import { useTheme } from '@suite-hooks';
import styled from 'styled-components';
import { TREZOR_URL } from '@suite-constants/urls';

const Wrapper = styled(animated.div)`
    display: flex;
    /* width: 340px; */
    height: 122px;
    border-radius: 61px;
    padding: 10px;
    background: ${props => props.theme.BG_WHITE};
    align-items: center;
    box-shadow: 0 2px 5px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    margin-bottom: 60px;
`;

const ImageWrapper = styled.div`
    display: flex;
    position: relative;
`;
const Checkmark = styled.div`
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Img = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
`;

const Text = styled.div`
    display: flex;
    margin: 0px 32px;
    text-align: center;
    color: ${props => props.theme.TYPE_DARK_GREY};
    display: flex;
    font-size: 20px;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

interface Props {
    children?: React.ReactNode;
    connected: boolean;
    showWarning: boolean;
}

const getDefaultMessage = (connected: boolean, showWarning: boolean) => {
    if (connected) {
        return !showWarning ? 'Device is connected' : 'Connected but has issues';
    }
    return 'Connect device pls';
};
const ConnectDevicePrompt = ({ children, connected, showWarning }: Props) => {
    const { theme } = useTheme();
    const fadeStyles = useSpring({
        config: config.default,
        transform: 'translate(0px, 0px)',
        from: { opacity: 0, transform: 'translate(0px, -50px)' },
        to: {
            opacity: 1,
            transform: 'translate(0px, 0px)',
        },
        delay: 200,
    });
    return (
        <Wrapper style={fadeStyles}>
            <ImageWrapper>
                <Img />
                <Checkmark>
                    {connected && !showWarning && (
                        <Icon icon="CHECK_ACTIVE" size={24} color={theme.TYPE_GREEN} />
                    )}
                    {showWarning && (
                        <Icon icon="WARNING_ACTIVE" size={24} color={theme.TYPE_ORANGE} />
                    )}
                </Checkmark>
            </ImageWrapper>
            <Text>{children || getDefaultMessage(connected, showWarning)}</Text>
        </Wrapper>
    );
};

export default ConnectDevicePrompt;
