<template>
  <div class="account-settings-info-view bg-ff wrapper-xl">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
       <a-form layout="vertical">
        <a-form-model layout="vertical" :model="userinfo" :rules="rules" ref="ruleForm">
          <a-form-model-item label="公司名称" required prop="nick_name">
              <a-input placeholder="请输入用户名" v-model="userInfoInfos.company_name" disabled="true" />
          </a-form-model-item>
          <a-form-model-item label="公司简介" required prop="brief">
            <a-textarea rows="4" placeholder="请输入公司简介" v-model="userinfo.brief" />
          </a-form-model-item>
          <a-form-model-item label="承接户型" required prop="shapes">
            <a-select mode="multiple" v-model="stylesArrayData" placeholder="请选择" style="width: 100%" @change="styleId">
              <a-select-option :value="sd.name" v-for="sd of shapesDataNew">
                {{sd.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="服务区域" required prop="areaArray">
            <a-cascader :options="district" v-model="areaArray" placeholder="选择地区" @change="areaChange"
              :field-names="{ label: 'name', value: 'id', children: 'children'}" />
          </a-form-model-item>
          <a-form-model-item label="公司规模" prop="scale" class="w">
              <a-input placeholder="请输入公司规模" class="text-c" addon-after="人" v-model="userinfo.scale" />
          </a-form-model-item>
          <a-form-item label="接单状态" required>
            <a-switch checked-children="接单中" un-checked-children="休息中" :key="is_allow_order" :defaultChecked="is_allow_order" @change="ordersChange" />
          </a-form-item>
          <a-form-model-item label="上传报价单EXCEL" required>
            <a-upload name="file" :multiple="true" action="http://apitesttest.rongzw.com/api/upload/image" @change="handleChange" :remove="handleFileRemove" accept=".xlsx, .xls">
                <a-button> <a-icon type="upload" /> 选择EXCEL文件 </a-button>
            </a-upload>
            <a-button class="m-t" type="primary" icon="cloud-upload" @click="upload()" v-show="uploadOriginFileObj">
               确认上传
            </a-button>
            <a-alert message="文件已上传成功!" type="success" show-icon v-show="uploadSuccess" />
            <p class="m-t-sm" v-show="userinfo.quotation_excel">已上传EXCEL：<a :href="userinfo.quotation_excel" target="_blank" class="font-bold">{{userinfo.quotation_excel}}</a><span class="m-l-lg">（重新上传可覆盖）</span></p>
          </a-form-model-item>
          <a-form-item>
            <a-button size="large" type="primary" htmlType="submit" @click="onSubmit" class="w-full">立即保存</a-button>
          </a-form-item>
        </a-form-model>
       </a-form>
      </a-col>

      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
          action="http://apitesttest.rongzw.com/api/upload/image" :before-upload="beforeUpload" @change="avatarHandleChange" accept="image/png, image/jpeg">
          <img v-if="uploadImage" :src="uploadImage" class="avatar" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              上传头像
            </div>
          </div>
        </a-upload>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  const district = [ //省市县自定义字段名
    {
      id: '',
      name: '',
      children: [{
        id: '',
        name: '',
        children: [{
          id: '',
          name: '',
        }, ],
      }, ],
    }
  ];
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  export default {
    data() {
      //自定义 纯数字 验证正则
      let shuzi=/\d+/;
      const pureNumbers = (rule, value, callback) => {
         if (!shuzi.test(value)) {
            callback(new Error('只能输入数字!'))
         }
         callback()
      };
      return {
        loading: false,
        imageUrl: '',
        userinfo: {},
        userInfoInfos: {},
        is_allow_order: '', //是否接单
        shapes: '', //户型
        stylesArrayData: '',
        shapesData: [], //户型数据
        shapesDataAny:  //户型数据 - 不限
          {
            name:'不限',
          }
        ,
        shapesDataNew:[],//户型数据- 前端添加不限后的数组
        areaArray: [], //省市县ID数组
        preview: {},
        uploadImage: '',
        district,
        option: {
          img: '/avatar2.png',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },

        form:{},
        userinfo:{
            brief: '',
            nick_name: '',
            scale:'',
            shapes:'',
            areaArray:[],
        },
        rules: { //验证规则
            nick_name: [  //昵称
              { required: true, message: '昵称不能为空！', trigger: 'blur' },
              { min: 2, max: 15, message: '字数应该是 2 到 15个字之间', trigger: 'blur' },
            ],
            brief: [  //个人简介
              { required: true, message: '个人简介不能为空！', trigger: 'blur' },
              { min: 2, max: 200, message: '字数应该是 2 到 200个字之间', trigger: 'blur' },
            ],
            scale: [  //公司规模
              { validator: pureNumbers,trigger: 'blur'}
            ],
            shapes: [ //户型
              { required: true, message: '户型不能为空！', trigger: 'change' },
            ],
            areaArray: [  //所在地区
              { required: true, message: '所在地区不能为空！', trigger: 'change' }
            ],
         },
         uploadOriginFileObj:'',
         archiveUrl:'', //压缩包地址
         uploadSuccess:false,
         getOssPolicy:{},
         companyInfo:{},
      }
    },
    mounted() {
      this.$ajax({ //户型数据
        url: '/api/config/shapes',
        method: 'get',
      }).then(res => {
        this.shapesData = res.data.data;
        this.shapesData.push(this.shapesDataAny) //添加到空数组里
        this.shapesDataNew = this.shapesData
        //this.$set(this.shapesData,'name','不限')
        console.log(this.shapesDataNew,"1231")
      });
      this.$ajax({ //地区(省市区)列表 数据
          url: '/api/regions/list',
          method: 'get',
          params: {
            type: 'treeNoKey'
          }
        })
        .then((res) => {
          this.district = res.data.data
        });
      //[Web] 文件上传 前获取令牌
      this.$ajax({
        url:'/api/upload/getOssPolicy',
        method: 'get',
      })
      .then((res)=>{
        this.getOssPolicy = res.data.data
      });
      //获取原始数据
      this.RawData();
    },
    methods: {
      //获取原始数据
      RawData(){
        document.cookies
        var token = this.$cookies.get("token")
        this.$ajax({ //设计师信息获取接口
            url: '/sg/infos',
            method: 'post',
            params: {
              user_token: token
            }
          })
          .then((res) => {
            res.data.data.brief = res.data.data.infos.brief
            res.data.data.styles = res.data.data.infos.styles
            res.data.data.quotation_excel = res.data.data.infos.quotation_excel
            res.data.data.scale = res.data.data.infos.scale
            res.data.data.allow_order_address = res.data.data.infos.allow_order_address
            this.userinfo = res.data.data
            this.userInfoInfos = res.data.data.infos
            //是否接单默认状态获取
            this.is_allow_order = res.data.data.infos.is_allow_order
            if (this.is_allow_order == 10) { //开启
              this.is_allow_order = true;
            }
            if (this.is_allow_order == 20) { //关闭
              this.is_allow_order = false;
            }
            console.log(this.is_allow_order)
            this.is_hideID = res.data.data.infos.is_allow_order //接口获取的默认数据
            //承接户型 数据格式转换
            this.styles = res.data.data.infos.shapes
            var stylesDatt = this.styles;
            var stylesArray = stylesDatt.split(',');
            this.stylesArrayData = stylesArray;
            this.userinfo.shapes = stylesArray;
            this.permission = this.stylesArrayData.join(","); //转化成接口要求格式，提交默认的擅长承接户型
            //服务区域  默认数据
            this.provincial = res.data.data.infos.province_id; //省
            this.city = res.data.data.infos.city_id; //市
            this.region = res.data.data.infos.area_id; //区县
            var areaArray = []; //设置一个空数组
            areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
            this.areaArray = areaArray
            this.userinfo.areaArray = areaArray
            //头像 默认数据
            this.uploadImage = res.data.data.infos.avatar
            this.imageUrl = this.uploadImage
          });
      },
      //保存提交
      onSubmit() { //立即保存 - 提交动作
        this.$refs.ruleForm.validate(valid => {
           if (valid) {
              console.log('验证通过!!');
              this.submitChange(); //验证通过 立即保存
           } else {
              console.log('错误!!');
              return false;
           }
        });
      },
      submitChange(){ //立即保存
        document.cookies
        var token = this.$cookies.get("token")
        this.$ajax({
            url: '/sg/infos',
            method: 'put',
            data: {
              user_token: token,
              brief: this.userinfo.brief, //简介
              province_id: this.provincial, //省ID
              city_id: this.city, //市ID
              area_id: this.region, //区ID
              is_allow_order: this.is_hideID, //是否开启接单
              scale: this.userinfo.scale, //公司规模
              user_image: this.imageUrl, //头像
              shapes: this.permission, //承接户型
              quotation_excel:this.archiveUrl, //报价单 Excel
            }
          })
          .then((res) => {
            if (res.data.code == 1) {
              this.$message.error(res.data.msg);
            }
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.RawData(); //重新获取修改后的原始数据
            }
          });
      },
      styleId(value) {
        this.stylesArrayData = value
        this.userinfo.shapes = value
        this.permission = this.stylesArrayData.join(","); //转化成接口要求格式提交默认的擅长户型数据
      },
      areaChange(value) { //所在地区 省市县
        this.provincial = value[0]; //省
        this.city = value[1]; //市
        this.region = value[2]; //区县
        var areaArray = []; //设置一个空数组
        areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
        this.areaArray = areaArray
        this.userinfo.areaArray = areaArray
        console.log(this.provincial,this.city,this.region)
      },
      ordersChange(checked) { //是否开启接单
        if (checked == true) {
          this.is_hideID = 10 //开启
        }
        if (checked == false) {
          this.is_hideID = 20 //关闭
        }
        console.log(checked)
      },
      //上传头像
      avatarHandleChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, imageUrl => {
            this.imageUrl = imageUrl;
            console.log(this.imageUrl + '240')
            this.loading = false;
            this.$ajax({
                url: '/api/upload/image', //图片上传接口
                method: 'post',
                data: {
                  base64_string: this.imageUrl = imageUrl
                }
              })
              .then((res) => {
                this.imageUrl = res.data.data.url
                this.uploadImage = res.data.data.url
              });

          });
        }
      },
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('您只能上传jpg/jpge/png文件！');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error('图片必须小于10MB！');
        }
        return isJpgOrPng && isLt2M;
      },

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

      //上传报价单excel - 确认上传到阿里云OSS
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
    }
  }
</script>

<style lang="less" scoped>
  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img,
    .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .avatar-uploader {
    padding-left: 100px;
  }

  .avatar {
    width: 120px;
    max-width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar-uploader>.ant-upload {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
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
