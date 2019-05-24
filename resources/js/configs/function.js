import {createStore} from 'redux';
import cogoToast from 'cogo-toast';
import NProgress from 'nprogress';
NProgress.configure({
    showSpinner: false,
});

/**
 * 全局顶部等待提示
 * @param state
 * @param action
 * @returns {boolean}
 */
function loading(state, action){
    switch (action.type) {
        case 'show':
            state = true;
            NProgress.start();
            break;
        case 'hide':
        default:
            state = false;
            NProgress.done();
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
    let options = {
        position: 'top-right',
    };
    let parse = function(messages){
        return [...messages].shift();
    };
    switch (action.type) {
        case 'success':
            // state = {show:true, messages: action.messages};
            cogoToast.success(parse(action.messages), options);
            break;
        case 'info':
            cogoToast.info(parse(action.messages), options);
            break;
        case 'loading':
            cogoToast.loading(parse(action.messages), options);
            break;
        case 'warn':
            cogoToast.warn(parse(action.messages), options);
            break;
        case 'error':
            cogoToast.error(parse(action.messages), options);
            break;
        default:
            // state = {show:false, messages : []};
            break;
    }
    return state;
}

function header_right(state, action){
    switch (action.type) {
        case 'add':
            state = {header_right: 'add', project_id: 0};
            break;
        case 'search':
            state = {header_right: 'search', project_id: action.project_id};
            break;
    }
    return state;
}


const Tips = createStore(tips);
const Loading = createStore(loading);
const HeaderRight = createStore(header_right);
export {Tips, Loading, HeaderRight};
