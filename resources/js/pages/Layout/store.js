import {createStore} from 'redux';

/**
 * 全局加赞中动画效果
 * @param state
 * @param action
 * @returns {boolean}
 */
function loading(state, action){
    switch (action.type) {
        case 'show':
            state = false;
            break;
        case 'hide':
            state = true;
            break;
    }
    return state;
}

/**
 * 控制登陆弹窗的显示
 * @param state
 * @param action
 * @returns {boolean}
 */
function login_modal(state, action){
    switch (action.type) {
        case 'show':
            state = true;
            break;
        case 'hide':
            state = false;
            break;
    }
    return state;
}

function tips(state, action){
    switch (action.type) {
        case 'show':
            state = {show:true, messages: action.messages};
            break;
        case 'hide':
            state = {show:false, messages : []};
            break;
    }
    return state;
}

const Loading = createStore(loading);
const LoginModal = createStore(login_modal);
const Tips = createStore(tips);
// Loading.subscribe(() => {console.log(Loading.getState())});
// Logined.subscribe(() => {console.log(Logined.getState())});

export {Loading, LoginModal, Tips};
