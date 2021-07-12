<template>
  <div>
    <div class="m-b-sm">
      <a-breadcrumb>
        <a-breadcrumb-separator>位置：</a-breadcrumb-separator>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to='/userinfo/site'>工地列表</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{exampleSubtitle}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form-model :model="addSite" :rules="rulesExample" ref="ruleExampleForm">
        <a-form-model-item label="所属用户手机号" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="phone">
          <a-input v-model="addSite.phone" placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item label="标题" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="title">
          <a-input v-model="addSite.title" placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item label="负责人" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input v-model="addSite.manager" placeholder="请输入负责人" />
        </a-form-model-item>
        <a-form-model-item label="户型" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="shapesName">
         <a-select :key="shapesName" :default-value="shapesName" v-model="addSite.shapesName" style="width: 120px" @change="shapes">
            <a-select-option :id="shapes.id" :value="key" :key="shapes.name" v-for="(shapes, key) of shapesData">
               {{shapes.name}}
            </a-select-option>
         </a-select>
        </a-form-model-item>
        <a-form-model-item label="封面图" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="thumb_img">
              <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" :fileList="fileList" @preview="handlePreview" @change="handleChange" accept=".jpg,.jpge,.png,.gif" v-model="addSite.thumb_img">
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
        </a-form-model-item>

        <a-form-model-item label="面积" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="area">
          <a-input v-model="addSite.area" placeholder="" suffix="㎡" />
        </a-form-model-item>
         <a-form-model-item label="造价" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="cost">
          <a-input v-model="addSite.cost" placeholder="" suffix="元" />
        </a-form-model-item>
        <a-form-model-item label="所在地区" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="areaArray">
           <a-cascader :options="district" v-model="areaArray" placeholder="选择地区" @change="areaChange" :field-names="{ label: 'name', value: 'id', children: 'children'}" />
        </a-form-model-item>
        <a-form-model-item label="当前施工阶段" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select :key="stageName" :default-value="stageName" v-model="addSite.stageName" style="width: 120px" @change="stage">
             <a-select-option :id="ssl.id" :value="ssl.name" :key="ssl.name" v-for="(ssl, key) of SiteStageList">
                {{ssl.name}}
             </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="排序" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input-number id="Sort" :min="1" :max="999" @change="Sort" placeholder="输入数字" />
        </a-form-model-item>
        <a-form-item label="显示/隐藏" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="显示" un-checked-children="隐藏" :key="is_hide" :defaultChecked="is_hide" @change="ShowHideChange"/>
        </a-form-item>
        <!-- <a-form-item label="置顶" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="是" un-checked-children="否" :key="is_top" :defaultChecked="is_top" @change="topChange"/>
        </a-form-item>
        <a-form-item label="设为推荐" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="是" un-checked-children="否" :key="is_rec" :defaultChecked="is_rec" @change="recommendChange" />
        </a-form-item> -->
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button size="large" htmlType="submit" type="primary" @click="onSubmit">立即提交</a-button>
        </a-form-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
const district = [ //省市县自定义字段名
  {
    id: '',
    name: '',
    children: [
      {
        id: '',
        name: '',
        children: [
          {
            id: '',
            name: '',
          },
        ],
      },
    ],
  }
];
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  data () {
    //自定义 纯数字 验证正则
    let shuzi=/\d+/;
    const pureNumbers = (rule, value, callback) => {
       if (!shuzi.test(value)) {
          callback(new Error('只能输入数字!'))
       }
       callback()
    };
    //自定义 上传 验证
    const uploadValidator = (rule, value, callback) => {
      console.log(this.fileList.length ,"验证")
       // if (this.fileList.length === 0) {
       if (this.fileList.length === '0') {
          callback(new Error('封面图不能为空!'))
          console.log("我是等于0")
       }else{
         console.log("我是不等于0")
         callback();
       }
      callback();
    };

    return {
      // form: this.$form.createForm(this),
       exampleSubtitle:'', //自定义的面包屑标题
       SortValue: 3, //排序
       SiteStageList:[], //设计风格列表
       shapesData:[], //户型列表
       previewVisible: false, //上传封面图
       previewImage: '',
       fileList: [], //上传封面图列表
       previewVrVisible: false, //上传VR封面图
       previewVrImage: '',
       fileListVr: [], //上传VR封面图列表
       areaArray: [], //省市县ID数组

       title:'', //标题
       shapesId:'',//户型ID
       shapesName:'',//户型名
       stageName:'',//目前施工阶段名
       stageId:'',//目前施工阶段ID
       thumb_img:'',//封面图

       area:'',//面积
       cost:'',//花费
       sort:'',//排序
       is_hide:'',//显示/隐藏  0为隐藏 1为显示
       //is_top:'',//置顶 1为置顶 0为否
       //is_rec:'',//设为推荐 1为推荐 0为否
       uploadImage:'' ,//封面图 - 图片地址
       district,
       suffix:'',
       uploadOriginFileObj:'',
       archiveUrl:'', //压缩包地址
       uploadSuccess:false,

       addSite:{
         phone:'',//手机
         title:'', //标题
         shapesName:'',
         area:'',//面积
         cost:'',//花费
         areaArray: [], //省市县ID数组
         thumb_img:'',
       },
       rulesExample: { //验证规则
           phone: [  //手机
             { required: true, message: '手机不能为空！', trigger: 'blur' },
             { min: 11, max: 11, message: '手机号码应该是11位数', trigger: 'blur' },
           ],
           title: [  //标题
             { required: true, message: '标题不能为空！', trigger: 'blur' },
             { min: 1, max: 200, message: '字数应该是 1 到 200个字之间', trigger: 'blur' },
           ],
           shapesName: [ //户型
             { required: true, message: '户型不能为空！', trigger: 'blur' },
           ],
           thumb_img: [  //封面图
             { required: true, message: '封面图不能为空', trigger: 'blur' },
             { validator: uploadValidator, trigger: 'change' },
           ],
           area: [  //面积
             { required: true, message: '面积不能为空！', trigger: 'blur' },
             { validator: pureNumbers,trigger: 'blur'}
           ],
           cost: [  //花费
             { required: true, message: '花费不能为空！', trigger: 'blur' },
             { validator: pureNumbers,trigger: 'blur'}
           ],
           areaArray: [  //所在地区
             { required: true, message: '所在地区不能为空！', trigger: 'blur' }
           ],
        },
    }
  },
  mounted() {
    this.$ajax({ //户型数据
      url: '/api/config/shapes',
      method: 'get',
    }).then(res => {
      this.shapesData= res.data.data;
    });
    this.$ajax({ //施工阶段列表
      url: '/sg/stage/list',
      method: 'get',
    }).then(res => {
      this.SiteStageList= res.data.data;
    });
    this.$ajax({ //地区(省市区)列表 数据
      url:'/api/regions/list',
      method: 'get',
      params:{
        type:'treeNoKey'
      }
    })
    .then((res)=>{
      this.district = res.data.data
    });
    //修改- 获取原始数据
    this.modifyRawData();
  },
  methods: {
    //修改- 获取原始数据
    modifyRawData(){
      var exampleId = this.$route.query.id //修改 - 工地ID
      if (exampleId != undefined){
        this.exampleSubtitle = "修改工地"
        document.cookies
        var token = this.$cookies.get("token")
        this.$ajax({
          url: '/sg/site/' +  this.$route.query.id,
          method: 'get',
          params:{
             user_token:token,
          },
        }).then(res => {
          this.addSite = res.data.data
          res.data.data.phone = res.data.data.user.phone
          //户型
          console.log(res.data.data.shape_id)
          this.shapesId = res.data.data.shape_id
          this.shapesName = res.data.data.shape_name
          this.addSite.shapesName = res.data.data.shape_name
          //施工阶段
          console.log(res.data.data.stage_id)
          this.stageId = res.data.data.stage_id
          this.stageName = res.data.data.stage_name
          this.addSite.stageName = res.data.data.stage_name
          //服务区域  默认数据
          this.provincial = res.data.data.province_id; //省
          this.city = res.data.data.city_id; //市
          this.region = res.data.data.area_id; //区县
          var areaArray = []; //设置一个空数组
          areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
          this.areaArray = areaArray
          this.addSite.areaArray = areaArray
          console.log(this.addSite.areaArray)
          //显示隐藏.默认状态获取
          this.is_hide = res.data.data.is_hide
          if (this.is_hide == 1) { //开启
            this.is_hide = true;
          }
          if (this.is_hide == 0) { //关闭
            this.is_hide = false;
          }
          this.is_hideID = res.data.data.is_hide //提交接口获取的默认数据格式0，1
          //是否置顶.默认状态获取
          // this.is_top = res.data.data.is_top
          // if (this.is_top == 1) { //开启
          //   this.is_top = true;
          // }
          // if (this.is_top == 0) { //关闭
          //   this.is_top = false;
          // }
          // this.is_topID = res.data.data.is_top //提交接口获取的默认数据格式0，1
          // //是否推荐.默认状态获取
          // this.is_rec = res.data.data.is_rec
          // if (this.is_rec == 1) { //开启
          //   this.is_rec = true;
          // }
          // if (this.is_rec == 0) { //关闭
          //   this.is_rec = false;
          // }
          this.is_recommendID = res.data.data.is_rec //提交接口获取的默认数据格式0，1
          //封面图.默认状态获取
          this.thumb_img = res.data.data.thumb_img
          console.log(this.thumb_img)
          //this.fileList[0].url = this.thumb
          this.uploadImage = this.thumb_img
          this.fileList = [
             {
                uid: '-1',
                name: '封面图',
                status: 'done',
                url:this.thumb_img
             }
           ]
          console.log('默认封面图',this.fileList.length)
        });
      } else {
        this.exampleSubtitle = "新增工地"
        this.addSite.shapesName = "请选择";
        this.addSite.stageName = "请选择";
        this.is_hide = true; //显示隐藏
        this.is_hideID = 1; //默认-显示
        // this.is_top = false; //是否置顶
        // this.is_topID = 0; //默认-不置顶
        // this.is_rec = false; //是否推荐
        // this.is_recommendID = 0; //默认-不推荐
      }
    },
    //判断执行新增或修改
    handleSubmit (){
      var exampleId = this.$route.query.id //修改 - 实例ID
      if (exampleId != undefined){
        console.log("我是修改")
        this.modifySubmit();
      }
      else{
        console.log("我是新增")
        this.addSubmit();
      }
    },
    //立即保存 - 提交动作
    onSubmit() {
      console.log('提交动作!!');
      this.$refs.ruleExampleForm.validate(valid => {
         if (valid) {
            console.log('验证通过!!');
            this.handleSubmit(); //验证通过 判断执行新增或修改
         } else {
            console.log('错误!!');
            return false;
         }
      });
    },
    // 新增提交
    addSubmit () {
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url: '/sg/site',
        method: 'post',
        params:{
           user_token:token,
        },
        data:{
          phone:this.addSite.phone,//用户手机号
          title:this.addSite.title, //工地标题
          shape_id:this.shapesId, //户型ID
          shape_name:this.shapesName, //户型名
          manager:this.addSite.manager,//工地负责人
          stage_id:this.stageId,//目前施工阶段ID
          stage_name:this.stageName,//目前施工阶段名
          thumb_img:this.uploadImage, //封面图
          area:this.addSite.area, //面积
          cost:this.addSite.cost, //花费
          sort:this.SortValue, //排序
          is_hide:this.is_hideID, //显示隐藏
          //is_top:this.is_topID, //是否置顶
          //is_rec:this.is_recommendID, //是否推荐
          province_id:this.provincial, //省ID
          city_id:this.city, //市ID
          area_id:this.region, //区ID
        }
      }).then(res => {
        this.addSite = res.data.data
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.$router.push({
             name: "site"
          })
        }
      });
    },
    // 修改提交
    modifySubmit () {
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url: '/sg/site/' +  this.$route.query.id,
        method: 'put',
        params:{
           user_token:token,
        },
        data:{
          phone:this.addSite.phone,//用户手机号
          title:this.addSite.title, //工地标题
          shape_id:this.shapesId, //户型ID
          shape_name:this.shapesName, //户型名
          manager:this.addSite.manager,//工地负责人
          stage_id:this.stageId,//目前施工阶段ID
          stage_name:this.stageName,//目前施工阶段名
          thumb_img:this.uploadImage, //封面图
          area:this.addSite.area, //面积
          cost:this.addSite.cost, //花费
          sort:this.SortValue, //排序
          is_hide:this.is_hideID, //显示隐藏
          //is_top:this.is_topID, //是否置顶
          //is_rec:this.is_recommendID, //是否推荐
          province_id:this.provincial, //省ID
          city_id:this.city, //市ID
          area_id:this.region, //区ID
        }
      }).then(res => {
        this.addSite = res.data.data
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.modifyRawData(); //重新获取修改后的数据
        }
        // this.$router.push({
        //    name: "example"
        // })
      });
    },

    shapes(value,id){
      this.shapesName = value; //获取户型名
      this.shapesId = id.data.attrs.id; //获取户型ID
    },
    stage(value,id){
      this.stageName = value; //获取目前施工阶段名
      this.stageId = id.data.attrs.id; //获取	目前施工阶段ID
      console.log(this.stageId)
      console.log(this.stageName,'名字')
    },

    //上传封面图
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
      // console.log("11111111111111111")
      this.fileList = fileList;
      console.log(this.fileList.length)
      this.addSite.thumb = this.fileList.length
      this.$ajax({
        url:'/api/upload/image', //图片上传接口
        method: 'post',
        data:{
          base64_string	:this.fileList[0].thumbUrl
        }
      })
      .then((res)=>{
        this.uploadImage = res.data.data.url
        console.log(this.uploadImage)
      });
    },

    Sort(value) { //排序
       this.SortValue = value; //排序
       this.addSite.sort = value;
    },
    ShowHideChange(checked) {  //显示隐藏
       if(checked == true){
         this.is_hideID = 1
       }
       if(checked == false){
         this.is_hideID = 0
       }
       console.log('显示隐藏',checked);
    },
    // topChange(checked) {  //置顶
    //    if(checked == true){
    //      this.is_topID = 1
    //    }
    //    if(checked == false){
    //      this.is_topID = 0
    //    }
    //    console.log('置顶',checked);
    // },
    // recommendChange(checked) {  //设为推荐
    //    if(checked == true){
    //      this.is_recommendID = 1
    //    }
    //    if(checked == false){
    //      this.is_recommendID = 0
    //    }
    //    console.log('设为推荐',checked);
    // },
    areaChange(value) { //所在地区 省市县
      this.provincial = value[0]; //省
      this.city = value[1]; //市
      this.region = value[2]; //区县
      var areaArray = []; //设置一个空数组
      areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
      this.areaArray = areaArray
      this.addSite.areaArray = areaArray
      console.log(this.addSite.areaArray)
    },

  }
}
</script>

<style scoped>
/* tile uploaded pictures */
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline >>> .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline >>> .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
