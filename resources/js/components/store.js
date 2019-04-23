import {createStore} from "redux";

function count(state = 0, action){
    switch (action.type) {
        case 'inc':
            state += action.num;
            break;
        case 'dec':
            state -= action.num;
            break;
        default: break;
    }
    return state;
}

let store = createStore(count);

store.subscribe(() => console.log(store.getState()));

export default store;
