import {createStore} from "redux";

function active(state, action){
    switch (action.type) {
        default: state = action.page;
            break;
    }
    return state;
}

const Active = createStore(active);

export {Active};
