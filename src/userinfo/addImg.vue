<template>
    <a-spin :spinning="loading">
     <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
       <a-form @submit="addImgSubmit">

        <a-form-item label="图片类型" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select default-value="请选择" style="width: 120px" @change="workImageTypeChange">
             <a-select-option :id="imgtype.id" :value="key" :key="imgtype.name" v-for="(imgtype, key) in ImageType">
                {{imgtype.name}}
             </a-select-option>
          </a-select>
         </a-form-item>
         <a-form-item label="空间" required v-show="typeId == 5" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
           <a-select default-value="请选择" style="width: 120px" @change="spaceChange">
              <a-select-option :id="sc.id" :value="key" :key="sc.name" v-for="(sc, key) in space">
                 {{sc.name}}
              </a-select-option>
           </a-select>
          </a-form-item>
         <a-form-item label="图片" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
           <a-upload action="" list-type="picture-card" @preview="handlePreview" @change="handleChange" accept="image/png, image/jpeg">
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
         </a-form-item>


         <a-form-item label="简介" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
           <a-input v-model="note" placeholder="" />
         </a-form-item>
         <a-form-item label="排序" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
             <a-input-number :min="1" :max="999" @change="Sort" placeholder="输入数字" />
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
    workId:'',
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
      space:[],//空间数据
      ImageType:[],//实例图片类型数据
      note:'', //简介
      SortValue:'', //排序
      uploadExampleImage:'', //图片地址
      typeId:'',//图片类型ID
      typeName:'',//图片类型名称
      spaceId:'',//空间ID
      spaceName:'',//空间名称
    }
  },
  mounted() {
    this.$ajax({  //实例图片类型数据
      url: '/config/workImageType',
      method: 'get',
    }).then(res => {
      this.ImageType= res.data.data;
      console.log(this.ImageType[0].name)
    });

    this.$ajax({  //空间数据
      url: '/config/space',
      method: 'get',
    }).then(res => {
      this.space= res.data.data;
    });

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
    handleChange({ fileList }) {
      this.fileList = fileList;
      this.$ajax({
        url:'/upload/image', //图片上传接口
        method: 'post',
        data:{
          base64_string	:this.fileList[0].thumbUrl
        }
      })
      .then((res)=>{
        this.uploadExampleImage = res.data.data
        console.log(this.uploadExampleImage.url)
        //this.$emit('uploadExampleImage',this.uploadExampleImage.url); //向父组件发送图片地址
      });
    },
    workImageTypeChange(value,id){ //图片类型
      console.log(value)
      console.log(id.data.attrs.id)
      this.typeId = id.data.attrs.id;
      this.typeName = value;
    },
    spaceChange(value,id){ //空间数据
      console.log(value)
      console.log(id.data.attrs.id)
      this.spaceId = id.data.attrs.id;
      this.spaceName = value;
    },
    Sort(value) { //排序
       this.SortValue = value; //排序
    },
    addImgSubmit(){ //提交

      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({  //空间数据
        url: '/designer/workImage',
        method: 'post',
        params:{
          user_token:token,
        },
        data:{
          work_id: this.workId,//实例ID
          url: this.uploadExampleImage.url,//图片地址
          type_id:this.typeId,//图片类型ID
          type_name:this.typeName,//图片类型名称
          space_id:this.spaceId,//空间ID 当type为局部设计图时必传
          space_name:this.spaceName,//空间名称 当type为局部设计图时必传
          note:this.note,//简介
          sort:this.SortValue,//排序
        },
      }).then(res => {
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.$emit('childClose','0'); //向父组件发送关闭弹出框信号
          // this.typeId = null
          // this.typeName = null;
          // this.spaceName = null;
          // this.spaceId = null
          // this.note = null;
          // this.SortValue = null;
          // this.uploadExampleImage.url = null;
          //this.fileList = [];
        }
        console.log(res.data.data)
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
