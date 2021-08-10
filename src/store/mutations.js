/**
 * 包含多个由action触发直接更新状态的方法的对象
 */
import Vue from 'vue';
import {
    RECEIVE_SELLER,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEARCART
} from './mutation-type';

export default {
    [RECEIVE_SELLER](state, { seller }) {
        state.seller = seller;
    },
    [RECEIVE_GOODS](state, { goods }) {
        state.goods = goods;
    },
    [RECEIVE_RATINGS](state, { ratings }) {
        state.ratings = ratings;
    },
    [INCREMENT_FOOD_COUNT](state, { food }) {
        if (!food.count) { // 第一次增加，food中没有count
            // food.count = 1; // 新增加的属性，不会触发数据绑定
            Vue.set(food, 'count', 1);
            state.cartFoods.push(food);
        } else {
            food.count++;
        }
    },
    [DECREMENT_FOOD_COUNT](state, { food }) {
        if (food.count) { // 只有有值才减1，目的：防止当值为1时，快速连续点击两次，值变为负数
            food.count--;
            if (food.count === 0) {
                state.cartFoods.splice(state.cartFoods.indexOf(food), 1);
            }
        }
    },
    [CLEARCART](state) {
        // 1、把购物车food中的count置为0
        state.cartFoods.forEach(food => food.count = 0);
        // 2、把购物车置为空数组
        state.cartFoods = [];
    }
};