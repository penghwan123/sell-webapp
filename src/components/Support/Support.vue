<template>
    <div class="support">
        <span class="icon" :class="supportClassMap"></span>
        <span class="text">{{description}}</span>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: Number
            },
            description: {
                type: String
            }
        },
        data () {
            return {
            };
        },
        computed: {
            supportClassMap () {
                return ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .support
        .icon
</style>