<!-- food商品详情页 -->
<template>
    <transition name="move">
        <div class="food food-hook" v-show="showFlag">
            <!-- 要实现scroll滑动，所以里面套了一个<div class="food-content">元素 -->
            <div class="food-content">
                <div class="img-header">
                    <img :src="food.image">
                    <div class="back" @click.stop.prevent="hideShow">
                        <i class="iconfont icon-arrow_lift1"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="new">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cart-control :food="food" ref="cartcontrol"></cart-control>
                    </div>
                    <transition name="fade">
                        <div class="buy"
                            v-show="!food.count || food.count === 0"
                            @click.stop.prevent="addFirst">
                            加入购物车
                        </div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <rating-select :ratings="food.ratings"
                        :ratingType="ratingType"
                        :onlyContent="onlyContent"
                        :desc="desc"
                        @switchRatingType="switchRatingType"
                        @switchContentFlag="switchContentFlag">
                    </rating-select>
                    <div class="rating-list">
                        <ul v-if="food.ratings && food.ratings.length">
                            <li class="rating-item"
                                v-for="(rating, index) in food.ratings"
                                :key="index"
                                v-show="needShow(rating.ratingType, rating.text)">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" :src="rating.avatar" width="12px" height="12px">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</div>
                                <p class="rating-content">
                                    <!-- 第一种动态class绑定方案 -->
                                    <!--
                                    <i class="iconfont"
                                        :class="{'icon-icon_thumb_up_alt': rating.ratingType === 0,
                                                'icon-iconthumbdown': rating.ratingType === 1}">
                                    </i>
                                    -->
                                    <!-- 第二种动态class绑定方案 -->
                                    <i class="iconfont" :class="rating.ratingType === 0 ? 'icon-icon_thumb_up_alt':'icon-iconthumbdown'"></i>
                                    <span class="text">{{rating.text}}</span>
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-else>暂无评价内容</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex';
    import BScroll from 'better-scroll';
    import { formatDate } from '../../common/js/date';
    import CartControl from '../CartControl/CartControl';
    import Split from '../Split/Split';
    import RatingSelect from '../RatingSelect/RatingSelect';

    const ALL = 2;

    export default {
        props: {
            food: {
                type: Object
            }
        },
        data () {
            return {
                showFlag: false,
                ratingType: ALL, // 商品评价显示全部
                onlyContent: true, // 只看有内容的评价
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            };
        },
        computed: {
            ...mapState(['cartFoods'])
        },
        filters: {
            formatDate(time) {
                console.log('time-->', time);
                let date = new Date(time); // 将数字转为日期格式
                console.log('date-->', date);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        components: {
            CartControl,
            Split,
            RatingSelect
        },
        methods: {
            // 在Goods.vue中被调用
            show() {
                this.showFlag = true;
                this.ratingType = ALL; // 默认评价列表显示全部
                this.onlyContent = true; // 默认只看有内容的评价
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll('.food-hook', {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hideShow() {
                this.showFlag = false;
            },
            addFirst(event) {
                // this.cartFoods.push(this.food); // 将food添加到cartFoods列表中，因为在CartControl中当food.count=1时，不会执行cartFoods.push(food)
                // this.$set(this.food, 'count', 1);
                console.log('event-->', event);
                this.$refs.cartcontrol.updateFoodCount(true, event.target);
            },
            switchRatingType(type) {
                this.ratingType = type; // 切换评价类型：全部、推荐和吐槽
                this.$nextTick(() => { // 当修改评价类型时，页面高度会改变，利用scroll.refresh()重新计算高度
                    this.scroll.refresh();
                });
            },
            switchContentFlag(flag) {
                this.onlyContent = !flag; // 切换是否只看有评价内容
                this.$nextTick(() => { // 当修改是否看有评价内容时，页面高度会改变，利用scroll.refresh()重新计算高度
                    this.scroll.refresh();
                });
            },
            needShow(type, text) {
                if (this.onlyContent && !text) { // 勾选只看有内容的评价，且评价内容为空
                    return false;
                }
                if (this.ratingType === ALL) { // 如果评价类型选择全部，全都显示
                    return true;
                } else { // 如果选择推荐或者吐槽，根据评价内容的ratingType进行判断
                    return type === this.ratingType;
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .food
        position: fixed // 按照页面视口进行固定定位
        top: 0
        left: 0
        bottom: 48px // 防止遮盖下方的购物车
        width: 100%
        z-index: 30 // 值大于Goods.vue，但是小于ShopCart.vue的z-index值和list-mask的z-index值
        background: #fff
        &.move-enter, &.move-leave-to
            transform: translate3d(100%, 0, 0)
        &.move-enter-active, &.move-leave-active
            transition: all .3s linear
        .img-header
            position: relative
            width: 100%
            // 限定图片的高度和宽度
            height: 0 // 图片加载是异步的，且不能写死图片的高度，用于防止加载后屏幕有抖动过程
            padding-top: 100% // 参考包含块的width，用于撑开高度放图片，图片的高度等于屏幕宽度
            img
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
            .back
                position: absolute
                top: 10px
                left: 0
                .icon-arrow_lift1
                    display: inline-block
                    padding: 10px
                    font-size: 20px
                    color: #fff
        .content
            position: relative
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 8px
                font-size: 14px
                font-weight: 700
                color: rgb(7, 17, 27)
            .detail
                margin-bottom: 18px
                height: 10px
                line-height: 10px
                font-size: 0
                .sell-count, .rating
                    font-size: 10px
                    color: rgb(147, 153, 159)
                .sell-count
                    margin-right: 12px
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
                right: 12px
                bottom: 12px
            .buy
                position: absolute
                right: 18px
                bottom: 18px
                z-index: 10px
                width: 74px
                height: 24px
                line-height: 24px
                padding: 0 12px
                box-sizing: border-box
                border-radius: 12px
                background: rgb(0, 160, 220)
                font-size: 10px
                color: #fff
                &.fade-enter, &.fade-leave-to
                    opacity: 0
                &.fade-enter-active, &.fade-leave-active
                    transition: all .2s
        .info
            padding: 18px
            .title
                line-height: 14px
                margin-bottom: 6px
                font-size: 14px
                color: rgb(7, 17, 27)
            .text
                line-height: 24px
                padding: 0 8px
                font-size: 12px
                color: rgb(77, 85, 93)
        .rating
            padding-top: 18px
            .title
                line-height: 14px
                margin-left: 18px
                font-size: 14px
                color: rgb(7, 17, 27)
            .rating-list
                padding: 0 18px
                .rating-item
                    position: relative
                    padding: 16px 0
                    border-bottom: 1px solid rgba(7, 17, 27, .1)
                    .user
                        position: absolute
                        right: 0
                        top: 16px
                        line-height: 12px
                        font-size: 0
                        color: rgb(147, 153, 159)
                        .name
                            display: inline-block
                            vertical-align: top
                            margin-right: 6px
                            font-size: 10px
                    .time
                        line-height: 12px
                        margin-bottom: 6px
                        font-size: 10px
                    .rating-content
                        font-size: 0
                        .icon-icon_thumb_up_alt, .icon-iconthumbdown
                            line-height: 12px
                            margin-right: 6px
                            font-size: 12px
                            color: rgb(147, 153, 159)
                        .icon-icon_thumb_up_alt
                            color: rgb(0, 160, 200)
                        .icon-iconthumbdown
                            color: rgb(147, 153, 159)
                        .text
                            font-size: 12px
                            color: rgb(7, 17, 27)
                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147, 153, 159)
</style>