<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <div class="m-b-md">
          <a @click="$router.push({path:'/userinfo/site'})" class="fr">返回工地列表</a>
         工地ID：{{siteDetails.id}}
          <span class="m-l-lg">标题：{{siteDetails.title}}</span>
        </div>
      </div>
      <a-divider />
      <a-row :gutter="[0,40]">
        <a-col :span="12">
          <a-form-item label="负责人" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{siteDetails.manager}}
          </a-form-item>
          <a-form-item label="施工阶段" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
           {{siteDetails.stage_name}}
          </a-form-item>
          <a-form-item label="面积" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{siteDetails.area}}㎡
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用户" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{siteDetailsUser.nick_name}}
          </a-form-item>
          <a-form-item label="所在城市" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{siteDetails.address}}
          </a-form-item>
          <a-form-item label="造价" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{siteDetails.cost}}万元
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <div class="wrapper-lg">
          <div class="siteStepsWrap">
            <div class="siteStage" v-for="(ssi,index) in SiteStageInfos" :key="index">
              <h4>
                <a-icon type="minus-circle" class="stageIcon" />
                {{ssi.name}}
                <a-icon type="form" :style="{ color: '#c00' }" class="m-l-sm" @click="handleAdd(true,ssi.id)" />
              </h4>
              <div class="padder-lg">
                <a-row v-if="ssi.infos.pic_json">
                      <a-col :span="12">
                        <img :src="ssipic" class="m-r-md radius-5" alt="" width="60" height="60" v-for="(ssipic,index) in ssi.infos.pic_json" :key="index">
                      </a-col>
                </a-row>
                <p class="m-t-sm">{{ssi.infos.note}}</p>
              </div>
            </div>
          </div>

      </div>



      <!-- 新增图片 -->
      <a-modal title="新增图片" :width="840" :visible="addImgVisible" @cancel="() => handleAdd(false)" :confirm-loading="confirmLoading" :footer="null">
        <addImg v-if="addImgshow" :siteId="site_id" :stageId="stageId" v-on:childClose="getChildClose" />
      </a-modal>

    </a-card>
</template>

<script>
import addImg from './addImg' //新增图片


export default {
  name: 'stageInfo',
  components: {
    addImg
  },
  data () {
    return {
      addImgshow: true, //强制刷新新增图片子组件
      addImgVisible: false,//对话框是否可见
      confirmLoading: false,
      childClose:{},//新增图片，弹出框 关闭信号
      siteDetails:{},
      siteDetailsUser:{},
      site_id:'',
      stageId:'',
      SiteStageInfos:[],
      SiteStageDetail:[],
    }
  },
  computed: {

  },
  mounted() {
    this.getSite(); //工地列表请求接口部分
    this.SiteStageInfosChange(); //工地阶段信息数据列表
    this.SiteStageDetailChange(); //工地阶段信息数据详情
  },
  methods: {
    //工地阶段信息数据列表
    SiteStageInfosChange(){
      var token = this.$cookies.get("token")
      this.$ajax.get('/sg/SiteStageInfos',{
          params:{
             user_token:token,
             site_id:this.$route.query.site_id,
          },
        })
      .then(res=>{
        this.SiteStageInfos = res.data.data;
      });
    },
    //工地阶段信息数据详情
    SiteStageDetailChange(){
      var token = this.$cookies.get("token")
      this.$ajax.get('/sg/SiteStageDetail',{
          params:{
             user_token:token,
             site_id:this.$route.query.site_id,
             stage_id:this.$route.query.stageId,
          },
        })
      .then(res=>{
        this.SiteStageDetail = res.data.data;
      });
    },
    //工地列表请求接口部分
    getSite(exampleId, exampleTitle, designYear){
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax.get('/sg/site/' + this.$route.query.site_id,{
          params:{
             user_token:token,
          },
        })
      .then(res=>{
        this.siteDetails = res.data.data;
        this.siteDetailsUser = res.data.data.user;
      });
    },

    handleAdd (addImgVisible,e) {
       this.addImgVisible = addImgVisible;
       this.site_id = this.$route.query.site_id
       this.stageId = e
       //强制刷新新增图片子组件
       this.addImgshow = false;
       this.$nextTick(() => {
           this.addImgshow= true;
       });
    },
    getChildClose(data){ //新增图片 子组件向父组件传值
       this.childClose = data;
       if(this.childClose == 0){
          this.handleAdd(); //收到关闭信号,执行关闭
          this.SiteStageInfosChange(); //重新请求列表接口
          console.log('重新执行工地阶段信息数据列表')
          //强制刷新新增图片子组件
          this.addImgshow = false;
          this.$nextTick(() => {
              this.addImgshow= true;
          });
       }
     },

  }
}
</script>


<style lang="less" scoped>
  .siteStepsWrap { border-left: #1890ff solid 1px;
    .siteStage { padding:0 0 20px 0;
      h4 { position: relative; padding:0 0 10px 30px; font-size: 16px; font-weight: 700;
        .stageIcon { position: absolute; left: -13px; top: -4px; padding: 5px 0; background-color: #fff; font-size: 24px; color:#1890ff;}
      }
    }
  }
  .radius-5 { border-radius: 5px;}
</style>
