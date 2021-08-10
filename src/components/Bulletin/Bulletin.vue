<!-- 公告页 -->
<template>
    <div class="bulletin">
        <!-- 利用stickyFooter粘连布局 -->
        <div class="bulletin-wrapper clearFix">
            <div class="bulletin-main">
                <h1 class="name">{{seller.name}}</h1>
                <v-star class="star" :size="48" :score="seller.score"></v-star>
                <div class="title">
                    <div class="line"></div>
                    <div class="text">优惠信息</div>
                    <div class="line"></div>
                </div>
                <ul class="supports" v-if="seller.supports">
                    <li class="support" v-for="(support, index) in seller.supports" :key="index">
                        <span class="icon" :class="supportClassMap[support.type]"></span>
                        <span class="text">{{support.description}}</span>
                    </li>
                </ul>
                <div class="title">
                    <div class="line"></div>
                    <div class="text">商家公告</div>
                    <div class="line"></div>
                </div>
                <p class="content">{{seller.bulletin}}</p>
            </div>
        </div>
        <div class="bulletin-close" @click="closeBulletinShow">
            <i class="iconfont icon-icon_closed"></i>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Star from '../Star/Star.vue';

    export default {
        computed: {
            ...mapState(['seller']),
            supportClassMap () {
                return ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            }
        },
        components: {
            'v-star': Star
        },
        methods: {
            closeBulletinShow () {
                this.$emit('closeBulletinShow');
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .bulletin
        position: fixed // 相对视窗定位
        top: 0
        left: 0
        width: 100%
        height: 100%
        overflow: auto // 当内容超过视口高度，添加系统滚动条
        background-color: rgba(7, 17, 27, .8)
        backdrop-filter: blur(10px) // 背景图像模糊图，仅在iOS手机下有效
        .bulletin-wrapper
            box-sizing: border-box
            width: 100%
            min-height: 100%
            .bulletin-main
                padding-bottom: 64px
                .name
                    line-height: 16px
                    padding-top: 64px
                    text-align: center
                    font-size: 16px
                    font-weight: 350px
                .star
                    margin-top: 16px
                    text-align: center
                .title
                    display: flex
                    width: 80%
                    margin: 28px auto 24px auto
                    .line
                        flex: 1
                        position: relative
                        top: -6px
                        border-bottom: 1px solid rgba(255, 255, 255, .2)
                    .text
                        padding: 0 12px
                        font-size: 14px
                        font-weight: 700
                        line-height: 14px
                .supports
                    width: 80%
                    margin: 0 auto
                    .support
                        padding: 0 12px
                        margin-bottom: 12px
                        font-size: 0
                        &:last-child
                            margin-bottom: 0
                        .icon
                            display: inline-block
                            vertical-align: top
                            width: 16px
                            height: 16px
                            margin-right: 6px
                            background-size: 16px 16px
                            background-repeat: no-repeat
                            &.decrease
                                bg-image('./img/decrease_2')
                            &.discount
                                bg-image('./img/discount_2')
                            &.special
                                bg-image('./img/special_2')
                            &.invoice
                                bg-image('./img/invoice_2')
                            &.guarantee
                                bg-image('./img/guarantee_2')
                        .text
                            line-height: 16px
                            font-size: 12px
                            font-weight: 200
                .content
                    width: 80%
                    margin: 0 auto
                    padding-left: 12px
                    line-height: 24px
                    font-size: 12px
                    font-weight: 200
        .bulletin-close
            position: relative
            width: 32px
            height: 32px
            margin: -64px auto 0 auto
            clear: both
            font-size: 32px
            color: rgba(255, 255, 255, .5)
</style>