import produce from 'immer';
import { getUnixTime } from 'date-fns';
import { Action } from '@suite-types';
import { MESSAGE_SYSTEM, STORAGE } from '@suite/actions/suite/constants';
import { MessageSystem } from '@suite/types/suite/messageSystem';

export type State = {
    currentSequence: number;
    config: MessageSystem | null;

    isFetching: boolean;
    hasError: boolean;
    timestamp: number;
};

const initialState: State = {
    currentSequence: 0,
    config: null,

    isFetching: false,
    hasError: false,
    timestamp: 0,
};

const messageSystemReducer = (state: State = initialState, action: Action): State => {
    return produce(state, draft => {
        switch (action.type) {
            case STORAGE.LOADED:
                return action.payload.messageSystem;
            case MESSAGE_SYSTEM.FETCH_INIT:
                draft.isFetching = true;
                draft.hasError = false;
                break;
            case MESSAGE_SYSTEM.FETCH_SUCCESS_UPDATE:
                draft.config = action.payload;
                draft.currentSequence = action.payload.sequence; // TODO: check
            // eslint-disable-next-line no-fallthrough
            case MESSAGE_SYSTEM.FETCH_SUCCESS:
                draft.timestamp = getUnixTime(new Date());
                draft.isFetching = false;
                draft.hasError = false;
                break;
            case MESSAGE_SYSTEM.FETCH_FAILURE:
                draft.isFetching = false;
                draft.hasError = true;
                draft.timestamp = 0;
                break;
            default:
                break;
        }
    });
};

export default messageSystemReducer;
