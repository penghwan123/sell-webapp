/**
 * 解析url参数
 * @example ?id=12345&username=Tom
 * @return Object {id: 12345, username: Tom}
 */
export function urlParse() {
    let obj = {};
    let url = document.location.search;
    let reg = /[?&][^?&]+=[^?&]+/g;
    let urlArr = url.match(reg); // ['?id=12345', '&username=Tom']
    if (urlArr) {
        urlArr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = tempArr[0];
            let value = tempArr[1];
            obj[key] = value;
        });
    }
    return obj;
};