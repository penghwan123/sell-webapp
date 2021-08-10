<!-- 商品头部页 -->
<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
                <div class="support" v-if="seller.supports">
                    <span class="icon" :class="supportClassMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div class="support-count" v-if="seller.supports" @click="toggleBulletinShow">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="iconfont icon-Icon-KeyboardArrow-Right-Rounded"></i>
            </div>
        </div>
        <div class="bulletin-wrapper ellipsis" @click="toggleBulletinShow">
            <span class="bulletin-title"></span>
            <span class="bulletin-content">{{seller.bulletin}}</span>
            <i class="iconfont icon-Icon-KeyboardArrow-Right-Rounded"></i>
        </div>
        <!--背景图-->
        <div class="background">
            <img width="100%" height="100%" :src="seller.avatar">
        </div>
        <!--公告-->
        <transition name="fade">
            <bulletin v-show="bulletinShow" @closeBulletinShow="closeBulletinShow" class="bulletin"></bulletin>
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Bulletin from '../Bulletin/Bulletin.vue';

    export default {
        data() {
            return {
                bulletinShow: false
            };
        },
        computed: {
            supportClassMap() {
                return ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            },
            ...mapState(['seller'])
        },
        methods: {
            toggleBulletinShow () {
                this.bulletinShow = true;
            },
            closeBulletinShow () {
                this.bulletinShow = false;
            }
        },
        components: {
            Bulletin
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .header
        position: relative
        color: #fff
        background-color: rgba(7, 17, 27, .5)
        overflow: hidden // 清除超过background背景图边缘filter效果
        .content-wrapper
            position: relative
            padding: 24px 12px 18px 24px
            font-size: 0
            .avatar
                display: inline-block
                vertical-align: top
                img
                    border-radius: 2px
            .content
                display: inline-block
                margin-left: 16px
                .title
                    margin: 2px 0 8px 0
                    .brand
                        display: inline-block
                        vertical-align: top
                        width: 30px
                        height: 18px
                        bg-image('./img/brand')
                        background-size: 30px 18px
                        background-repeat: no-repeat
                    .name
                        margin-left: 6px
                        line-height: 18px
                        font-size: 16px
                        font-weight: bold
                .description
                    margin-bottom: 10px
                    line-height: 12px
                    font-size: 12px
                    font-weight: 100
                .support
                    .icon
                        display: inline-block
                        vertical-align: top
                        margin-right: 4px
                        width: 12px
                        height: 12px
                        background-size: 12px 12px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('./img/decrease_1')
                        &.discount
                            bg-image('./img/discount_1')
                        &.special
                            bg-image('./img/special_1')
                        &.invoice
                            bg-image('./img/invoice_1')
                        &.guarantee
                            bg-image('./img/guarantee_1')
                    .text
                        font-size: 10px
                        line-height: 12px
                        font-weight: 100
            .support-count
                position: absolute
                right: 12px
                bottom: 14px
                height: 24px
                padding: 0 8px
                line-height: 24px
                border-radius: 14px
                background: rgba(0, 0, 0, .2)
                text-align: center
                .count
                    vertical-align: top
                    margin-right: 2px
                    font-size: 10px
                .icon-Icon-KeyboardArrow-Right-Rounded
                    font-size: 10px
        .bulletin-wrapper
            position: relative
            height: 28px
            line-height: 28px
            padding: 0 18px 0 12px
            background-color: rgba(7, 17, 27, .2)
            .bulletin-title
                display: inline-block
                vertical-align: top
                margin-top: 8px
                width: 22px
                height: 12px
                bg-image('./img/bulletin')
                background-size: 22px 12px
                background-repeat: no-repeat
            .bulletin-content
                margin: 0 4px
                font-size: 10px
                width: 80%
            .icon-Icon-KeyboardArrow-Right-Rounded
                position: absolute
                top: 2px
                right: 12px
                font-size: 10px
        .background
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: -1
            filter: blur(10px) // filter属性定义了元素（通常是<img>）的可视效果，blur给图像设置高斯模糊
        .fade-enter, .fade-leave-to
            opacity: 0;
            background-color: rgba(7, 17, 27, 0)
        .fade-enter-active, .fade-leave-active
            transition: all .3s
        .bulletin
            z-index: 100
</style>