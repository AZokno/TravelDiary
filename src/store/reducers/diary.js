import { SET_ENTRIES, REMOVE_ENTRY, ENTRY_ADDED, START_ADD_ENTRY, CLEAR_LIST } from '../actions/actionTypes';

const initialState = {
    entries: [],
    entryAdded: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ENTRIES:
            return {
                ...state,
                entries: action.entries
            };
        case REMOVE_ENTRY:
            return {
                ...state,
                entries: state.entries.filter(entry => {
                    return entry.key !== action.key;
                })
            };
        case START_ADD_ENTRY:
            return {
                ...state,
                entryAdded: false
            };
        case ENTRY_ADDED:
            return {
                ...state,
                entryAdded: true
            };
        case CLEAR_LIST:
            return {
                ...state,
                entries: []
            };
        default:
            return state;
    }
};

export default reducer;