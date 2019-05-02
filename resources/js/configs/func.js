import {Loading} from '../pages/Layout/store'

/**
 * 显示/隐藏 loading 状态
 * @param close
 */
const loading = function(close = false){
    Loading.dispatch({type: close});
};

const tips = function(message){
    // alert(message);
    console.log(message);
};

export {loading, tips};
