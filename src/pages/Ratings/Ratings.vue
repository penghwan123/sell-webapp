<template>
    <div class="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="text">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star class="star" :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商家评分</span>
                        <star class="star" :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-time">
                        <span class="title">送达时间</span>
                        <span class="time">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <div class="rating">
                <rating-select :ratings="ratings"
                    :ratingType="ratingType"
                    :desc="desc"
                    :onlyContent="onlyContent"
                    @switchRatingType="switchRatingType"
                    @switchContentFlag="switchContentFlag">
                </rating-select>
                <ul>
                    <li class="rating-list"
                        v-for="(rating, index) in ratings"
                        :key="index"
                        v-show="needShow(rating.ratingType, rating.text)">
                        <div class="content-left">
                            <img class="avatar" :src="rating.avatar" width="28px" height="28px">
                        </div>
                        <div class="content-right">
                            <div class="info">
                                <span class="name">{{rating.username}}</span>
                                <span class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</span>
                            </div>
                            <div class="desc">
                                <star class="star" :score="rating.score" :size="36"></star>
                                <span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <div class="text">{{rating.text}}</div>
                            <div class="recommend" v-if="rating.recommend.length">
                                <i class="iconfont icon"
                                    :class="rating.ratingType === 0 ? 'icon-icon_thumb_up_alt':'icon-iconthumbdown'">
                                </i>
                                <span class="recommend-list ellipsis"
                                    v-for="(item, index) in rating.recommend"
                                    :key="index">{{item}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import { mapState } from 'vuex';
    import { formatDate } from '../../common/js/date';
    import Star from '../../components/Star/Star';
    import Split from '../../components/Split/Split';
    import RatingSelect from '../../components/RatingSelect/RatingSelect';

    const ALL = 2; // 满意

    export default {
        mounted() {
            this.$store.dispatch('getRatings', () => {
                this.$nextTick(() => {
                    if (!this.ratingsScroll) {
                        this.ratingsScroll = new BScroll('.ratings', {
                            click: true
                        });
                    } else {
                        this.ratingsScroll.refresh();
                    }
                });
            });
        },
        data () {
            return {
                ratingType: ALL,
                desc: {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                },
                onlyContent: true
            };
        },
        computed: {
            ...mapState(['seller', 'ratings'])
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        components: {
            Star,
            Split,
            RatingSelect
        },
        methods: {
            switchRatingType(type) {
                this.ratingType = type;
            },
            switchContentFlag(flag) {
                this.onlyContent = !flag;
            },
            needShow(type, text) {
                const { onlyContent, ratingType } = this;
                if (onlyContent && !text) {
                    return false;
                }
                if (ratingType === ALL) {
                    return true;
                } else {
                    return type === ratingType;
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/index.styl";
    .ratings
        position: absolute
        top: 174px // 上方凸显头部header
        left: 0
        bottom: 0
        width: 100%
        overflow: hidden
        .ratings-content
            .overview
                display: flex
                padding: 18px 0
                .overview-left
                    flex: 0 0 137px
                    padding: 6px 0
                    width: 137px
                    border-right: 1px solid rgba(7, 17, 27, .1)
                    text-align: center
                    .score
                        line-heigth: 28px
                        font-size: 14px
                        color: rgb(255, 153, 0)
                    .text
                        margin: 6px 0 8px 0
                        line-heigth: 12px
                        font-size: 12px
                        color: rgb(7, 17, 27)
                    .rank
                        line-heigth: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                .overview-right
                    flex: 1
                    margin: 0 24px
                    .score-wrapper
                        font-size: 0
                        .title
                            display: inline-block
                            vertical-align: top
                            margin-bottom: 8px
                            line-height: 18px
                            font-size: 12px
                            color: rgb(7, 17, 27)
                        .star
                            display: inline-block
                            vertical-align: top
                            margin: 0 12px
                        .score
                            display: inline-block
                            vertical-align: top
                            line-height: 18px
                            font-size: 12px
                            color: rgb(255, 153, 0)
                    .delivery-time
                        line-height: 18px
                        font-size: 0
                        .title
                            margin-right: 12px
                            font-size: 12px
                            color: rgb(7, 17, 27)
                        .time
                            font-size: 12px
                            color: rgb(147, 153, 159)
            .rating
                .rating-list
                    display: flex
                    padding: 18px 0
                    margin: 0 18px
                    bottom-border-1px(rgba(7, 17, 27, .1))
                    .content-left
                        flex: 0 0 28px
                        .avatar
                            border-radius: 50%
                    .content-right
                        position: relative
                        flex: 1
                        margin-left: 12px
                        .info
                            margin-bottom: 4px
                            font-size: 0
                            .name
                                display: inline-block
                                line-height: 12px
                                font-size: 10px
                                color: rgb(7, 17, 27)
                            .time
                                display: inline-block
                                position: absolute
                                top: 0
                                right: 0
                                line-height: 12px
                                font-size: 10px
                                font-weight: 200
                                color: rgb(147, 153, 159)
                        .desc
                            margin-bottom: 6px
                            font-size: 0
                            .star
                                display: inline-block
                                vertical-align: top
                                margin-right: 6px
                            .delivery-time
                                display: inline-block
                                vertical-align: top
                                line-height: 18px
                                font-size: 10px
                                font-weight: 200
                                color: rgb(147, 153, 159)
                        .text
                            margin-bottom: 8px
                            line-height: 18px
                            font-size: 12px
                            color: rgb(7, 17, 27)
                        .recommend
                            font-size: 0
                            .icon
                                margin-right: 8px
                                line-height: 16px
                                font-size: 12px
                                &.icon-icon_thumb_up_alt
                                    color: rgb(0, 160, 220)
                                &.icon-iconthumbdown
                                    color: rgb(183, 187, 191)
                            .recommend-list
                                display: inline-block
                                vertical-align: top
                                width: 50px
                                line-height: 16px
                                margin: 0 8px 4px 0
                                padding: 0 6px
                                text-align: center
                                border: 1px solid rgba(7, 17, 27, .1)
                                border-radius: 2px
                                background: rgb(255, 255, 255)
                                font-size: 9px
                                color: rgb(147, 153, 159)
</style>