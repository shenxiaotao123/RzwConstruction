<template>
  <div>
    <div class="m-b-sm">
      <a-breadcrumb>
        <a-breadcrumb-separator>位置：</a-breadcrumb-separator>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to='/userinfo/example'>实例列表</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{exampleSubtitle}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form-model :model="addwork" :rules="rulesExample" ref="ruleExampleForm">
        <a-form-model-item label="标题"  has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="title">
          <a-input v-model="addwork.title" placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item label="设计风格" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="styleName">
          <a-select :key="styleName" :default-value="styleName" v-model="addwork.styleName" style="width:120px" @change="style">
             <a-select-option :id="sd.id" :value="key" :key="sd.name" v-for="(sd, key) of styleData">
                {{sd.name}}
             </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="户型" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="shapesName">
         <a-select :key="shapesName" :default-value="shapesName" v-model="addwork.shapesName" style="width: 120px" @change="shapes">
            <a-select-option :id="shapes.id" :value="key" :key="shapes.name" v-for="(shapes, key) of shapesData">
               {{shapes.name}}
            </a-select-option>
         </a-select>
        </a-form-model-item>
        <a-form-model-item label="设计理念" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="brief">
          <a-input v-model="addwork.brief" placeholder="" />
        </a-form-model-item>
        <a-form-model-item label="封面图" has-feedback required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="thumb">
              <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" :fileList="fileList" @preview="handlePreview" @change="handleChange" accept=".jpg,.jpge,.png,.gif" v-model="addwork.thumb">
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
        <a-form-item label="视频" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-upload action="http://apitesttest.rongzw.com/api/upload/image" name="file" :multiple="true" @change="handleChangeVideo" :remove="handleFileRemove" accept="mp4">
             <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
          <a-button class="m-t" type="primary" icon="cloud-upload" @click="upload()" v-show="uploadOriginFileObj">
             确认上传
          </a-button>
          <a-alert message="文件已上传成功!" type="success" show-icon v-show="uploadSuccess" />
          <p v-show="addwork.video">已上传： {{addwork.video}}（重新上传可覆盖）</p>
        </a-form-item>
        <a-form-item label="vr地址" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input v-model="addwork.vr_url" placeholder="" />
        </a-form-item>
        <a-form-item label="vr封面图" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <div class="clearfix">
              <a-upload action="http://apitesttest.rongzw.com/api/upload/image" list-type="picture-card" :fileList="fileListVr" @preview="handleVrPreview" @change="handleVrChange" accept=".jpg,.jpge,.png,.gif">
                <div v-if="fileListVr.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    选择图片
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVrVisible" :footer="null" @cancel="handleVrCancel">
                <img alt="example" style="width: 100%" :src="previewVrImage" />
              </a-modal>
          </div>
        </a-form-item>
        <a-form-model-item label="面积" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="area">
          <a-input v-model="addwork.area" placeholder="" suffix="㎡" />
        </a-form-model-item>
         <a-form-model-item label="花费" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="cost">
          <a-input v-model="addwork.cost" placeholder="" suffix="元" />
        </a-form-model-item>
        <a-form-model-item label="设计年份" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="year">
          <a-input-number id="DesignYear" v-model="addwork.year" :min="2000" :max="2100" placeholder="2021" @change="DesignYear" />
        </a-form-model-item>
        <a-form-model-item label="所在地区" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="areaArray">
           <a-cascader :options="district" v-model="areaArray" placeholder="选择地区" @change="areaChange" :field-names="{ label: 'name', value: 'id', children: 'children'}" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" required :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }" prop="address">
          <a-input v-model="addwork.address" placeholder="" />
        </a-form-model-item>
        <a-form-model-item label="排序" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input-number id="Sort" :min="1" :max="999" @change="Sort" placeholder="输入数字" />
        </a-form-model-item>
        <a-form-item label="显示/隐藏" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="显示" un-checked-children="隐藏" :key="is_hide" :defaultChecked="is_hide" @change="ShowHideChange"/>
        </a-form-item>
        <a-form-item label="置顶" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="是" un-checked-children="否" :key="is_top" :defaultChecked="is_top" @change="topChange"/>
        </a-form-item>
        <a-form-item label="设为推荐" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-switch checked-children="是" un-checked-children="否" :key="is_rec" :defaultChecked="is_rec" @change="recommendChange" />
        </a-form-item>
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
       styleData:[], //设计风格列表
       shapesData:[], //户型列表
       previewVisible: false, //上传封面图
       previewImage: '',
       fileList: [], //上传封面图列表
       previewVrVisible: false, //上传VR封面图
       previewVrImage: '',
       fileListVr: [], //上传VR封面图列表
       areaArray: [], //省市县ID数组

       title:'', //标题
       styleId:'',//设计风格ID
       styleName:'',//设计风格名
       shapesId:'',//户型ID
       shapesName:'',//户型名
       brief:'',//设计理念
       thumb:'',//封面图
       video:'',//视频地址
       vr_url:'',//vr地址
       vr_thumb:'',//vr封面图
       area:'',//面积
       cost:'',//花费
       year:2021,//设计年份
       address:'',//详细地址
       sort:'',//排序
       is_hide:'',//显示/隐藏  0为隐藏 1为显示
       is_top:'',//置顶 1为置顶 0为否
       is_rec:'',//设为推荐 1为推荐 0为否
       uploadImage:'' ,//封面图 - 图片地址
       district,
       suffix:'',
       uploadOriginFileObj:'',
       archiveUrl:'', //压缩包地址
       uploadSuccess:false,

       addwork:{
         title:'', //标题
         styleName:'',
         shapesName:'',
         brief:'',//设计理念
         area:'',//面积
         cost:'',//花费
         year:2021,//设计年份
         areaArray: [], //省市县ID数组
         address:'',//详细地址
         thumb:'',
       },
       rulesExample: { //验证规则
           title: [  //标题
             { required: true, message: '标题不能为空！', trigger: 'blur' },
             { min: 1, max: 200, message: '字数应该是 1 到 200个字之间', trigger: 'blur' },
           ],
           styleName: [  //设计风格
             { required: true, message: '设计风格不能为空！', trigger: 'blur' },
           ],
           shapesName: [ //户型
             { required: true, message: '户型不能为空！', trigger: 'blur' },
           ],
           brief: [  //设计理念
             { required: true, message: '设计理念不能为空！', trigger: 'blur' },
             { min: 1, max: 200, message: '字数应该是 1 到 200个字之间', trigger: 'blur' },
           ],
           thumb: [  //封面图
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
           year: [  //设计年份
             { required: true, message: '设计年份不能为空！', trigger: 'change' },
           ],
           areaArray: [  //所在地区
             { required: true, message: '所在地区不能为空！', trigger: 'blur' }
           ],
           address:[  //详细地址
             { required: true, message: '详细地址不能为空！', trigger: 'blur' },
             { min: 1, max: 10, message: '字数应该是 1 到 100个字之间', trigger: 'blur' },
           ],
        },
    }
  },
  mounted() {
    this.$ajax({ //设计风格数据
      url: '/api/config/style',
      method: 'get',
    }).then(res => {
      this.styleData= res.data.data;
    });
    this.$ajax({ //户型数据
      url: '/api/config/shapes',
      method: 'get',
    }).then(res => {
      this.shapesData= res.data.data;
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
    //修改- 获取原始数据
    modifyRawData(){
      var exampleId = this.$route.query.id //修改 - 实例ID
      if (exampleId != undefined){
        this.exampleSubtitle = "修改实例"
        document.cookies
        var token = this.$cookies.get("token")
        this.$ajax({
          url: '/designer/work/' +  this.$route.query.id,
          method: 'get',
          params:{
             user_token:token,
          },
        }).then(res => {
          this.addwork = res.data.data
          //设计风格
          this.styleId = res.data.data.style_id
          this.styleName = res.data.data.style_name
          this.addwork.styleName = res.data.data.style_name
          //户型
          console.log(res.data.data.shape_id)
          this.shapesId = res.data.data.shape_id
          this.shapesName = res.data.data.shape_name
          this.addwork.shapesName = res.data.data.shape_name
          //服务区域  默认数据
          this.provincial = res.data.data.province_id; //省
          this.city = res.data.data.city_id; //市
          this.region = res.data.data.area_id; //区县
          var areaArray = []; //设置一个空数组
          areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
          this.areaArray = areaArray
          this.addwork.areaArray = areaArray
          console.log(this.addwork.areaArray)
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
          this.is_top = res.data.data.is_top
          if (this.is_top == 1) { //开启
            this.is_top = true;
          }
          if (this.is_top == 0) { //关闭
            this.is_top = false;
          }
          this.is_topID = res.data.data.is_top //提交接口获取的默认数据格式0，1
          //是否推荐.默认状态获取
          this.is_rec = res.data.data.is_rec
          if (this.is_rec == 1) { //开启
            this.is_rec = true;
          }
          if (this.is_rec == 0) { //关闭
            this.is_rec = false;
          }
          this.is_recommendID = res.data.data.is_rec //提交接口获取的默认数据格式0，1
          //封面图.默认状态获取
          this.thumb = res.data.data.thumb
          console.log(this.thumb)
          //this.fileList[0].url = this.thumb
          this.uploadImage = this.thumb
          this.fileList = [
             {
                uid: '-1',
                name: '封面图',
                status: 'done',
                url:this.thumb
             }
           ]
          //封面图.默认状态获取
          this.vr_thumb = res.data.data.vr_thumb
          if(this.vr_thumb) {
            this.fileListVr= [
               {
                  uid: '-2',
                  name: 'VR封面图',
                  status: 'done',
                  url: this.vr_thumb
               }
             ]
           }
        });
      } else {
        this.exampleSubtitle = "新增实例"
        this.addwork.style_name = "请选择";
        this.addwork.shape_name = "请选择";
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
        url: '/designer/work',
        method: 'post',
        params:{
           user_token:token,
        },
        data:{
          title:this.addwork.title, //标题
          style_id:this.styleId, //设计风格ID
          style_name:this.styleName, //设计风格名
          shape_id:this.shapesId, //户型ID
          shape_name:this.shapesName, //户型名
          brief:this.addwork.brief, //设计理念
          thumb:this.uploadImage, //封面图
          video:this.archiveUrl,//视频地址
          vr_url:this.addwork.vr_url, //vr地址
          vr_thumb:this.uploadVrImage, //vr地址封面
          area:this.addwork.area, //面积
          cost:this.addwork.cost, //花费
          year:this.addwork.year, //设计年份
          address:this.addwork.address, //详细地址
          sort:this.SortValue, //排序
          is_hide:this.is_hideID, //显示隐藏
          is_top:this.is_topID, //是否置顶
          is_rec:this.is_recommendID, //是否推荐
          province_id:this.provincial, //省ID
          city_id:this.city, //市ID
          area_id:this.region, //区ID
        }
      }).then(res => {
        this.addwork = res.data.data
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
          this.$router.push({
             name: "example"
          })
        }
      });
    },
    // 修改提交
    modifySubmit () {
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url: '/designer/work/' +  this.$route.query.id,
        method: 'put',
        params:{
           user_token:token,
        },
        data:{
          title:this.addwork.title, //标题
          style_id:this.styleId, //设计风格ID
          style_name:this.styleName, //设计风格名
          shape_id:this.shapesId, //户型ID
          shape_name:this.shapesName, //户型名
          brief:this.addwork.brief, //设计理念
          thumb:this.uploadImage, //封面图
          video:this.archiveUrl,//视频地址
          vr_url:this.addwork.vr_url, //vr地址
          vr_thumb:this.uploadVrImage, //vr地址封面
          area:this.addwork.area, //面积
          cost:this.addwork.cost, //花费
          year:this.addwork.year, //设计年份
          address:this.addwork.address, //详细地址
          sort:this.SortValue, //排序
          is_hide:this.is_hideID, //显示隐藏
          is_top:this.is_topID, //是否置顶
          is_rec:this.is_recommendID, //是否推荐
          province_id:this.provincial, //省ID
          city_id:this.city, //市ID
          area_id:this.region, //区ID
        }
      }).then(res => {
        this.addwork = res.data.data
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

    style(value,id){
      this.styleName = value; //获取设计风格名
      this.styleId = id.data.attrs.id; //获取设计风格ID
    },
    shapes(value,id){
      this.shapesName = value; //获取户型名
      this.shapesId = id.data.attrs.id; //获取户型ID
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
      this.addwork.thumb = this.fileList.length
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
    //上传VR封面图
    handleVrCancel() {
      this.previewVrVisible = false;
    },
    async handleVrPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewVrImage = file.url || file.preview;
      this.previewVrVisible = true;
      console.log(file.url)
      console.log(file.preview)
    },
    handleVrChange({ fileList }) {
      console.log("2")
      this.fileListVr = fileList;
      this.$ajax({
        url:'/api/upload/image', //图片上传接口
        method: 'post',
        data:{
          base64_string	:this.fileListVr[0].thumbUrl
        }
      })
      .then((res)=>{
        this.uploadVrImage = res.data.data.url
        console.log(this.uploadVrImage)
      });
    },
    Sort(value) { //排序
       this.SortValue = value; //排序
       this.addwork.sort = value;
    },
    DesignYear(value) { //设计年份
       //console.log('changed', value);
    },
    ShowHideChange(checked) {  //显示隐藏
       if(checked == true){
         this.is_hideID = 1
       }
       if(checked == false){
         this.is_hideID = 0
       }

    },
    topChange(checked) {  //置顶
       if(checked == true){
         this.is_topID = 1
       }
       if(checked == false){
         this.is_topID = 0
       }
    },
    recommendChange(checked) {  //设为推荐
       if(checked == true){
         this.is_recommendID = 1
       }
       if(checked == false){
         this.is_recommendID = 0
       }
    },
    areaChange(value) { //所在地区 省市县
      this.provincial = value[0]; //省
      this.city = value[1]; //市
      this.region = value[2]; //区县
      var areaArray = []; //设置一个空数组
      areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
      this.areaArray = areaArray
      this.addwork.areaArray = areaArray
      console.log(this.addwork.areaArray)
    },
    //视频上传
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

    handleChangeVideo(info) {
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
    // 上传视频文件删除
      handleFileRemove (file) {
          this.uploadSuccess = false;
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
