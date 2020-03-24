import axios from 'axios';

/**
 * url: 地址
 * method: 请求方法
 * params: 参数
 * timeout: 超时时间
 * isOriginalGET: 是否传统get传参
 * jwt: 鉴权 token
 * userId: 用户id 
 * logoutCallback: 登出回调
 * changeJwtCallback：换jwt回调
 * noAuthCallback: 无权限访问登录
 * responseType:响应的数据类型 ---21091211/v0.0.2
 * extraConfig: 其他 axios 配置项 ---10291211/v0.0.3
 * errorHandler: 异常处理操作，用于上报到 Sentry ---20191224/v0.0.5
 * isSecret:是否参数转base64    //参数base64  ---v0.0.6
 */


const http = ({
    url,
    method,
    params,
    timeout,
    isOriginalGET,
    lang,
    jwt,
    userId,
    logoutCallback,
    changeJwtCallback,
    noAuthCallback,
    errorCallback,
    responseType,
    extraConfig,
    isSecret
}) => {
    // 用户退出登录
    const userLogout = () => {
        let info = "登录已过期，请重新登录";
        logoutCallback(info);
    };
    
    // 无权限访问
    const noAuthority = () => {
        let info = "无权限访问";
        noAuthCallback(info);
    };

    // axios 默认设置
    axios.defaults.retry = 3;
    axios.defaults.retryDelay = 1000;
    // axios 拦截器
    axios.interceptors.response.use(
        response => {
            //登录失效时重定向为登录页面
            if (response.data.code == -11){
                userLogout();
                return response;
            // 需要更换JWT
            } else if( [21,-21,22].includes(response.data.code) ) {
                let { config } = response;
                // 更换JWT
                const changeJwt = () => {
                    if (response.data.data) {
                        changeJwtCallback(response.data.data)
                        config.headers.authorization = response.data.data;
                    }
                }
                if( [21,22].includes(response.data.code) ) {
                    changeJwt();
                }
                
                // 判断是否配置了重试
                if(!config || !config.retry) {
                    return response;
                }
                // 设置重置次数，默认为0
                config.__retryCount = config.__retryCount || 0;
                // 判断是否超过了重试次数
                if (config.__retryCount >= config.retry) {
                    userLogout()
                    return response
                }
                config.__retryCount += 1;

                // 延时
                var backoff = new Promise((resolve) => {
                    setTimeout(()=>{
                        resolve();
                    }, config.retryDelay || 1);
                });
                
                // 重新发起axios请求
                return backoff.then(()=>{
                    return axios(config);
                })
            } else if (response.data.code == -31) {
                noAuthority();
                return response;
            } else {
                return response;
            }
        },
        error => {
            // 异常处理操作，用于上报到 Sentry ---20191224/v0.0.5
            // 断网 或者 请求超时 状态
            if (!error.response) {
                // 请求超时状态
                if (error.message.includes('timeout')) {
                    errorCallback('请求超时，请检查网络是否连接正常');
                } else {
                // 可以展示断网组件
                    errorCallback('请求失败，请检查网络是否已连接');
                }
                return
            }
            return Promise.reject(error);
        }
    );

    !params && (params = {});
    let config = {
        method: method,
        url: url,
        timeout: 20000,
        headers: {
            // 'authorization': jwt,
            // 'uid': userId,
            // 'systemId': systemId,

            // 配置请求头device字段 ---10291212/v0.0.4
            // 'device': device || 'PC',

            'Content-Type': 'application/json'   //base64 --v0.0.6
        }
    };

    // 用来覆盖默认的超时时间
    if (timeout) {
        config.timeout = timeout;
    }

    // 判断是否有鉴权
    if (userId && jwt) {
        config.headers.uid = userId;
        config.headers.authorization = jwt;
    }

    // 后端判断错误信息返回语言
    if (lang) {
        config.headers.lang = lang;
        config.headers.locale = lang;
    }

    method = method.toUpperCase();
    if (method == 'GET') {
        if (isOriginalGET) {
            config.params = params;
        } else {
            // 有参数才在地址后面拼字符串
            if(Object.keys(params).length > 0){
                config.url += `/${encodeURIComponent(JSON.stringify(params))}`;
            }
        }
    } else {
        config.data = params;
    }

    // 在请求地址后面加时间戳
    if (config.params) {
        config.params.ts = `${(new Date()).getTime()}`;
    } else {
        config.params = {
            ts: `${(new Date()).getTime()}`
        };
    }

    // ---20191211/v0.0.2
    if(responseType){
        config.responseType = responseType
    }

    //base64   ---v0.0.6
    if(isSecret && config.data){
        // config.data 转 base64
        config.headers.isSecret = 1
        config.data = btoa(JSON.stringify(config.data));
    }

    // 其他 axios 配置项 ---10291211/v0.0.3
    if(extraConfig) {
        config = Object.assign(config, extraConfig)
    }

    return axios(config);

}

export default http;
