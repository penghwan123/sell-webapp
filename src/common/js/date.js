/**
 * 转换时间格式：将UTC时间格式(Mon May 07 2018 19:09:12 GMT+0800 (中国标准时间))转化为YYYY-MM-DD
 * @example Sat Jul 23 2016 21:52:44 GMT+0800 (中国标准时间)  ==>  2016-07-23 21:52:44
 * @param  {[Date]} date(Sat Jul 23 2016 21:52:44 GMT+0800 (中国标准时间))
 * @param  {[String]} fmt(yyyy-MM-dd hh:mm:ss)
 * @return String {2016-07-23 21:52:44}
 */
export function formatDate(date, fmt) { // fmt: 'yyyy-MM-dd hh:mm:ss'
    const paddingLeftZero = str => ('00' + str).substr(str.length);
    if (/(y+)/.test(fmt)) {
        let matchStr = RegExp.$1; // yyyy
        fmt = fmt.replace(matchStr, (date.getFullYear() + '').substr(4 - matchStr.length)); // date.getFullYear() + ''：取出年份，转换成字符串格式
    }
    let option = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let item in option) {
        if (new RegExp(`(${item})`).test(fmt)) {
            let value = option[item] + ''; // 转换成字符串
            let matchStr = RegExp.$1; // MM dd hh mm ss
            fmt = fmt.replace(matchStr, matchStr.length === 1 ? value : paddingLeftZero(value));
        }
    }
    return fmt;
};
// function paddingLeftZero(str) {
//     return ('00' + str).substr(str.length);
// };