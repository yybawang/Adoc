import {Loading, Tips} from "./function";
import axios from 'axios';
import history from './history'

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
/**
 * 请求拦截
 */
axios.interceptors.request.use(function (config) {
    // 请求发起之前要做的事
    Loading();
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
    Loading(true);
    if (response.status === 200) {
        if(response.data.code !== 0){
            return Promise.reject(response.data.message);
        }
        return Promise.resolve(response.data.data);
    } else {
        // api 不会返回非 200 状态，所以肯定中间环节哪里有问题
        Tips('oHo~ something was wrong', 'error');
        return Promise.reject('oHo~ something was wrong');
    }
}, function (errors){
    Loading(true);
    if(errors.response.status === 401){
        // 存入验证前的网页，登录/注册后再跳回来
        if(location.pathname !== '/login' && location.pathname !== '/register'){
            localStorage.setItem('auth_jump', location.pathname);
        }
        Tips('请先登录');
        history.push('/login');
        return Promise.reject(errors.response.data.message);
    }
    if(errors.response.status === 422){
        Tips(errors.response.data.message, 'warn');
        return Promise.reject('数据验证失败');
    }
    let message = "网络错误，请稍后重试";
    if (errors.response) {
        message = errors.response.data.message;
    }else if (errors.request){
        message = "发起请求失败";
    }
    Tips(message, 'warn');
    return Promise.reject(message);
});

export default axios;
