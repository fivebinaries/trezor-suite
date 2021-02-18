/* eslint-disable global-require */
import React from 'react';
import styled from 'styled-components';

import T1 from '../../images/trezor/T1.png';
import T2 from '../../images/trezor/T2.png';

interface Props {
    trezorModel: 1 | 2;
    height?: string | number;
    className?: string;
}

const Image = styled.img``;

const DeviceImage = ({ trezorModel, height = '100%', className }: Props) => {
    switch (trezorModel) {
        case 1:
            return <Image className={className} height={height} alt="trezor T1" src={T1} />;
        case 2:
            return <Image className={className} height={height} alt="trezor T2" src={T1} />;
        // no default
    }
};

export { DeviceImage, Props as DeviceImageProps };
