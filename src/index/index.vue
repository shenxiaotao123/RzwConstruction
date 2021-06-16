<template>
<div>
    <div class="bg-ff m-b-md clear wrapper-lg">
      <div class="page-header-content fl">
        <div class="avatar">
          <a-avatar size="large" :src="userinfo.user_image"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{userinfo.nick_name}}<span class="welcome-text">，你好！</span>
            <span class="m-l">
              <a-tag color="#f50" v-if="userinfoinfos.is_allow_order == 20">休息中</a-tag>
              <a-tag color="#87d068" v-if="userinfoinfos.is_allow_order == 10">接单中</a-tag>
            </span>
          </div>
          <div> {{userinfoinfos.level_name}} | 我的设计费: {{userinfoinfos.money}}元/平方米</div>
        </div>
      </div>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="当前余额" :value="userinfo.balance">
            <template #suffix>
              <span class="size14">元</span>
              <a>（提现）</a>
            </template>
          </a-statistic>
        </div>
        <div class="stat-item" @click="fansListChange(true)">
          <a-statistic title="粉丝数" :value="userinfo.user_fans_num" class="pointer" />
        </div>
      </div>
    </div>

    <a-row :gutter="24">
        <a-col :span="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="订单(统计已付定金)" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="wrapper-sm padder-tb-lg">
               <a-row :gutter="[0,25]" class="text-c">
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="本周" :value="index.paid_order_week" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="本月" :value="index.paid_order_month" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="本年度" :value="index.paid_order_year	" />
                   </div>
                 </a-col><a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="累计" :value="index.paid_order_all" />
                   </div>
                 </a-col>
               </a-row>
            </div>
          </a-card>
        </a-col>
        <a-col :span="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card title="收入(结算到账)" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
              <div class="wrapper-sm padder-tb-lg">
                 <a-row :gutter="[0,25]" class="text-c">
                   <a-col :span="12">
                     <div class="stat-item">
                       <a-statistic title="本周" :value="index.order_money_week"><template #suffix>元</template></a-statistic>
                     </div>
                   </a-col>
                   <a-col :span="12">
                     <div class="stat-item">
                       <a-statistic title="本月" :value="index.order_money_month"><template #suffix>元</template></a-statistic>
                     </div>
                   </a-col>
                   <a-col :span="12">
                     <div class="stat-item">
                       <a-statistic title="本年度" :value="index.order_money_year"><template #suffix>元</template></a-statistic>
                     </div>
                   </a-col><a-col :span="12">
                     <div class="stat-item">
                       <a-statistic title="累计" :value="index.order_money_all"><template #suffix>元</template></a-statistic>
                     </div>
                   </a-col>
                 </a-row>
              </div>
            </a-card>
        </a-col>
        <a-col :span="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card title="待结算" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
              <div class="wrapper-sm padder-tb-lg">
                <a-row :gutter="[0,25]" class="text-c">
                  <a-col :span="12">
                    <div class="stat-item">
                      <a-statistic title="合计" :value="index.wait_money_all"><template #suffix>元</template></a-statistic>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-card>
        </a-col>
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card  title="动态" :bordered="false">
            <a-list>
              <a-list-item v-for="(mes,index) in message" :key="index">
                <a-list-item-meta>
                   <a-avatar slot="avatar" :src="mes.content.sender_infos.sender_image"/> -->
                  <div slot="title">
                    <span>{{mes.content.sender_infos.sender_name}}</span>&nbsp;
                    {{mes.content.action_text}}
                    <!-- {{mes.content.sender_infos.action_text}} -->
                    <span class="fr text-gray">{{mes.created_at}}</span>
                  </div>

                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="待处理订单" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="wrapper-sm padder-tb-lg">
               <a-row :gutter="[0,25]" class="text-c">
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="待确认设计费" :value="index.submit_order" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="待量房" :value="index.wait_amount_order" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="待上传平面图" :value="index.wait_plan_order" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="待上传施工图" :value="index.wait_drawing_order" />
                   </div>
                 </a-col>
                 <a-col :span="12">
                   <div class="stat-item">
                     <a-statistic title="待现场交底" :value="index.wait_finish_order" />
                   </div>
                 </a-col>
               </a-row>
            </div>
          </a-card>
        </a-col>
    </a-row>

    <!-- 粉丝列表 -->
    <a-modal title="粉丝列表" :width="840" :visible="fansListVisible" @cancel="() => fansListChange(false)" :footer="null">
      <fansList />
    </a-modal>

</div>
</template>

<script>
 import fansList from './fansList' //新增图片
export default {
  name: 'index',
  components: {
    fansList
  },
  data () {
    return {
      loading: true,
      fansListVisible: false,//对话框是否可见
      index:[],
      userinfo:[],
      userinfoinfos:[],
      message:[],
    }
  },
  created () {

  },
  mounted () {
    document.cookies
    var token = this.$cookies.get("token")
    console.log(token);
    this.NotLogin();
    this.$ajax({
      url:'/designer/index', //首页
      method: 'get',
      params:{
        user_token:token
      }
    })
    .then((res)=>{
      this.index = res.data.data
    });
    this.$ajax({
      url:'/designer/infos', //设计师信息
      method: 'post',
      params:{
        user_token:token
      }
    })
    .then((res)=>{
      this.userinfo = res.data.data
      this.userinfoinfos = res.data.data.infos
    });
    this.$ajax({
      url:'/designer/index/message', //首页-动态
      method: 'post',
      params:{
        user_token:token
      },
      data:{
        itemsPerLoad:5
      }
    })
    .then((res)=>{
      this.message = res.data.data.data
    });

  },
  methods: {
    fansListChange (fansListVisible) {
       this.fansListVisible = fansListVisible;
    },
    NotLogin(){
      document.cookies
      var token = this.$cookies.get("token")
      if(token == null){
        this.$router.push({ path: '/login' })
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }
.extra-content {
  float: right;
  white-space: nowrap;

  .stat-item {
    position: relative;
    display: inline-block;
    padding: 0 32px;

    > p:first-child {
      margin-bottom: 4px;
      line-height: 22px;
    }

    > p {
      margin: 0;
      font-size: 30px;
      line-height: 38px;

      > span {
        font-size: 20px;
      }
    }

    &::after {
      position: absolute;
      top: 8px;
      right: 0;
      width: 1px;
      height: 40px;
      content: '';
    }

    &:last-child {
      padding-right: 0;

      &::after {
        display: none;
      }
    }
  }
}
.page-header-content {
  display: flex;
 .avatar {
    flex: 0 1 72px;
    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
    }
  }
.content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    line-height: 22px;

    .content-title {
      margin-bottom: 12px;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
