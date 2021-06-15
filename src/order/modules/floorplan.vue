<template>
    <a-spin :spinning="loading">
     <div class="clearfix">
         <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" @preview="handlePreview" @change="handleChange" accept="image/png, image/jpeg">
           <div v-if="fileList.length < 1">
             <a-icon type="plus" />
             <div class="ant-upload-text">
               选择图片
             </div>
           </div>
         </a-upload>
         <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
           <img alt="example" style="width: 100%" :src="previewImage" />
         </a-modal>
       </div>
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
    }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      console.log('没上传')
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
      console.log(file.preview , '没上传')

    },
    handleChange({ fileList }) {
      this.fileList = fileList;
      // console.log(fileList)
      // console.log(JSON.stringify(fileList[0]), "字符串");
      // console.log(fileList[0], '拿到第一条')
      // console.log(fileList[0].size)
      // console.log(fileList[0].thumbUrl , '拿到base64')
      if (fileList[0].thumbUrl =="" || fileList[0].thumbUrl == "undefind") {
        return false;
      }
      //this.$emit('uploadImageUrl',); //向父组件发送图片地址

      this.$ajax({
        url:'/api/upload/image', //图片上传接口
        method: 'post',
        data:{
          base64_string	:this.fileList[0].thumbUrl
        }
      })
      .then((res)=>{
        this.uploadImage = res.data.data
        console.log(this.uploadImage.url)
        this.$emit('uploadImageUrl',this.uploadImage.url); //向父组件发送图片地址
      });
    },
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
</style>
