<!-- 购物车 -->
<template>
    <div>
        <div class="shopcart">
            <div class="content">
                <div class="content-left" @click="toggleShow">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'hightLight': totalCount > 0}">
                            <i class="iconfont icon-icon_shoppingcart_" :class="{'hightLight': totalCount > 0}"></i>
                            <span class="num" v-show="totalCount>0">{{totalCount}}</span>
                        </div>
                    </div>
                    <div class="price" :class="{'hightLight': totalPrice > 0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费￥4元</div>
                </div>
                <div class="content-right">
                    <div class="pay" :class="payClass" v-show="seller.minPrice">{{payDesc}}</div>
                </div>
            </div>
            <!--购物车小球-->
            <div class="ball-wrapper">
                <transition v-for="(ball, index) of balls"
                    :key="index"
                    @before-enter="handleBeforeEnter"
                    @enter="handleEnter"
                    @after-enter="handleAfterEnter">
                    <div class="ball" v-show="ball.show" v-bind:css="false"><!--外层盒子-->
                        <div class="inner inner-hook"></div><!--内层盒子-->
                    </div>
                </transition>
            </div>
            <!--购物车列表-->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="clearCart">清空</span>
                    </div>
                    <div class="list-content">
                        <ul>
                            <li class="food" v-for="(food, index) in cartFoods" :key="index">
                                <span class="name">{{food.name}}</span>
                                <span class="price">￥{{food.count * food.price}}</span>
                                <div class="cartcontrol-wrapper">
                                    <cart-control :food="food"></cart-control>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
        </transition>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import Velocity from 'velocity-animate';
    import { MessageBox } from 'mint-ui';
    import { mapState } from 'vuex';
    import CartControl from '../../components/CartControl/CartControl.vue';

    export default {
        data () {
            return {
                balls: [
                    {
                        show: false
                    }, {
                        show: false
                    }, {
                        show: false
                    }, {
                        show: false
                    }, {
                        show: false
                    }
                ],
                dropBalls: [], // 存放掉落的小球
                isShow: false // 购物车列表是否折叠
            };
        },
        computed: {
            ...mapState(['seller', 'cartFoods']),
            totalCount() {
                return this.cartFoods.reduce((preTotalCount, food) => preTotalCount + food.count, 0);
            },
            totalPrice() {
                return this.cartFoods.reduce((preTotalPrice, food) => preTotalPrice + food.count * food.price, 0);
            },
            payDesc() {
                const { totalPrice } = this;
                const { minPrice } = this.seller;
                if (totalPrice === 0) {
                    return `￥${minPrice}起送`;
                } else if (totalPrice < minPrice) {
                    return `还差￥${minPrice - totalPrice}起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                const { totalPrice } = this;
                const { minPrice } = this.seller;
                return totalPrice < minPrice ? 'not-enough' : 'enough';
            },
            listShow: {
                get() {
                    // 如果总数量为0，直接不显示
                    if (!this.totalCount) {
                        return false;
                    }
                    return this.isShow;
                },
                set() {
                    if (!this.totalCount) {
                        this.isShow = false;
                    }
                    console.log('isShow2-->', this.isShow);
                    if (this.isShow) {
                        this.$nextTick(() => {
                            // 创建 better-scroll 实例或者 refresh
                            console.log('scroll-->', this.scroll);
                             if (!this.scroll) {
                                this.scroll = new BScroll('.list-content', {
                                    click: true
                                });
                            } else {
                                this.scroll.refresh();
                            }
                        });
                    }
                    return this.isShow;
                }
            }
            // listShow() {
            //     const { totalCount } = this;
            //     // 如果总数量为0，直接不显示
            //     if (!totalCount) {
            //         // this.isShow = false;
            //         return false;
            //     }
            //     return this.isShow;
            // }
        },
        // watch: {
        //     // 解决computed中listShow的this.isShow=false报错问题
        //     cartFoods(newFoods, oldFoods) {
        //         if (newFoods.length === 0) {
        //             this.isShow = false;
        //         }
        //     },
        //     listShow() {
        //         if (this.isShow) {
        //             this.$nextTick(() => {
        //                 // 实现BScroll的实例是一个单例，防止重复生成BScroll实例
        //                 if (!this.scroll) {
        //                     this.scroll = new BScroll('.list-content', {
        //                         click: true
        //                     });
        //                 } else {
        //                     this.scroll.refresh(); // 让滚动条刷新一下：重新统计内容的高度
        //                 }
        //             });
        //         }
        //     }
        // },
        methods: {
            // 当触发drop方法时小球开始掉落
            drop(el) {
                const { balls, dropBalls } = this;
                for (let i = 0; i < balls.length; i++) {
                    let ball = balls[i];
                    if (!ball.show) { // 当小球显示状态为隐藏时
                        ball.show = true; // 将这个小球的显示状态设置为true
                        ball.el = el;
                        dropBalls.push(ball);
                        return;
                    }
                }
            },
            handleBeforeEnter(el) {
                const { dropBalls } = this;
                console.log('dropBalls-->', dropBalls);
                let count = dropBalls.length - 1; // 获取要下降中的小球数
                let ball = dropBalls[count]; // 获取最新点击生成show:true的小球
                console.log('ball-->', ball);
                let rect = ball.el.getBoundingClientRect(); // getBoundingClientRect()获取小球相对于视窗的位置，屏幕左上角坐标为0，0
                let x = rect.left - 32; // 小球x方向位移= 小球距离屏幕左侧的距离-外层盒子距离水平的距离
                let y = -(window.innerHeight - rect.top - 22); // 窗口的高度-点击元素离窗口的高度-购物车底部的bottom高度，就是小球要运动的y轴距离，且是向下运动，所以是负值
                el.style.display = '';
                // 外层做纵轴运动
                el.style.webkitTransform = `translate3d(0, ${y}px, 0)`; // 设置外层盒子，即小球垂直方向的位移
                el.style.transform = `translate3d(0, ${y}px, 0)`;
                el.style.transition = 'all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)';
                // 内层做横轴运动
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`; // 设置内层盒子，即小球水平方向的距离
                inner.style.transform = `translate3d(${x}px, 0, 0)`;
                inner.style.transition = 'all .4s linear';
            },
            handleEnter(el, done) {
                /* eslint-disable no-unused-vars */
                this._reflow = el.offsetHeight; // 手动获取这个值，触发浏览器重绘
                this.$nextTick(() => { // 让动画效果异步执行，提高性能
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    Velocity(el, {
                        translate3d: 'translate3d(0, 0, 0)'
                    }, {
                        duration: 600
                    });
                    Velocity(inner, {
                        translate3d: 'translate3d(0, 0, 0)'
                    }, {
                        duration: 600
                    });
                    el.addEventListener('transitionend', done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。它可以是transitionend或 animationend
                    // 如果希望在进入动画结束后再进行一些动画操作，就开启done，因为开启它才能启用下面的afterEnter方法
                });
            },
            handleAfterEnter(el) {
                const { dropBalls } = this;
                const ball = dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleShow() {
                // 只有当总数量大于0时切换
                if (this.totalCount) {
                    this.listShow = true;
                    this.isShow = !this.isShow;
                    console.log('isShow1-->', this.isShow);
                }
            },
            // 清空购物车
            clearCart() {
                MessageBox.confirm('确定清空购物车吗？').then(() => {
                    this.$store.dispatch('clearCart');
                    this.listShow = false;
                }, () => {});
            }
        },
        components: {
            CartControl
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .shopcart
        position: fixed // 固定到视口底部
        left: 0
        bottom: 0
        z-index: 50 // 购物车凸起部分盖住上面内容
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, .4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    vertical-align: top
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.hightLight
                            background: rgb(0, 160, 220)
                        .icon-icon_shoppingcart_
                            line-height: 44px
                            font-size: 24px
                            color: #80858a
                            &.hightLight
                                color: #fff
                        .num
                            position: absolute
                            top: 0
                            right: 0
                            width: 24px
                            height: 16px
                            line-height: 16px
                            text-align: center
                            border-radius: 12px
                            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
                            background: rgb(240, 20, 20)
                            font-size: 18px
                            font-weight: 700
                            color: #fff
                .price
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0
                    line-height: 24px // 使用上下margin为12px，line-height为24px，使字体垂直居中。而不是用line-height为48px，是因为当line-height为48px时，右边的1px线，高度也会变成48px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, .1)
                    font-size: 16px
                    font-weight: 700
                    &.hightLight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-wrapper
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                transform: translate3d(0, 0, 0)
                transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    background: rgb(0, 160, 220)
                    transform: translate3d(0, 0, 0)
                    transition: all .4s linear
        .shopcart-list
            position: absolute
            top: 0
            left: 0
            width: 100%
            z-index: -1
            transform: translate3d(0, -100%, 0) // translate(x%, y%)百分比参照于自身的宽度和高度
            &.fold-enter, &.fold-leave-to
                transform: translate3d(0, 0, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all .4s
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, .1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            .list-content
                max-height: 217px
                overflow: hidden // 超过217px要进行隐藏
                padding: 0 18px
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    bottom-border-1px(rgba(7, 17, 27, .1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        bottom: 12px
                        right: 90px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        bottom: 6px
                        right: 0
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        opacity: 1
        background: rgba(7, 17, 27, .6)
        backdrop-filter: blur(10px) // 背景图像模糊图，仅在iOS手机下有效
        &.fade-enter, &.fade-leave-to
            opacity: 0
            background: rgba(7, 17, 27, 0)
        &.fade-enter-active, &.fade-leave-active
            transition: all .4s
</style>