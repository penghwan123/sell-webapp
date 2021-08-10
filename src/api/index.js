import ajax from './ajax';

// 获取商品列表
const reqGoods = () => ajax('/goods');
// 获取商家评论列表
const reqRatings = () => ajax('/ratings');
// 获取商家信息
// let queryParams = urlParse();
// let id = queryParams.id;
const reqSeller = () => ajax('/seller');

export {
    reqGoods,
    reqRatings,
    reqSeller
};