import {loading, tips} from './func';
import axios from 'axios';
/**
 * 请求拦截
 */
axios.interceptors.request.use(function (config) {
    // 请求发起之前的判断
    loading();
    return config;
}, function (error) {
    return Promise.reject(error);
});

/**
 * 响应拦截
 */
axios.interceptors.response.use(function (response){
    loading(true);
    if (response.status === 200) {
        return Promise.resolve(response.data);
    } else {
        // api 不会返回非 200 状态，所以肯定中间环节哪里有问题
        tips('oHo~ something was wrong');
        return Promise.reject('oHo~ something was wrong');
    }
}, function (errors){
    loading(true);
    if(errors.response.status === 401){
        // 后面这里要改成弹窗
        location.href = '/login';
        return;
    }
    let message = "Network Error";
    if (errors.response) {
        message = errors.response.data.message;
    }else if (errors.request){
        message = "Request Failed";
    }
    tips(message);
    return Promise.reject(message);
});

export default axios;
