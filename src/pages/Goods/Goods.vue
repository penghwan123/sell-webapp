<template>
    <div class="goods">
        <!-- 左侧菜单列表 -->
        <div class="menu-wrapper">
            <ul>
                <li class="good"
                    v-for="(good, index) in goods"
                    :key="index"
                    :class="{'current': index === currentIndex}"
                    @click="clickMenuItem(index)">
                    <span class="text">
                        <span class="icon" :class="supportClassMap[good.type]" v-show="good.type>0"></span>{{good.name}}
                    </span>
                </li>
            </ul>
        </div>
        <!-- 右侧食物列表 -->
        <div class="foods-wrapper">
            <ul ref="foodsUl">
                <li class="foods-list" v-for="(good, index) in goods" :key="index">
                    <h1 class="title">{{good.name}}</h1>
                    <ul>
                        <li class="food"
                            v-for="(food, index) in good.foods"
                            :key="index"
                            @click="selectFood(food)">
                            <div class="icon">
                                <img :src="food.icon" width="57px" height="57px">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <div class="desc" v-show="food.description">{{food.description}}</div>
                                <div class="extra">
                                    <span class="sellCount">月售{{food.sellCount}}份</span>
                                    <span class="rating">好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="new">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <!-- 加减商品 -->
                                <div class="cartcontrol-wrapper">
                                    <!--在父组件监听到子组件触发的cart-add事件-->
                                    <cart-control :food="food" @cartAdd="cartAdd"></cart-control>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 购物车 -->
        <shop-cart ref="shopCart"></shop-cart>
        <!-- food商品详情页 -->
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import { mapState } from 'vuex';
    import ShopCart from '../../components/ShopCart/ShopCart.vue';
    import CartControl from '../../components/CartControl/CartControl.vue';
    import Food from '../../components/Food/Food.vue';

    export default {
        mounted() {
            this.$store.dispatch('getGoods', () => {
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                });
            });
        },
        data() {
            return {
                foodsListHeight: [],
                scrollY: 0,
                selectedFood: {}
            };
        },
        computed: {
            ...mapState(['goods']),
            supportClassMap() {
                return ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            },
            // 计算得到当前分类的下标
            currentIndex() { // 初始化和相关数据发生变化会执行
                // 1. 得到条件数据
                const { foodsListHeight, scrollY } = this;
                // 2. 根据条件计算产生一个结果
                const index = foodsListHeight.findIndex((value, index, arr) => {
                    return scrollY >= value && scrollY < arr[index+1];
                });
                // 3. 返回结果
                return index;
            }
        },
        components: {
            ShopCart,
            CartControl,
            Food
        },
        methods: {
            // 初始化滚动
            _initScroll() { // "_"用于区分不是页面的DOM事件绑定函数
                this.menuScroll = new BScroll('.menu-wrapper', {
                    click: true
                });
                this.foodsScroll = new BScroll('.foods-wrapper', {
                    click: true,
                    probeType: 2 // 惯性滑动不会触发
                });
                // 给右侧列表绑定scroll监听
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(pos.y);
                });
                // 给右侧列表绑定scroll结束监听：目的是解决由于惯性滑动不会触发scollY的变化
                this.foodsScroll.on('scrollEnd', (pos) => {
                    this.scrollY = Math.abs(pos.y);
                });
            },
            // 计算右侧li视图高度
            _calculateHeight() {
                // 1、初始化li视图高度
                let foodsListHeight = [];
                let liHeight = 0;
                // 2、收集
                foodsListHeight.push(liHeight);
                const lis = this.$refs.foodsUl.children;
                Array.prototype.slice.call(lis).forEach((li) => {
                    liHeight += li.clientHeight;
                    foodsListHeight.push(liHeight);
                });
                // 3、更新数据
                this.foodsListHeight = foodsListHeight;
            },
            _drop(target) {
                this.$nextTick(() => { // 体验优化，异步执行小球抛物线动画
                    this.$refs.shopCart.drop(target); // 父组件goods通过.$refs属性访问ShopCart子组件的drop方法
                });
            },
            // 点击左侧菜单，右侧平滑滚动到指定分类
            clickMenuItem(index) {
                /**
                * 方案一：scrollTo
                */
                // 1、根据左侧点击位置index，获得右侧垂直方向需要滚动的距离
                // const scrollY = this.foodsListHeight[index];
                // this.scrollY = scrollY;
                // // 2、平滑滚到右侧列表
                // this.foodsScroll.scrollTo(0, -scrollY, 300); // 由于是向下滚到，x为0，y为负值
                /**
                * 方案二：scrollToElement
                */
                // 1、根据左侧点击位置index，获得右侧相应元素
                const targetLi = this.$refs.foodsUl.children[index];
                // 2、右侧平滑滚到点击位置
                this.foodsScroll.scrollToElement(targetLi, 300);
            },
            selectFood(food) {
                this.selectedFood = food;
                this.$refs.food.show();
            },
            cartAdd(target) {
                console.log('target-->', target);
                this._drop(target);
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .goods
        display: flex
        position: absolute
        top: 174px // 上方凸显头部header
        left: 0
        bottom: 46px // 下方凸显购物车
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px // 兼容性代码，如果不写在安卓浏览器会有问题
            background: #f3f5f7
            .good
                display: table // 可以让多行元素垂直居中
                width: 56px
                height: 54px
                padding: 0 12px // 文本水平居中
                line-height: 14px
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1px
                    background: #fff
                    .text
                        border-none()
                        font-weight: 700
                        color: rgb(7, 17, 27)
                .text
                    display: table-cell
                    vertical-align: middle // 文字垂直居中
                    width: 56px
                    bottom-border-1px(rgba(7, 17, 27, .1))
                    font-size: 12px
                    font-weight: 200
                    color: rgb(77, 85, 93)
                    .icon
                        display: inline-block
                        vertical-align: top
                        width: 12px
                        height: 12px
                        margin-right: 2px
                        background-size: 12px 12px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('./img/decrease_3')
                        &.discount
                            bg-image('./img/discount_3')
                        &.special
                            bg-image('./img/special_3')
                        &.invoice
                            bg-image('./img/invoice_3')
                        &.guarantee
                            bg-image('./img/guarantee_3')
        .foods-wrapper
            flex: 1
            .foods-list
                .title
                    padding-left: 14px
                    border-left: 2px solid #d9dde1
                    line-height: 26px
                    font-size: 12px
                    color: rgb(147, 153, 159)
                    background: #f3f5f7
                .food
                    display: flex
                    margin: 18px
                    padding-bottom: 18px
                    bottom-border-1px(rgba(7, 17, 27, .1))
                    &:last-child
                        margin-bottom: 0
                        border-none()
                    .icon
                        flex: 0 0 57px
                        margin-right: 10px
                    .content
                        flex: 1
                        .name
                            margin: 2px 0 8px 0
                            margin-top: 2px
                            line-height: 14px
                            font-size: 14px
                            color: rgb(7, 17, 27)
                        .desc, .extra
                            line-height: 12px
                            font-size: 10px
                            color: rgb(147, 153, 159)
                        .desc
                            margin-bottom: 8px
                        .extra
                            font-size: 0
                            .sellCount
                                font-size: 10px
                                margin-right: 12px
                            .rating
                                font-size: 10px
                        .price
                            line-height: 24px
                            font-size: 0
                            font-weight: 700
                            .new
                                margin-right: 8px
                                font-size: 14px
                                color: rgb(240, 20, 20)
                            .old
                                text-decoration: line-through
                                font-size: 10px
                                color: rbg(147, 153, 159)
                        .cartcontrol-wrapper
                            position: absolute
                            right: 0
                            bottom: 0
</style>