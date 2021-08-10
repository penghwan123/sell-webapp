<!-- 商品加减组件 -->
<template>
    <div class="cartcontrol">
        <transition name="move">
            <span class="iconfont icon-icon_remove cart-decrease"
                v-show="food.count"
                @click.stop.prevent="updateFoodCount(false, $event)">
            </span>
        </transition>
        <span class="cart-count" v-show="food.count">{{food.count}}</span>
        <span class="iconfont icon-icon-Add cart-add" @click.stop.prevent="updateFoodCount(true, $event)"></span>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: {
            food: {
                type: Object
            }
        },
        computed: {
            ...mapState(['cartFoods'])
        },
        methods: {
            // 第一种实现方案 icon-icon_add1
            // this.$store.dispatch('updateFoodCount', {isAdd, food: this.food, event});
            // 第二种实现方案
            updateFoodCount(isAdd, event) {
                const { food, cartFoods } = this;
                if (isAdd) {
                    if (!food.count) { // 第一次增加，food中没有count
                        // food.count = 1; // 新增加的属性，不会触发数据绑定
                        this.$set(food, 'count', 1);
                        cartFoods.push(food);
                    } else {
                        food.count++;
                    }
                    this.$emit('cartAdd', event.target);
                } else {
                    if (food.count) { // 只有有值才减1，目的：防止当值为1时，快速连续点击两次，值变为负数
                        food.count--;
                        if (food.count === 0) {
                            cartFoods.splice((cartFoods.indexOf(food)), 1);
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .cartcontrol
        font-size: 0
        .cart-add, .cart-decrease
            display: inline-block
            padding: 6px
            line-height: 24px
            font-size: 24px
            color: rgb(0, 160, 220)
        .cart-add
            &.move-enter, &.move-leave-to
                opacity: 0
                transform: translateX(12px) rotate(180deg)
            &.move-enter-active, &.move-leave-active
                transition: all .3s
        .cart-count
            display: inline-block
            vertical-align: top
            width: 12px
            padding-top: 6px
            line-height: 24px
            text-align: center
            font-size: 10px
            color: rgb(147, 153, 159)
</style>