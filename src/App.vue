<template>
 <a-config-provider :locale="zh_CN">
  <div id="app" style="height: 100%;">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo">
          <img src="~@/assets/img/AppIcon.png" class="logoimg" alt="">
          <span class="logoText">劳务公司管理端</span>
        </div>
        <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :default-open-keys="['2','3']"> <!-- 2、3导航菜单默认展开 -->
          <a-menu-item key="1">
            <a-icon type="bank" />
            <span><router-link to="/" class="text-white">首页</router-link></span>
          </a-menu-item>
          <a-sub-menu key="2">
              <span slot="title"><a-icon type="user" /><span>用户</span></span>
              <a-menu-item key="2-1">
                 <router-link to="/userinfo/info">公司信息</router-link>
              </a-menu-item>
              <a-menu-item key="2-2">
                <router-link to="/userinfo/site">工地列表</router-link>
              </a-menu-item>
           </a-sub-menu>
          <a-sub-menu key="3">
              <span slot="title"><a-icon type="user" /><span>订单</span></span>
              <a-menu-item key="3-1">
                 <router-link to="/order/list">订单列表</router-link>
              </a-menu-item>
           </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)"/>
          <span class="fr logoutwrap" @click="logout"><a-icon class="logout" type="logout" />退出</span>
          <div class="fr">
            <a-avatar size="small" :src="userinfo.user_image"/>
            {{userinfo.nick_name}}
          </div>
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px', minHeight: '280px' }">
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout>

  </div>
</a-config-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import '@/assets/css/app.css'  //公用样式库

moment.locale('zh-cn');
export default {
  name: 'App',
  data() {
    return {
      collapsed: false,
      userinfo:[],
      zh_CN,
    };
  },
  mounted() {
    document.cookies
    var token = this.$cookies.get("token")
    if(token === null || token === undefined || token === ''){
         this.$message.error('您尚未登录，请先登录');
    	   this.$router.push({path:'/'})
    }
    this.$ajax({
      url:'/sg/infos', //劳务信息
      method: 'post',
      params:{
        user_token:token
      }
    })
    .then((res)=>{
      this.userinfo = res.data.data
    });
  },
  methods: {
    logout(){
      this.$cookies.remove("token");
      this.$router.push({ path: '/login' })
    },
    collapse(collapsed){
      console.log(this.collapsed)
    }
  }
}
</script>

<style lang="less">
body { height: 100%; background-color: #f7f7f7;}
.appwrap { height: 100%;}
.logo { background-color:transparent !important;
  .logoimg { vertical-align: middle; display: inline-block; width: 24px; height: 24px;}
  >span { vertical-align: middle; color:#fff; font-size: 19px; font-weight: 700;}
}
#components-layout-demo-custom-trigger { height: 100%;
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }
  .logoutwrap { padding: 0 24px; cursor: pointer;
    .logout {
      font-size: 18px;
      line-height: 64px;
      padding: 0 5px 0 0;
      transition: color 0.3s;
    }
    &:hover {
      color: #1890ff;
    }
  }
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.ant-layout-sider-collapsed {
  .logo { text-align: center;}
  .logoText {
    display: none;
  }
}
</style>
