<template>
    <a-spin :spinning="loading">
      <a-form v-bind="formLayout" @submit="uploadPdfSubmit">
        <a-form-item label="订单报价">
          <a-input v-model="companyInfo.price" placeholder="请输入报价" suffix="元" />
        </a-form-item>
        <a-form-item label="上传报价单PDF">
          <a-upload name="file" :multiple="true" action="http://apitesttest.rongzw.com/api/upload/image" @change="handleChange" :remove="handleFileRemove" accept="pdf">
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <a-button class="m-t" type="primary" icon="cloud-upload" @click="upload()" v-show="uploadOriginFileObj">
             确认上传
          </a-button>
          <a-alert message="文件已上传成功!" type="success" show-icon v-show="uploadSuccess" />
          <p v-show="companyInfo.quotation_pdf">已上传：{{companyInfo.quotation_pdf}}<br/>（重新上传可覆盖）</p>
        </a-form-item>
        <div class="m-b-xl m-t-xxl text-c">
          <a-button size="large" type="primary" htmlType="submit" class="w">立即提交</a-button>
        </div>
      </a-form>
    </a-spin>
</template>

<script>
export default {
  props: {
    companyInfo:{},
    tokenData:null,
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
      headers: {
        rization: 'authorization-text',
      },
      getPushSgCompany:[],
      suffix:'',
      uploadOriginFileObj:'',
      archiveUrl:'', //压缩包地址
      uploadSuccess:false,
      getOssPolicy:{},
    }
  },
  mounted() {
    //[Web] 文件上传 前获取令牌
    this.$ajax({
      url:'/api/upload/getOssPolicy',
      method: 'get',
    })
    .then((res)=>{
      this.getOssPolicy = res.data.data
    });

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
    random_string(len) {
    　　var len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    //上传报价单PDF - 确认上传到阿里云OSS
    upload(){
                var _self = this;
                var formData = new FormData();
                //注意formData里append添加的键的大小写
                //suffix = this.getSuffix(this.uploadName)
                var filename = _self.getOssPolicy.dir + _self.random_string(10) + _self.suffix
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
    handleChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
            this.uploadName = info.file.name //获取组件-文件上传后的文件名
            this.uploadOriginFileObj = info.file.originFileObj
            this.getSuffix(this.uploadName);
      } else if (info.file.status === 'error') {
            this.$message.error('上传失败');
      }
    },
    // 上传报价单PDF文件删除
    handleFileRemove (file) {
        this.uploadSuccess = false;
    },
    //
    uploadPdfSubmit(){
      // if(this.price != null && this.archiveUrl != undefined){
      //   console.log("不为空")
      // }
      this.price = this.companyInfo.price
      this.companyID = this.companyInfo.company_id
      console.log(this.price, "报价")
      console.log(this.archiveUrl, "PDF地址")
      this.$emit('childClose','0',this.price,this.archiveUrl,this.companyID); //向父组件发送关闭弹出框信号,报价的价格,报价单 PDF URL,ID
    },

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
