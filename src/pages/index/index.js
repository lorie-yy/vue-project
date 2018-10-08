import Vue from 'vue';
import App from './index.vue';
import router from '@/router';
import store from '@/store';

import 'reset-css';
import '!style-loader!css-loader!less-loader!@/assets/style/common.less';
import 'swiper/dist/css/swiper.css';
import 'amfe-flexible';
// require ('swiper/dist/css/swiper.css');

import { getRequest, postRequest } from '@/assets/js/fetch';
import { setFontSize, setBubbleWidth } from '@/assets/js/utils';
import 'assets/js/vuxComponents';
import VueAwesomeSwiper from 'vue-awesome-swiper';
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;

Vue.prototype.$get = getRequest;
Vue.prototype.$post = postRequest;

Vue.directive('font', {
    inserted: (el, binding) => {
        // console.log(el)
        let orgFont = binding.value.fontSize;
        let anchor = binding.value.anchor;
        let targetFont = window.innerHeight * orgFont / 1536;
        let v_center = binding.value.isVCenter;
        let scale = targetFont / 12;
        if (targetFont < 12 && el.offsetHeight !== 0) {
            let prefix = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
            el.style.height = `${el.offsetHeight / scale}px`;
            el.style.width = `${el.offsetWidth / scale}px`;
            el.style.fontSize = orgFont;
            el.style.transformOrigin = anchor;
            let st = window.getComputedStyle(el, null);
            if (v_center) {
                el.style.lineHeight = el.style.height;
            } else {
                let lineH = parseInt(st.lineHeight);
                el.style.lineHeight = lineH / scale + 'px';
            }
            let matrix = 'matrix(1,0,0,1,0,0)';
            prefix.forEach(pre => {
                let val = st[pre + 'transform'];
                if (val && val !== 'none') {
                    matrix = val;
                }
            });
            let strVal = matrix.replace('matrix', '').replace(/\(|\)|\s+/g, '');
            let targetVal = strVal.split(',').map((item, index) => {
                if (index === 0 || index === 3) {
                    return +item * scale;
                } else {
                    return +item;
                }
            });
            el.style.transform = 'matrix(' + targetVal.join(',') + ')';
        }
    },
});

Vue.directive('transform', {
    inserted(el, binding) {

        let width = binding.value.width,
            height = binding.value.height,
            fontSize = binding.value.fontSize,
            anchor = binding.value.anchor
        el.style.width = width + "px";
        el.style.height = height + "px";
        el.style.fontSize = fontSize + "px";
        el.style.transformOrigin = anchor;
        let scale = window.innerHeight / 1536;
        let prefix = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
        let st = window.getComputedStyle(el, null);
        let matrix = 'matrix(1,0,0,1,0,0)';
        prefix.forEach(pre => {
            let val = st[pre + 'transform'];
            if (val && val !== 'none') {
                matrix = val;
            }
        });
        let strVal = matrix.replace('matrix', '').replace(/\(|\)|\s+/g, '');
        let targetVal = strVal.split(',').map((item, index) => {
            if (index === 0 || index === 3) {
                return +item * scale;
            } else {
                return +item;
            }
        });
        el.style.transform = 'matrix(' + targetVal.join(',') + ')';
    }
})

Vue.directive('width', {
    //设置单元B的宽度
    inserted: (el, binding) => {
        setBubbleWidth(el);
    },
    update: (el, binding) => {
        setBubbleWidth(el);
    }
});

Vue.prototype.$setFontSize = setFontSize;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
});