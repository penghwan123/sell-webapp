<!-- 评价类型选择页 -->
<template>
    <div class="rating-select">
        <div class="rating-type">
            <span class="block positive"
                :class="{'active': ratingType === 2}"
                @click.stop.prevent="switchRatingType(2)">
                {{desc.all}}<span class="count">{{ratings.length}}</span>
            </span>
            <span class="block positive"
                :class="{'active': ratingType === 0}"
                @click.stop.prevent="switchRatingType(0)">
                {{desc.positive}}<span class="count">{{positives.length}}</span>
            </span>
            <span class="block negative"
                :class="{'active': ratingType === 1}"
                @click.stop.prevent="switchRatingType(1)">
                {{desc.negative}}<span class="count">{{negatives.length}}</span>
            </span>
        </div>
        <div class="switch" @click.stop.prevent="switchContentFlag">
            <i class="iconfont icon-check-circle" :class="{'on': onlyContent}"></i>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const POSITIVE = 0; // 满意或推荐
    const NEGATIVE = 1; // 不满意或吐槽
    const ALL = 2; // 全部

    export default {
        props: {
            ratings: {
                type: Array,
                default() {
                    return [];
                }
            },
            ratingType: {
                type: Number,
                default: ALL
            },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            },
            onlyContent: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            positives() {
                return this.ratings.filter((rating) => {
                    return rating.ratingType === POSITIVE; // 推荐评价数组
                });
            },
            negatives() {
                return this.ratings.filter((rating) => {
                    return rating.ratingType === NEGATIVE; // 吐槽评价数组
                });
            }
        },
        methods: {
            // 切换评价类型
            switchRatingType(type) {
                // this.ratingType = type;
                /**
                * 1、不能在子组件中修改父组件通过props传递给子组件的值，否则会报下面错误：
                *   Avoid mutating a prop directly since the value will be overwritten
                *   whenever the parent component re-renders. Instead, use a data or computed
                *   property based on the prop's value. Prop being mutated: "ratingType"
                *
                * 2、组件间通信基本原则：
                *  （1）不要在子组件中直接修改父组件的状态数据；
                *  （2）数据在哪，更新数据的行为（函数）就应该定义在哪。
                * 3、解决方法：通过$emit方法，在父组件中进行修改
                */
                this.$emit('switchRatingType', type);
            },
            // 切换是否只看有评价内容
            switchContentFlag() {
                // this.onlyContent = !this.onlyContent;
                this.$emit('switchContentFlag', this.onlyContent);
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .rating-select
        .rating-type
            padding: 18px 0
            margin: 0 18px
            bottom-border-1px(rgba(7, 17, 27, .1))
            font-size: 0
            .block
                display: inline-block
                line-height: 16px
                margin-right: 8px
                padding: 8px 12px
                border-radius: 1px
                font-size: 12px
                color: rgb(77, 85, 93)
                &.active
                    color: #fff
                &.positive
                    background: rgba(0, 160, 220, .2)
                    &.active
                        background: rgb(0, 160, 220)
                &.negative
                    background: rgba(77, 85, 93, .2)
                    &.active
                        background: rgb(77, 85, 93)
                .count
                    margin-left: 4px
                    font-size: 8px
        .switch
            line-height: 24px
            padding: 12px 18px
            border-bottom: 1px solid rgba(7, 17, 27, .1)
            font-size: 0
            color: rgb(147, 153, 159)
            .icon-check-circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
                &.on
                    color: #00c850
            .text
                display: inline-block
                font-size: 12px
</style>