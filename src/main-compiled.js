/**
 * 入口JS
 */
import Vue from 'vue';
import App from './App';
import router from './router';

new Vue({
    el: '#app',
    render: function render(h) {
        return h(App);
    },
    router: router
});

//# sourceMappingURL=main-compiled.js.map