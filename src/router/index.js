import Vue from 'vue'
import Router from 'vue-router'
import login from '@/login/login' //登录页
import userinfo from '@/userinfo/info' //用户-个人信息
import example from '@/userinfo/example' //用户-实例列表
import addExample from '@/userinfo/addExample' //用户-新增实例
import imgList from '@/userinfo/imgList' //用户-实例列表 - 图片列表
import order from '@/order/list' //订单-订单列表
import construction from '@/order/modules/construction' //订单-订单列表

import order_details from '@/order/order_details' //订单-订单详情页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login', //登录页
      name: 'login',
      component: login
    },
    {
      path: '/', //框架页 - 首页
      name: 'index',
      component: () => import('@/index/index'),
    },
    // 个人信息
    {
      path: '/userinfo/info',
      name: 'Personal-info',
      component: () => import('@/userinfo/info')
    },
    // 个人信息
    {
      path: '/userinfo/info',
      name: 'Personal-info',
      component: () => import('@/userinfo/info')
    },
    // 实例列表
    {
      path: '/userinfo/example',
      name: 'example',
      component: () => import('@/userinfo/example')
    },
    // 实例列表 - 新增
    {
      path: '/userinfo/addExample',
      name: 'addExample',
      component: () => import('@/userinfo/addExample')
    },
    // 图片列表
    {
      path: '/userinfo/imgList',
      name: 'imgList',
      component: () => import('@/userinfo/imgList')
    },
    // 订单列表
    {
      path: '/order/list',
      name: 'orderList',
      component: () => import('@/order/list'),
    },
    // 上传施工图
    {
      path: '/order/modules/construction',
      name: 'construction',
      component: () => import('@/order/modules/construction')
    },
    //订单详情页
    {
      path: '/order/order_details',
      name: 'order_details',
      component: () => import('@/order/order_details'),
      children: [
        // 订单详情页
        {
          path: '/order/modules/designFee',
          name: 'designFee',
          component: () => import('@/order/modules/designFee')
        }
      ]
    }


  ]
})
