/**
 * 包含多个接收组件通知触发mutations调用间接更新状态的方法的对象
 */
import {
    RECEIVE_SELLER,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEARCART
} from './mutation-type';
import { reqSeller, reqGoods, reqRatings } from '../api';

export default {
    // 异步获取商家信息
    async getSeller(context, callback) {
        const result = await reqSeller();
        if (result.code === 0) {
            const seller = result.data;
            context.commit(RECEIVE_SELLER, { seller });
            callback && callback();
        }
    },
    // 异步获取商品信息
    async getGoods(context, callback) {
        const result = await reqGoods();
        if (result.code === 0) {
            const goods = result.data;
            context.commit(RECEIVE_GOODS, { goods });
            // 获取到数据后，通知组件调用回调函数
            callback && callback();
        }
    },
    // 异步获取商品评价列表
    async getRatings(context, callback) {
        const result = await reqRatings();
        if (result.code === 0) {
            const ratings = result.data;
            context.commit(RECEIVE_RATINGS, { ratings });
            // 获取到数据后，通知组件调用回调函数
            callback && callback();
        }
    },
    // 同步更新food中的count值
    updateFoodCount(context, { isAdd, food }) {
        if (isAdd) {
            context.commit(INCREMENT_FOOD_COUNT, { food });
        } else {
            context.commit(DECREMENT_FOOD_COUNT, { food });
        }
    },
    // 清空购物车
    clearCart(context) {
        context.commit(CLEARCART);
    }
};