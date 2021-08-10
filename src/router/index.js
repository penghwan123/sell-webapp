/**
 * 路由器对象模块
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Goods from 'pages/Goods/Goods.vue';
import Ratings from 'pages/Ratings/Ratings.vue';
import Seller from 'pages/Seller/Seller.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/goods',
            component: Goods
        }, {
            path: '/ratings',
            component: Ratings
        }, {
            path: '/seller',
            component: Seller
        }, {
            path: '/',
            redirect: '/goods'
        }
    ],
    linkActiveClass: 'active'
});