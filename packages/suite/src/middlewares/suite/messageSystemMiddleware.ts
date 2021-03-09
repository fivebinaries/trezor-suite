import { MiddlewareAPI } from 'redux';
import { TRANSPORT, DEVICE } from 'trezor-connect';
import { MESSAGE_SYSTEM } from '@suite-actions/constants';
import { AppState, Action, Dispatch } from '@suite-types';
import { getValidMessages, Options } from '@suite-utils/messageSystem';
import { SUITE } from '@suite-actions/constants';

const messageSystemMiddleware = (api: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (
    action: Action,
): Action => {
    next(action);

    if (
        action.type === SUITE.SELECT_DEVICE ||
        action.type === SUITE.TOR_STATUS ||
        action.type === DEVICE.CHANGED ||
        action.type === TRANSPORT.START ||
        action.type === MESSAGE_SYSTEM.FETCH_SUCCESS_UPDATE
    ) {
        const { config } = api.getState().messageSystem;
        const { device, transport, tor } = api.getState().suite;
        const { enabledNetworks } = api.getState().wallet.settings;

        const options: Options = {
            device,
            transport,
            tor,
            enabledNetworks,
        };

        const messages = getValidMessages(config, options);

        // TODO: save valid messages
    }

    return action;
};

export default messageSystemMiddleware;
