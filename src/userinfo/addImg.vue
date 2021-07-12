<template>
    <a-spin :spinning="loading">
     <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
       <a-form @submit="ImgSubmit">
         <a-form-item label="图片" :labelCol="{lg: {span: 5}, sm: {span:5}}" :wrapperCol="{lg: {span: 14}, sm: {span: 17} }">
          <!-- <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" @preview="handlePreview" @change="imgHandleChange" accept="image/png, image/jpeg" :before-upload="beforeUpload"> -->
          <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" @preview="handlePreview" @change="imgHandleChange" accept="image/png, image/jpeg">
             <div v-if="fileList.length < 10">
               <a-icon type="plus" />
               <div class="ant-upload-text">
                 选择图片
               </div>
             </div>
           </a-upload>
           <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
             <img alt="example" style="width: 100%" :src="previewImage" />
           </a-modal>
           <div class="picWrap m-r-sm" v-for="picjson in SiteStageDetail.pic_json" title="点击删除">
             <img :src="picjson" width="50" height="50" class="picbr" alt="" @click="deletePic(pic)">
             <a-icon type="delete" theme="filled" class="addImgIcon" />
           </div>
         </a-form-item>

         <a-form-item label="说明文字" :labelCol="{lg: {span: 5}, sm: {span: 5}}" :wrapperCol="{lg: {span: 14}, sm: {span: 17} }">
            <a-textarea rows="4" placeholder="请输入公司简介" v-model="SiteStageDetail.note" />
         </a-form-item>

         </a-form-item>
         <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
           <a-button size="large" htmlType="submit" type="primary">立即提交</a-button>
         </a-form-item>
       </a-form>
     </a-card>

    </a-spin>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  props: {
    siteId:'',
    stageId:'',
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
    }
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      note:'', //简介
      uploadExampleImage:'', //图片地址
      uploading: false,
      imgArray:[],
      SiteStageDetail:{},
    }
  },
  mounted() {
    console.log(this.stageId)
    this.SiteStageDetailData();//工地阶段信息数据详情
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // beforeUpload(file) {
    //     this.fileList = [...this.fileList, file];
    //     return false;
    // },
    imgHandleChange(info){
      if (info.file.status !== 'uploading') {
              //console.log("我上传中");
              console.log(info.file.thumbUrl);
              var thumbUrl = info.file.thumbUrl
              this.$ajax({
                url:'/api/upload/image', //图片上传接口
                method: 'post',
                data:{
                  base64_string	:thumbUrl
                }
              })
              .then((res)=>{
                this.uploadExampleImage = res.data.data.url
                this.imgArray.push(this.uploadExampleImage) //省市县ID添加到空数组里
                console.log("数组",this.imgArray)
                //this.$emit('uploadExampleImage',this.uploadExampleImage.url); //向父组件发送图片地址
              });
      }
      if (info.file.status === 'done') {
        //console.log("我上传好了")
      }
    },
    SiteStageDetailData(){ //工地阶段信息数据详情
      var token = this.$cookies.get("token")
      this.$ajax.get('/sg/SiteStageDetail',{
          params:{
             user_token:token,
             site_id:this.siteId,
             stage_id:this.stageId,
          },
        })
      .then(res=>{
        this.SiteStageDetail = res.data.data;
        this.imgArray = res.data.data.pic_json
      });
    },
    ImgSubmit(){ //提交
      // console.log(this.SiteStageDetail.note)
      // console.log(this.SiteStageDetail.pic_json)
      if(this.SiteStageDetail.note || this.SiteStageDetail.pic_json === 'undefined'){
        console.log('我是修改')
        this.modifyImgSubmit();
      }else{
        console.log('我是新增')
        this.addImgSubmit();
      }
    },
    addImgSubmit(){ //新增
      var token = this.$cookies.get("token")
      this.$ajax({  //上传工地阶段信息图文
        url: '/sg/SiteStageInfos',
        method: 'post',
        params:{
          user_token:token,
        },
        data:{
          site_id: this.siteId,//工地ID
          pic_json: this.imgArray,//图片数组
          stage_id:this.stageId,//工地阶段ID
          note:this.SiteStageDetail.note,//文字说明
        },
      }).then(res => {
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.$emit('childClose','0'); //向父组件发送关闭弹出框信号
        }
        });
    },
    modifyImgSubmit(){ //修改
      var token = this.$cookies.get("token")
      this.$ajax({  //上传工地阶段信息图文
        url: '/sg/SiteStageInfos',
        method: 'post',
        params:{
          user_token:token,
        },
        data:{
          site_id: this.siteId,//工地ID
          pic_json: this.imgArray,//图片数组
          stage_id:this.stageId,//工地阶段ID
          note:this.SiteStageDetail.note,//文字说明
        },
      }).then(res => {
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.$emit('childClose','0'); //向父组件发送关闭弹出框信号
        }
        });
    },
    deletePic(pic){
      this.SiteStageDetail.pic_json.splice(this.SiteStageDetail.pic_json.indexOf(pic),1);
    }
  },
}
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.picWrap { float: left; position: relative;
    &:hover { background-color: #000; }
    .addImgIcon { position: absolute; right:-5px; top: -5px; color:#f00;}
    .picbr { border: 1px solid #ccc; border-radius: 2px; cursor: pointer;

      &:last-child { width: 50px; height: 50px; background-color: #000;}
    }
  }
</style>
