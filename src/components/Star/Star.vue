<!-- 五角星评价列表 -->
<template>
    <div class="star" :class="starSize">
        <span class="star-item"
            v-for="(starType, index) in starTypeArr"
            :key="index"
            :class="starType">
        </span>
    </div>
</template>

<script>
    const LENGTH = 5; // 星星个数
    const CLS_ON = 'on'; // 全星
    const CLS_HALF = 'half'; // 半星
    const CLS_OFF = 'off'; // 零星

    export default {
        props: {
            score: {
                type: Number
            },
            size: {
                type: Number
            }
        },
        computed: {
            starSize() {
                return `star-${this.size}`;
            },
            starTypeArr() {
                let starTypeArr = [];
                const { score } = this;
                const scoreInterger = Math.floor(score);
                for (let i = 0; i < scoreInterger; i++) {
                    starTypeArr.push(CLS_ON);
                }
                if ((score - scoreInterger) * 10 >= 5) {
                    starTypeArr.push(CLS_HALF);
                }
                while (starTypeArr.length < LENGTH) {
                    starTypeArr.push(CLS_OFF);
                }
                return starTypeArr;
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .star
        font-size: 0
        .star-item
            display: inline-block
            background-repeat: no-repeat
        &.star-24
            .star-item
                width: 10px
                height: 10px
                background-size: 10px 10px
                margin-right: 3px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('./img/star24_on')
                &.half
                    bg-image('./img/star24_half')
                &.off
                    bg-image('./img/star24_off')
        &.star-36
            .star-item
                width: 15px
                height: 15px
                background-size: 15px 15px
                margin-right: 6px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('./img/star36_on')
                &.half
                    bg-image('./img/star36_half')
                &.off
                    bg-image('./img/star36_off')
        &.star-48
            .star-item
                width: 20px
                height: 19px
                background-size: 20px 19px
                margin-right: 22px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('./img/star48_on')
                &.half
                    bg-image('./img/star48_half')
                &.off
                    bg-image('./img/star48_off')
</style>