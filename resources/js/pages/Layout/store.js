import {createStore} from 'redux';

function loading(state, action){
    switch (action.type) {
        case false:
            state = '';
            break;
        case true:
        
        default:
            state = 'd-none';
    }
    return state;
}

const Loading = createStore(loading);
Loading.subscribe(() => {console.log(Loading.getState())});

export {Loading};
