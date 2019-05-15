import {Loading, LoginModal, Tips} from "../pages/Layout/store";
import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
/**
 * 请求拦截
 */
axios.interceptors.request.use(function (config) {
    // 请求发起之前要做的事
    Loading.dispatch({type: 'show'});
    // 实时带入 token
    let $token = localStorage.getItem('api_token') || '';
    config.headers.Authorization = 'Bearer ' + $token;
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

/**
 * 响应拦截
 */
axios.interceptors.response.use(function (response){
    Loading.dispatch({type: 'hide'});
    if (response.status === 200) {
        if(response.data.code !== 0){
            return Promise.reject(response.data.message);
        }
        return Promise.resolve(response.data.data);
    } else {
        // api 不会返回非 200 状态，所以肯定中间环节哪里有问题
        Tips.dispatch({type: 'show', messages: ['oHo~ something was wrong']});
        return Promise.reject('oHo~ something was wrong');
    }
}, function (errors){
    Loading.dispatch({type: 'hide'});
    if(errors.response.status === 401){
        LoginModal.dispatch({type: 'show'});
        return Promise.reject(errors.response.data.message);
    }
    if(errors.response.status === 422){
        let messages = [];
        for(let i in errors.response.data.errors){
            messages.push(errors.response.data.errors[i].shift());
        }
        Tips.dispatch({
            type: 'show',
            messages : messages,
        });
        return Promise.reject(message);
    }
    let message = "Network Error";
    if (errors.response) {
        message = errors.response.data.message;
    }else if (errors.request){
        message = "Request Failed";
    }
    Tips.dispatch({
        type: 'show',
        messages : [message],
    });
    return Promise.reject(message);
});

export default axios;
