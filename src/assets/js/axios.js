import axios from 'axios';
import Vue from 'vue';
// import store from '@/store';
import router from '@/router';
import  { ToastPlugin, AlertPlugin, LoadingPlugin } from 'vux';
import { getLocalStorage, removeLocalStorage } from 'assets/js/storage';
Vue.use(ToastPlugin, {position: 'top'});
Vue.use(AlertPlugin);
Vue.use(LoadingPlugin);
const vueInstance = new Vue();
let tipClock = false;

// var PROD_URL = process.env.BASE_URL;//process.env.BASE_URL在webpack中配置。dev.env.js为测试环境，prod.env.js为发布环境
// axios.defaults.baseURL = PROD_URL // 配置 apiURL
axios.defaults.timeout = 3000; // 3s超时
axios.interceptors.request.use((config) => {
  vueInstance.$vux.loading.show({
    text: '请稍等'
  });
  // store.dispatch('toggleLoadShow', true);
  const token = getLocalStorage('token');
  config.headers['Authorization'] = token && `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});
axios.interceptors.response.use((response) => {
  vueInstance.$vux.loading.hide();
  // store.dispatch('toggleLoadShow', false);
  // return response;
  // console.log(response);
  if (response.status === 204) {
    return null;
  } else if (response.status === 200) {
    return response.data === '' ? true : response.data;
  } else {    
    return response;
  }
}, (error) => {
  vueInstance.$vux.loading.hide();
  // store.dispatch('toggleLoadShow', false);
  console.log(error.response);
  //   console.log('捕获到一个错误，错误信息：' + error);
  if (/Network Error/i.test(error)) {
    vueInstance.$vux.toast.text('您当前无法上网，请检查你的移动数据开关或wifi是否正常');
  }
  if (/ms exceeded/i.test(error)) {
    vueInstance.$vux.toast.text('您的网络连接不稳定，请检查你的移动数据开关或wifi是否正常');
  }
  if (/code 500/i.test(error)) {
    vueInstance.$vux.toast.text(error.response.data.Message);
  }
  if(/ code 401/i.test(error)) {
    if(!tipClock) {
      vueInstance.$vux.alert.show({
        title: '无访问权限',
        content: '请重新登录',
        onShow () {
          tipClock = true;
        },
        onHide () {
          tipClock = false;
          removeLocalStorage('token');
          router.replace({ path: '/login' });
        }
      });
    }
  }
  if (/code 400/i.test(error)) {
    // vueInstance.$vux.toast.text(error.response.data.Message);
    return Promise.reject(error.response.data.Message);
  }
  if (/code 403/i.test(error)) {
    vueInstance.$vux.toast.text('无权调用接口');
  }
  if (/code 405/i.test(error)) {
    vueInstance.$vux.toast.text('请求方法错误');
  }
  // return Promise.reject(error);
});
export default axios;
