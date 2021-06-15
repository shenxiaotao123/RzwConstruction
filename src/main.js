import Vue from 'vue'
import App from './App'
import less from 'less'
import router from './router'
import VueCookies from 'vue-cookies'
import Antd from 'ant-design-vue'// 引入Ant Design Vue组件
import 'ant-design-vue/dist/antd.css' // 引入Ant Design Vue样式

// 引入表单验证
import verify from "vue-verify-plugin";
Vue.use(verify, {
  blur: true // 失焦是否触发
})


Vue.config.productionTip = false;
Vue.use(Antd) //挂载到vue中
Vue.use(less)
Vue.use(VueCookies)
//Vue.use(axios)
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$ajax = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.prototype.apiurl = 'http://apitesttest.rongzw.com '          //全局注册，使用方法为:this.qs

// import VueAxios from 'vue-axios'
// Vue.use(VueAxios, axios)

axios.defaults.baseURL = '/apis';
axios.defaults.timeout = 9000 // 请求超时

// const get = (url, params) => instance.get(url + "?" + qs.stringify(params));
// const post = (url, params, config) => instance.post(url, params, config);
// const put = (url, params) => instance.put(url, params);
// const del = (url, params) => instance.delete(url + "?" + qs.stringify(params));
// export { get, post, put, del };
// 设置请求头
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.headers.get['Content-Type'] = 'application/json;charSet=UTF-8'
// axios.defaults.headers.put['Content-Type'] = 'application/json;charSet=UTF-8'
// axios.defaults.headers.delete['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.delete['Content-Type'] = 'application/json;charSet=UTF-8'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;multipart/form-data'
// axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// let http = axios.create({
//   baseURL: 'http://apitesttest.rongzw.com',
//   withCredentials: true,
//   headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',},
//   transformRequest: [function (data) {
//     let newData = '';
//     for (let k in data) {
//       if (data.prototype.hasOwnProperty.call(k) === true) {
//         newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
//       }
//     }
//     return newData;
//   }]
// });
// function apiAxios(method, url, params, response) {
//   http({
//     method: method,
//     url: url,
//     data: method === 'POST' || method === 'PUT' ? params : null,
//     params: method === 'GET' || method === 'DELETE' ? params : null,
//   }).then(function (res) {
//     response(res);
//   }).catch(function (err) {
//     response(err);
//   })
// };
// export default {
//   get: function (url, params, response) {
//     return apiAxios('GET', url, params, response)
//   },
//   post: function (url, params, response) {
//     return apiAxios('POST', url, params, response)
//   },
//   put: function (url, params, response) {
//     return apiAxios('PUT', url, params, response)
//   },
//   delete: function (url, params, response) {
//     return apiAxios('DELETE', url, params, response)
//   },
// };


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  components: { App },
  template: '<App/>'
})
