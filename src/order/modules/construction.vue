<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class="order_form">
      <div class="text-r m-b-sm"> <router-link to="/order/list">返回订单列表</router-link></div>
        <div class="m-b-xxl">
        <a-form-item label="上传施工图包" required>
          <a-upload action="http://apitesttest.rongzw.com/api/upload/image" name="file" :multiple="true" @change="handleChangeZip" :remove="handleFileRemove" accept="rar, zip">
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <a-button class="m-t" type="primary" icon="cloud-upload" @click="upload()" v-show="uploadOriginFileObj">
             确认上传
          </a-button>
          <a-alert message="文件已上传成功!" type="success" show-icon v-show="uploadSuccess" />



        </a-form-item>
        </div>

       <h3>根据施工图确定各个劳务公司的订单报价</h3>
       <a-form v-bind="formLayout" >
        <div class="construction-table">
          <table width="100%">
            <tr>
              <th>ID-施工公司</th>
              <th>报价单</th>
              <th>订单报价</th>
              <th>上传报价单PDF</th>
              <th>操作</th>
            </tr>
            <tr v-for="gpc of getPushSgCompany">
              <td width="300">{{gpc.company_id}}-{{gpc.company_name}}</td>
              <td><a :href="gpc.quotation" target="_blank" title="点击查看"><img :src="gpc.quotation" width="60" height="60" alt=""></a></td>
              <td>{{gpc.price}}元</td>
              <td>{{gpc.quotation_pdf}}</td>
              <td width="140">
                <a @click="handleUpload(true,gpc)">报价-上传</a>
              </td>
            </tr>
          </table>
          <a-divider />
          <div class="m-b-xxl m-t-xl text-c">
            <a-button size="large" type="primary" @click="uploadSubmit" class="w">立即提交</a-button>
          </div>
        </div>
      </a-form>

      <!-- 报价-上传 -->
      <a-modal title="订单报价-上传报价单PDF" :width="840" :visible="uploadVisible" @cancel="() => handleUploadCancel(false)" :confirm-loading="confirmLoading" :footer="null">
        <uploadPDF v-if="uploadPDFshow" :companyInfo="companyInfo" @childClose="getChildClose(arguments)" />
      </a-modal>

  </a-card>
</template>

<script>
import uploadPDF from './uploadPDF' //报价-上传
export default {
  components: {
    uploadPDF
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
      uploadPDFshow: true, //强制刷新 报价-上传 子组件
      headers: {
        rization: 'authorization-text',
      },
      getPushSgCompany:[],
      getPushSgCompanyList:[],
      suffix:'',
      uploadOriginFileObj:'',
      archiveUrl:'', //压缩包地址
      uploadSuccess:false,
      confirmLoading: false,
      uploadVisible:false,//对话框是否可见
      companyInfo:{},//施工公司数据
      childClose:{},//报价-上传，弹出框 关闭信号
      childQuotation:'',//报价
      childPdfUrl:'',//PDF地址
      priceList:[],
    }
  },
  mounted() {
    document.cookies
    var token = this.$cookies.get("token")
    this.$ajax({
      url:'/designer/order/getPushSgCompany', //获取推送的劳务公司列表
      method: 'get',
      params:{
        user_token:token,
        order_id: this.$route.query.id,
      }
    })
    .then((res)=>{
      this.getPushSgCompany = res.data.data
      this.getPushSgCompanyList = res.data.data
    });
    //[Web] 文件上传 前获取令牌
    this.$ajax({
      url:'/api/upload/getOssPolicy',
      method: 'get',
    })
    .then((res)=>{
      this.getOssPolicy = res.data.data
    });

   // this.getOssToken();

  },
  methods: {
    //获取后缀名
    getSuffix(filename) {
        var pos = filename.lastIndexOf('.')
        if (pos != -1) {
            this.suffix = filename.substring(pos)
        }
    },
    //随机生成文件名
    randomString(len) {
    　　var len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    //上传施工图包 - 确认上传到阿里云OSS
    upload(){
                var _self = this;
                var formData = new FormData();
                //注意formData里append添加的键的大小写
                //suffix = this.getSuffix(this.uploadName)
                var filename = _self.getOssPolicy.dir + _self.randomString(10) + _self.suffix
                //console.log(suffix)
                formData.append('key', filename); //存储在oss的文件路径
                formData.append('OSSAccessKeyId', _self.getOssPolicy.accessid); //accessKeyId
                formData.append('policy', _self.getOssPolicy.policy); //policy
                formData.append('Signature', _self.getOssPolicy.signature); //签名
                //如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
                formData.append("file",this.uploadOriginFileObj);
                formData.append('success_action_status', 200); //成功后返回的操作码
                var url = _self.getOssPolicy.host;
                this.$ajax({
                  url:url,
                  method: 'POST',
                  data: formData,
                })
                .then((res)=>{
                  this.archiveUrl = url + '/' + filename;
                  if(this.archiveUrl != undefined){
                    this.uploadOriginFileObj = undefined;
                    this.uploadSuccess = true;
                  }
                  console.log(this.archiveUrl)
                });
            },
    //上传施工图包
    handleChangeZip(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
            this.uploadName = info.file.name //获取组件-文件上传后的文件名
            this.uploadOriginFileObj = info.file.originFileObj
            //this.uploadName = info.fileList[0].originFileObj.name //获取组件-文件上传后的文件名
            this.getSuffix(this.uploadName);
      } else if (info.file.status === 'error') {
            this.$message.error('上传失败');
      }
    },
    // 上传施工图包文件删除
    handleFileRemove (file) {
       this.uploadSuccess = false;
    },
    //操作 报价-上传
    handleUpload (uploadVisible,gpc) {
       this.uploadVisible = uploadVisible;
       this.companyInfo = gpc; //拿到施工公司信息
    },
    //操作 报价-上传  关闭
    handleUploadCancel (uploadVisible) {
       this.uploadVisible = uploadVisible;
    },
    getChildClose(params){ //操作 报价-上传 子组件向父组件传值
       this.childClose = params[0];  //关闭信号
       this.childQuotation = params[1]; //报价
       this.childPdfUrl = params[2]; //PDF地址
       this.childCompanyId = params[3]; //施工公司ID
       console.log(params[1],"报价")
       console.log(params[2],"PDF地址")
       console.log(params[3],"施工公司ID")
       for (var i = 0; i < this.getPushSgCompany.length; i++){
           if(this.getPushSgCompany[i].company_id == this.childCompanyId){
              this.getPushSgCompany[i].price = this.childQuotation
              this.getPushSgCompany[i].quotation_pdf = this.childPdfUrl
            }
            console.log(this.getPushSgCompany[i])
       }

       if(this.childClose == 0){
          this.handleUploadCancel(); //收到关闭信号,执行关闭
          this.pricelist();
          //this.getWorkImage(); //重新请求列表接口
          //强制刷新新增图片子组件
          this.uploadPDFshow= false;
          this.$nextTick(() => {
              this.uploadPDFshow= true;
          });
       }
     },
     pricelist(){ //新建一个提交接口的数组
      this.priceList = [];
      for (var i = 0; i < this.getPushSgCompany.length; i++){
          var obj = {};
          obj.id = this.getPushSgCompany[i].company_id;
          obj.price = this.getPushSgCompany[i].price;
          obj.quotation_pdf = this.getPushSgCompany[i].quotation_pdf;
          this.priceList.push(obj);
       }
     },
     //立即提交
     uploadSubmit(){
       document.cookies
       var token = this.$cookies.get("token")

       if(this.archiveUrl == ""){
         this.$message.error("上传施工图包不能为空");
         return
       }
       if(this.priceList == ""){
         this.$message.error("施工公司报价或报价单未填写完成");
         console.log(this.priceList)
         return
       }

       this.$ajax({
         url:'/designer/order/uploadSgPlan', //提交订单设计施工图
         method: 'post',
         params:{
           user_token:token,
         },
         data:{
           order_id: this.$route.query.id,
           sg_zip:this.archiveUrl,//施工图URL
           price: this.priceList,
         }
       })
       .then((res)=>{
         if(res.data.code == 1){
           this.$message.error(res.data.msg);
         }
         if(res.data.code == 0){
           this.$message.success(res.data.msg);
           this.$router.push({
              name: "orderList"
           })
         }
       });
     }
  },
}
</script>
<style lang="less" scoped>
.construction-table {
  tr {
    th { padding: 10px; background-color: #fafafa; border-bottom: 1px solid #e8e8e8; color:#000000;}
    td { padding: 10px; border-bottom: 1px solid #e8e8e8;}
    &:last-child td { border: 0;}
  }
}
</style>
