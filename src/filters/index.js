/*
import Vue from 'vue';
import moment from 'moment';

// 自定义过滤器
Vue.filter('date-format', (value, dateString = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(value).format(dateString);
})
*/

// 打包文件分析与优化——由于moment包比较大，换成date-fns
import Vue from 'vue';
import format from 'date-fns/format';
// 自定义过滤器
Vue.filter('date-format', (value, dateString = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(value).format(dateString);
})
