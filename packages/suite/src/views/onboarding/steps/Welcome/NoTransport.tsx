import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';

const Wrapper = styled.div`
    display: flex;
`;

const NoTransport = () => {
    return <Wrapper>No transport</Wrapper>;
};

export default NoTransport;
