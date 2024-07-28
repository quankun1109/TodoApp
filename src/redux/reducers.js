import { combineReducers } from 'redux';

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, action.payload];
        case 'UPDATE_TODO':
            return state.map((todo) => (todo.id === action.id ? { ...todo, ...action.updates } : todo));
        case 'DELETE_TODO':
            return state.filter((todo) => todo.id !== action.payload);
        case 'SET_TODOS':
            return action.payload;
        default:
            return state;
    }
};

const auth = (state = { userId: null }, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, userId: action.payload.uid };
        default:
            return state;
    }
};

export default combineReducers({
    todos,
    auth,
});
