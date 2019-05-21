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
 * 重新加载用户数据
 * @param state
 * @param action
 * @returns {boolean}
 */
function user(state, action){
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
 * 右上角提示
 * @param state
 * @param action
 * @returns {{show: boolean, messages: (*|Array|string[]|*[])}}
 */
function passwor_modal(state, action){
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
 * 全局设置项目
 * @param state
 * @param action
 * @returns {*}
 */
function project(state, action){
    switch(action.type){
        case 'set':
            state = action.project;
            break;
        case 'default':
            state = {id: 0, name: 'Adoc'};
            break;
    }
    return state;
}

const Loading = createStore(loading);
const LoginModal = createStore(login_modal);
const Tips = createStore(tips);
const PasswordModal = createStore(passwor_modal);
const Project = createStore(project);
const User = createStore(user);
// Loading.subscribe(() => {console.log(Loading.getState())});
// Logined.subscribe(() => {console.log(Logined.getState())});

export {Loading, LoginModal, Tips, PasswordModal, Project, User};
