<template>
    <div>
        <v-header></v-header>
        <div class="tab">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    import Header from 'components/Header/Header.vue';

    export default {
        mounted() {
            this.$store.dispatch('getSeller');
        },
        components: {
            'v-header': Header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "common/stylus/index.styl";
    .tab
        display: flex
        z-index: 30
        padding-bottom: 3px // 让border-bottom: 2px solid rgb(240, 20, 20)位于1px边框上面
        width: 100%
        height: 40px
        line-height: 40px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
            flex: 1
            text-align: center
            & > a
                display: block
                box-sizing: border-box
                font-size: 14px
                color: rgb(77, 85, 93)
                &.active
                    color: rgb(240, 20, 20)
                    border-bottom: 2px solid rgb(240, 20, 20)
</style>