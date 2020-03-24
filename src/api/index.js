import http from './http';
import env from './env';
import { MessageBox } from "element-ui";

/**
 * url: 地址
 * method: 请求方法
 * params: 参数
 * timeout: 超时时间
 * isOriginalGET: 是否传统get传参
 */


// 退出登录回调
const logoutCallback = (info) => {
    MessageBox.alert(info, {
        showClose: false,
        confirmButtonText: "确定",
        customClass: "alertFailure"
    });
} 

// 更换 token 回调
const changeJwtCallback = (jwt) => {
    
}

// 接口无权限回调
const noAuthCallback = (info) => {
    MessageBox.alert(info, {
        showClose: false,
        confirmButtonText: "确定",
        customClass: "alertFailure",
    });
}

// 接口错误提示
const errorCallback = (info) => {
    MessageBox.alert(info, {
        showClose: false,
        confirmButtonText: "确定",
        customClass: "alertFailure",
    });
}

const req = ({ baseUrl, method, url, params, timeout, isOriginalGET}) => {
    let options={
        url: env[baseUrl] + url,
        method: method, 
        params: params, 
        timeout: timeout, 
        isOriginalGET: isOriginalGET, 
        logoutCallback: logoutCallback,
        changeJwtCallback: changeJwtCallback,
        noAuthCallback: noAuthCallback,
        errorCallback:errorCallback
    };

    return http(options);
}

export default req;
