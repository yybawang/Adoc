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

/**
 * 匹配到汉字长度
 * @param strValue
 * @return {string|*}
 * @constructor
 */
function stringChineseLength(strValue) {
    let reg = /[\u4e00-\u9fa5]/g;
    let len = 0;
    let chinese = strValue.match(reg);
    if(chinese){
        len = chinese.join("").length;
    }
    return len;
}

/**
 * 获取字符串长度
 * 中文为两字节
 * @param str
 * @returns {number}
 * @constructor
 */
function stringLength(str){
    if(!str){
        return 0;
    }
    return str.replace(/[\u0391-\uFFE5]/g, "00").length;  //先把中文替换成两个字节的英文，在计算长度
}

function calcLength(str){
    if(!str){
        return 0;
    }
    let len = str.length;
    let len_chinese = stringChineseLength(str);
    if(len_chinese >= 2){
        len += len_chinese - 1;
    }
    if(Math.floor(len_chinese / 8) > 0){
        len -= Math.floor(len_chinese / 8);
    }
    if(Math.floor(len_chinese / 5) > 0){
        len -= Math.floor(len_chinese / 5);
    }
    
    return len;
}

function stringPadEnd(str, length = null, char = ' '){
    let len = calcLength(str);
    if(length > len){
        let pad = '';
        for(let i = 0; i < length - len; i++){
            pad += char;
        }
        str += pad;
    }
    return str;
}

/**
 * 格式化 markdown 表格源码
 * 1. 等宽空格，超过 20 个字符不计算，避免太长
 *
 * @param table
 * @return string
 */
function FormatMDTable(table){
    // 横向变纵向，纵向变横向
    const flip = (arrs) => arrs[0].map((col, i) =>
        arrs.map((row) => row[i])
    );
    let tr = table.split('\n');
    let fields = [], fields_max = [];
    for(let i in tr){
        let tds = tr[i].split('|');
        fields.push(tds);
    }
    let fields_flip = flip(fields);
    let maxs = fields_flip.map(row => {
        let max = 0;
        return collect(row.map(col => max = col.length > 20 ? max :Math.max(max, stringLength(col)))).max()
    });
    let table_new = fields_flip.map((row, i) => {
        return row.map(col => stringPadEnd(col, maxs[i]))
    });
    return flip(table_new).map(tr => tr.join('|')).join('\n')
}

export {Tips, Loading, FormatMDTable};
