<template>
  <div class="account-settings-info-view bg-ff wrapper-xl">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
       <a-form layout="vertical">
        <a-form-model layout="vertical" :model="userinfo" :rules="rules" ref="ruleForm">
          <a-form-model-item label="昵称" prop="nick_name">
              <a-input placeholder="请输入昵称" v-model="userinfo.nick_name" />
          </a-form-model-item>
          <a-form-model-item label="个人简介" prop="brief">
            <a-textarea rows="4" placeholder="请输入个人简介" v-model="userinfo.brief" />
          </a-form-model-item>
          <a-form-model-item label="擅长风格" prop="styles">
            <a-select mode="multiple" v-model="stylesArrayData" placeholder="请选择" style="width: 100%" @change="styleId">
              <a-select-option :value="sd.name" v-for="sd of styleData">
                {{sd.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="服务区域" prop="areaArray">
            <a-cascader :options="district" v-model="areaArray" placeholder="选择地区" @change="areaChange"
              :field-names="{ label: 'name', value: 'id', children: 'children'}" />
          </a-form-model-item>
          <a-form-item label="接单状态">
            <a-switch checked-children="接单中" un-checked-children="休息中" :key="is_allow_order" :defaultChecked="is_allow_order" @change="ordersChange" />
          </a-form-item>

          <a-form-item>
            <a-button size="large" type="primary" htmlType="submit" @click="onSubmit" class="w-full">立即保存</a-button>
          </a-form-item>
        </a-form-model>
       </a-form>
      </a-col>

      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
          action="" :before-upload="beforeUpload" @change="handleChange" accept="image/png, image/jpeg">
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
      return {
        loading: false,
        imageUrl: '',
        userinfo: {},
        //userInfoInfos: [],
        is_allow_order: '', //是否接单
        styles: '', //设计风格
        stylesArrayData: '',
        styleData: [], //设计风格列表
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
            styles:'',
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
            styles: [ //设计风格
              { required: true, message: '设计风格不能为空！', trigger: 'change' },
            ],
            areaArray: [  //所在地区
              { required: true, message: '所在地区不能为空！', trigger: 'change' }
            ],
         },
      }
    },
    mounted() {
      this.$ajax({ //设计风格数据
        url: '/api/config/style',
        method: 'get',
      }).then(res => {
        this.styleData = res.data.data;
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
      //获取原始数据
      this.RawData();
    },
    methods: {
      //获取原始数据
      RawData(){
        document.cookies
        var token = this.$cookies.get("token")
        this.$ajax({ //设计师信息获取接口
            url: '/designer/infos',
            method: 'post',
            params: {
              user_token: token
            }
          })
          .then((res) => {
            res.data.data.brief = res.data.data.infos.brief
            res.data.data.styles = res.data.data.infos.styles
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
            //擅长风格 数据格式转换
            this.styles = res.data.data.infos.styles
            var stylesDatt = this.styles;
            var stylesArray = stylesDatt.split(',');
            this.stylesArrayData = stylesArray;
            this.userinfo.styles = stylesArray;
            this.permission = this.stylesArrayData.join(","); //转化成接口要求格式，提交默认的擅长风格数据
            //服务区域  默认数据
            this.provincial = res.data.data.infos.province_id; //省
            this.city = res.data.data.infos.city_id; //市
            this.region = res.data.data.infos.area_id; //区县
            var areaArray = []; //设置一个空数组
            areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
            this.areaArray = areaArray
            this.userinfo.areaArray = areaArray
            //头像 默认数据
            this.uploadImage = res.data.data.user_image
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
            url: '/designer/infos',
            method: 'put',
            data: {
              user_token: token,
              nick_name: this.userinfo.nick_name, //昵称
              brief: this.userinfo.brief, //简介
              province_id: this.provincial, //省ID
              city_id: this.city, //市ID
              area_id: this.region, //区ID
              is_allow_order: this.is_hideID, //是否开启接单
              user_image: this.imageUrl, //头像
              styles: this.permission, //擅长风格
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
        this.userinfo.styles = value
        this.permission = this.stylesArrayData.join(","); //转化成接口要求格式提交默认的擅长风格数据
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
      handleChange(info) {
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
