/**
 * 利用localStorage在浏览器缓存中保存或读取数据
 * @param {*} id
 * @param {*} key
 * @param {*} value
 * @example ?id=12345&username=Tom
 * @return Object {12345: {username: Tom}}
 */
export function saveToLocal(id, key, value) {
    let seller = window.localStorage.getItem('__seller__');
    // let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.setItem('__seller__', JSON.stringify(seller));
    // window.localStorage.__seller__ = JSON.stringify(seller);
};

export function getFromLocal(id, key, defaultVal) {
    let seller = JSON.parse(window.localStorage.getItem('__seller__'));
    if (!seller || !seller[id]) {
        return defaultVal;
    }
    // seller = JSON.parse(seller)[id];
    // if (!seller[id]) {
    //     return defaultVal;
    // }
    return seller[id][key] || defaultVal;
}