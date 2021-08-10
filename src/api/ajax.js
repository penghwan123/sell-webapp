/**
 * ajax请求函数模块
 * 返回值：promise对象（异步返回的数据是：resp.data）
 */
import axios from 'axios';

export default function ajax(url = '', data = {}, type = 'GET') {
    return new Promise(function(resolve, reject) {
        let promise;
        if (type === 'GET') {
            // 准备拼接url的query参数
            let dataStr = '';
            Object.keys(data).forEach(key => {
                dataStr += `${key}=${data[key]}&`;
            });
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
                url = `${url}?${dataStr}`;
            }
            // 发送get请求
            promise = axios.get(url);
        } else {
            promise = axios.post(url, data);
        }
        promise.then(resp => {
            resolve(resp.data);
        }).catch(err => {
            reject(err);
        });
    });
}