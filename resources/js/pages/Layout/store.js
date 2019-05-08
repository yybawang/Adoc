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

/**
 * 右上角提示
 * @param state
 * @param action
 * @returns {{show: boolean, messages: (*|Array|string[]|*[])}}
 */
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

/**
 * 设置项目名，页面头部左上角显示
 * @param state
 * @param action
 * @returns {*}
 */
function project_name(state, action){
    switch(action.type){
        case 'set':
            state = action.name;
            break;
    }
    return state;
}

const Loading = createStore(loading);
const LoginModal = createStore(login_modal);
const Tips = createStore(tips);
const ProjectName = createStore(project_name);
// Loading.subscribe(() => {console.log(Loading.getState())});
// Logined.subscribe(() => {console.log(Logined.getState())});

export {Loading, LoginModal, Tips, ProjectName};
