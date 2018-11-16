import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';

const initialState = {
    token: null,
    expiryDate: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_SET_TOKEN:
            return {
                ...state,
                uid: action.uid,
                email: action.email,
                token: action.token,
                expiryDate: action.expiryDate
            };
        case AUTH_REMOVE_TOKEN:
            return {
                ...state,
                uid: null,
                email: null,
                token: null,
                expiryDate: null
            };
        default:
            return state;
    }
};

export default reducer;