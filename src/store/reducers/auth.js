import { LOGIN_SUCCESFUL, LOGOUT } from '../actions/actions';

const initialState = {
    uid: null,
    email: null,
    token: null,
    expiryDate: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESFUL:
            return {
                ...state,
                uid: action.uid,
                email: action.email,
                token: action.token,
                expiryDate: action.expiryDate
            };
        case LOGOUT:
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