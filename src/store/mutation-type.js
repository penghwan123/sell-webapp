/**
 * 包含n个mutation的type名称常量
 */
const RECEIVE_SELLER = 'receive_seller'; // 接收商家信息
const RECEIVE_GOODS = 'receive_goods'; // 接收商品信息
const RECEIVE_RATINGS = 'receive_ratings'; // 接收商品评价表
const INCREMENT_FOOD_COUNT = 'increment_food_count'; // 增加food中的count值
const DECREMENT_FOOD_COUNT = 'decrement_food_count'; // 减少food中的count值
const CLEARCART = 'clearcart'; // 清空购物车

export {
    RECEIVE_SELLER,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEARCART
};