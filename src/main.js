import Vue from 'vue';
import axios from '@/http';
// import { from } from "_array-flatten@2.1.2@array-flatten";
import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters

// 精度
import { math } from './util.js';
Vue.prototype.$math = math;

// 表单验证
import rules from '@/utils/rules';
Vue.prototype.$rules = rules;

import permission from '@/directive/permission';
Vue.use(permission);

// 引入echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

import mixin from '@/utils/mixin';
Vue.mixin(mixin);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
