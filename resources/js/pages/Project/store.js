import {createStore} from "redux";

function post_id(state, action){
    switch (action.type) {
        case 'set':
            state = parseInt(action.id);
            break;
    }
    return state;
}

const postId = createStore(post_id);

export {postId};
