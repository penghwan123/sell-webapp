<template>
    <div class="seller">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc">
                    <star class="star" :size="36" :score="seller.score"></star>
                    <span class="rating-count">({{seller.ratingCount}})</span>
                    <span class="seller-count">月售{{seller.sellCount}}单</span>
                </div>
                <div class="favorite" @click="toggleFavorite">
                    <span class="iconfont icon-iconfavorite" :class="{'active': favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
                <ul class="info">
                    <li class="block">
                        <h2 class="title">起送价</h2>
                        <div class="content">{{seller.minPrice}}元</div>
                    </li>
                    <li class="block">
                        <h2 class="title">商家配送</h2>
                        <div class="content">{{seller.deliveryPrice}}元</div>
                    </li>
                    <li class="block">
                        <h2 class="title">平均配送时间</h2>
                        <div class="content">{{seller.deliveryTime}}分钟</div>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="bulletin-supports">
                <div class="bulletin">
                    <h1 class="title">公告与活动</h1>
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul class="supports" v-show="seller.supports">
                    <li class="support-item"
                        v-for="(support, index) in seller.supports"
                        :key="index">
                        <span class="icon" :class="supportClassMap[support.type]"></span>
                        <span class="text">{{support.description}}</span>
                    </li>
                </ul>
            </div>
            <div class="seller-pic" v-show="seller.pics">
                <h1 class="title">商家实景</h1>
                <div class="pics-wrapper"> <!-- 给ul外面套一个div，目的实现水平方向滑动，设置width:100%，overflow:hidden -->
                    <ul class="pics" ref="picsUl">
                        <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
                            <img class="pic" :src="pic" width="120px" height="90px">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="seller-info">
                <h1 class="title">商家信息</h1>
                <ul class="infos">
                    <li class="info-item" v-for="(info, index) in seller.infos" :key="index">
                        <span class="info">{{info}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import { mapState } from 'vuex';
    import { saveToLocal, getFromLocal } from '../../common/js/storage.js';
    import Star from '../../components/Star/Star';
    import Split from '../../components/Split/Split';

    export default {
        mounted() {
            /*
             * 不需要通过再次发送ajax请求，然后通过回调函数做下操作
            this.$store.dispatch('getSeller', () => {
                this.$nextTick(() => {
                    // 从localStorage中取出favorite的值
                    this.favorite = getFromLocal(this.seller.id, 'favorite', false);
                    this.$nextTick(() => {
                        this._initSellerScroll();
                        this._initPicsScroll();
                    });
                });
            });
            */
            /**
             * 1、从其它页面进入到Seller页面，this.seller是有值的，可以进行初始化操作
             * 2、在Seller当前页面做刷新操作，通过watch观测seller值，当值变化时，做初始化操作
             */
            // 从localStorage中取出favorite的值
            this.favorite = getFromLocal(this.seller.id, 'favorite', false);
            this._initSellerScroll();
            this._initPicsScroll();
        },
        data() {
            return {
                favorite: false
            };
        },
        computed: {
            ...mapState(['seller']),
            supportClassMap() {
                return ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            },
            favoriteText() {
                return this.favorite ? '已收藏' : '收藏';
            }
        },
        watch: {
            seller(newValue, oldValue) { // 观测seller，当值变化时做如下操作
                this.$nextTick(() => {
                    this.favorite = getFromLocal(this.seller.id, 'favorite', false);
                    this._initSellerScroll();
                    this._initPicsScroll();
                });
            }
        },
        components: {
            Star,
            Split
        },
        methods: {
            /**
             * 给seller页面添加垂直方向滚动
             */
            _initSellerScroll() {
                 if (!this.sellerScroll) {
                    this.sellerScroll = new BScroll('.seller', {
                        click: true
                    });
                } else {
                    this.sellerScroll.refresh();
                }
            },
            /**
             * 给商家实景添加水平方向滚动
             */
            _initPicsScroll() {
                /**
                 * 实现商家实景水平方向滚动的关键原理：<ul class="pics">元素的width大于<div class="pics-wrapper">元素的width
                 * 1、设置class=pics-wrapper元素的width为100%；
                 * 2、获取class=pics元素的实际宽度并进行设置。
                 */
                if (this.seller.pics) { // 当this.seller有值时
                    // 动态计算ul的宽度
                    let picsUl = this.$refs.picsUl;
                    let picWidth = 120;
                    let margin = 6;
                    let width = (picWidth + margin) * this.seller.pics.length;
                    picsUl.style.width = `${width}px`;
                    if (!this.picsScroll) {
                        this.picsScroll = new BScroll('.pics-wrapper', {
                            scrollX: true, // 水平方向滚动
                            eventPassthrough: 'vertical' // 使用BetterScroll在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动)
                        });
                    } else {
                        this.picsScroll.refresh();
                    }
                }
            },
            toggleFavorite() {
                this.favorite = !this.favorite;
                saveToLocal(this.seller.id, 'favorite', this.favorite);
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../common/stylus/index.styl';
    .seller
        position: absolute
        top: 174px // 上方凸显头部header
        left: 0
        bottom: 0
        overflow: hidden
        width: 100%
        .overview
            position: relative
            padding: 18px 0
            margin: 0 18px
            .title
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .desc
                margin-top: 8px
                padding-bottom: 18px
                font-size: 0
                bottom-border-1px(rgba(7, 17, 27, .1))
                .star
                    display: inline-block
                    vertical-align: top
                    margin-right: 8px
                .rating-count, .seller-count
                    display: inline-block
                    vertical-align: top
                    line-height: 18px
                    font-size: 10px
                    color: rgb(77, 85, 93)
                .rating-count
                    margin-right: 12px
            .favorite
                position: absolute
                top: 18px
                right: 11px // 计算方式——width:50px，已收藏的width:36px，'已收藏'距离左右边框距离:(50-36)/2=7，18-7=11
                width: 50px
                text-align: center
                .iconfont
                    display: block
                    margin-bottom: 4px
                    line-height: 24px
                    font-size: 24px
                    color: #d4d6d9
                    &.active
                        color: rgb(240, 20, 20)
                .text
                    line-height: 10px
                    font-size: 10px
                    color: rgb(77, 85, 93)
            .info
                display: flex
                text-align: center
                margin-top: 18px
                .block
                    flex: 1
                    border-right: 1px solid rgba(7, 17, 27, .1)
                    &:last-child
                        border: none
                    .title
                        margin-bottom: 4px
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .content
                        line-height: 24px
                        font-size: 24px
                        font-weight: 200
                        color: rgb(7, 17, 27)
        .bulletin-supports
            margin: 18px
            .bulletin
                padding-bottom: 16px
                bottom-border-1px(rgba(7, 17, 27, .1))
                .title
                    line-height: 14px
                    margin-bottom: 8px
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .content
                    padding: 0 12px
                    line-height: 24px
                    font-size: 12px
                    font-weight: 200
                    color: rgb(240, 20, 20)
            .supports
                .support-item
                    padding: 16px 12px
                    bottom-border-1px(rgba(7, 17, 27, .1))
                    font-size: 0
                    &:last-child
                        margin-bottom: 0
                        border-none()
                    .icon
                        display: inline-block
                        vertical-align: top
                        margin-right: 6px
                        width: 16px
                        height: 16px
                        background-size: 16px 16px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('./img/decrease_4')
                        &.discount
                            bg-image('./img/discount_4')
                        &.special
                            bg-image('./img/special_4')
                        &.invoice
                            bg-image('./img/invoice_4')
                        &.guarantee
                            bg-image('./img/guarantee_4')
                    .text
                        line-height: 16px
                        font-size: 12px
                        font-weight: 200
                        color: rgb(7, 17, 27)
        .seller-pic
            padding: 18px
            .title
                margin-bottom: 12px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .pics-wrapper
                width: 100%
                overflow: hidden
                .pics
                    display: flex
                    flex-direction: row
                    .pic-item
                        justify-content: center
                        align-items: center
                        margin-right: 6px
        .seller-info
            padding: 18px
            .title
                margin-bottom: 12px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .infos
                .info-item
                    padding: 16px 12px
                    top-border-1px(rgba(7, 17, 27, .1))
                    .info
                        line-height: 16px
                        font-size: 12px
                        font-weight: 200
                        color: rgb(7, 17, 27)
</style>