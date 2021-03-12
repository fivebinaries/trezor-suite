import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';

const Wrapper = styled.div`
    display: flex;
`;

interface Props {
    initialized: boolean;
}

const SecurityCheck = ({ initialized }: Props) => {
    return (
        <Wrapper>SecurityCheck for {initialized ? 'initialized' : 'uninitialized'} device</Wrapper>
    );
};

export default SecurityCheck;
