import cogoToast from 'cogo-toast';
import NProgress from 'nprogress';
NProgress.configure({
    showSpinner: false,
});

/**
 * 全局顶部等待提示
 * @param close
 * @returns {boolean}
 */
function Loading(close = false){
    if(!close){
        NProgress.start();
    }else{
        NProgress.done();
    }
    return true;
}

/**
 * 右上角提示
 * @param message
 * @param type
 * @returns boolean
 */
function Tips(message, type = 'info'){
    let options = {
        position: 'top-right',
    };
    switch (type) {
        case 'info':
            cogoToast.info(message, options);
            break;
        case 'succ':
        case 'success':
            cogoToast.success(message, options);
            break;
        case 'loading':
            cogoToast.loading(message, options);
            break;
        case 'warn':
        case 'warning':
            cogoToast.warn(message, options);
            break;
        case 'error':
            cogoToast.error(message, options);
            break;
        default:
            // state = {show:false, messages : []};
            break;
    }
    return true;
}


export {Tips, Loading};
