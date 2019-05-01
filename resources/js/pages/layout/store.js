import {createStore} from 'redux';

function loading(state, action){
    switch (action.type) {
        case true:
            state = 'd-none';
            break;
        case false:
            state = '';
            break;
        default:
            state = '';
    }
    return state;
}

const Loading = createStore(loading);
Loading.subscribe(() => {console.log(Loading.getState())});

export {Loading};
