<template>
          <a-form-item class="user-layout-login" id="formLogin" ref="formLogin" form="form" @submit="onSubmit">
              <div class="loginWrap">
                <h2>荣装网劳务公司端</h2>
                <div class="loginWrapCon">
                  <h4>欢迎登录</h4>

               <a-input size="large" v-model="sms.phone" class="m-b-sm" type="tel"  placeholder="手机号码" maxlength="11"  v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '手机号' }], validateTrigger: 'change'}]">
                 <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
               </a-input>
               <a-row :gutter="16" class="m-t-lg">
                 <a-col class="gutter-row" :span="16">
                   <a-form-item>
                     <a-input size="large" v-model="sms.tel_code" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码！' }], validateTrigger: 'blur'}]">
                       <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                     </a-input>
                   </a-form-item>
                 </a-col>
               <a-col class="gutter-row" :span="8">
                 <a-button class="getCaptcha" tabindex="-1" :disabled="state.smsSendBtn" @click.stop.prevent="getCaptcha"
                   v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
               </a-col>
               </a-row>

               <div class="m-t-md">
                 <a-button size="large" type="primary" htmlType="submit" class="w-full" @click="onSubmit">登录</a-button>
               </div>
               </div>
             </div>
          </a-form-item>

</template>

<script>
  export default {
      name: "login",
      data() {
        return {
          sms:{
            phone:'',
            tel_code:'',
            type:'sms'
          },
          form: this.$form.createForm(this),
          state: {
            time: 60,
            loginBtn: false,
            // login type: 0 email, 1 username, 2 telephone
            loginType: 0,
            smsSendBtn: false
          },
           showRentPrise:false
        }
      },
      components: {
      },
      mounted () {
        document.cookies
        var token = this.$cookies.get("token")
        console.log(token +"已登录");
        this.tokenData = token
        if(token !== 'null'){
           //this.$router.push({path:'/'})
        }
      },
      methods: {

        onSubmit() {
                var formData= { // 这里才是你的表单数据
                  'phone' : this.sms.phone,
                  'tel_code' : this.sms.tel_code,
                  'type': 'sms',
                  'port': 'pc',
                };
                this.$ajax({
                  url:'sg/login',
                  method: 'post',
                  params:formData
                })
                .then((res)=>{
                    var codedata = res.data.code;
                    //var nick_name = res.data.nick_name
                    if(codedata == 0){
                        // 延迟 1 秒显示欢迎信息
                        setTimeout(() => {
                          this.$notification.success({
                            message: '登录成功！欢迎',
                            description: `欢迎回来`
                          })
                        }, 1000)
                      console.log(res.data);
                      console.log(res.data.data.token + '我token');
                      this.$cookies.isKey('token')
                      this.$cookies.set('token', res.data.data.token,60*60*24*30)
                      this.$cookies.set('nick_name', res.data.data.nick_name,60*60*24*30)
                      this.$cookies.set('user_image', res.data.data.user_image,60*60*24*30)
                      // document.cookie
                      // var realname = this.$cookies.get("real_name")
                      // this.realnameData = realname
                      this.$router.push({path:'/'})
                      location.reload(); //刷新页面
                      console.log("登录成功");
                    }
                    if(codedata == 1){
                      console.log("错了");
                      this.$message.error(res.data.msg);
                    }
                });
        },

        getCaptcha (e) {  // 获取验证码
                e.preventDefault()
                const { form: { validateFields }, state } = this
                validateFields(['mobile'], { force: true }, (err, values) => {
                  if (!err) {
                    state.smsSendBtn = true
                    const interval = window.setInterval(() => {
                      if (state.time-- <= 0) {
                        state.time = 60
                        state.smsSendBtn = false
                        window.clearInterval(interval)
                      }
                    }, 1000)
                    var getTelCodeData= { // 这里才是你的表单数据
                      'phone' : this.sms.phone,
                      'type': 'login'
                    };
                    //const hide = this.$message.loading('验证码发送中..', 0)
                    console.log("接口前");
                    this.$ajax({  //获取短信验证码接口
                      url:'sg/getTelCode',
                      method: 'post',
                      params:getTelCodeData
                    }).then((res)=>{
                      console.log("接口中");
                        console.log(res.data.code);
                        var codedata = res.data.code
                        if(codedata == 0){
                          console.log("验证码成功了");
                          this.$message.success(res.data.msg);
                        }
                        if(codedata == 1){
                          console.log(res.data.msg);
                          this.$message.error(res.data.msg);
                        }

                    })
                    .catch(err => {
                      // setTimeout(hide, 1)
                      // clearInterval(interval)
                      // state.time = 60
                      // state.smsSendBtn = false
                      // this.requestFailed(err)
                    })
                  }
                })
              },
      }

  }
</script>

<style lang="less" scoped>
  .user-layout-login {
    position: absolute; left: 0; top: 0;
    width: 100%; height: 100%; background:#F7F7F7 url(../assets/img/login/bg.png);
    label {
      font-size: 14px;
    }
    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }
    .forge-password {
      font-size: 14px;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }
    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
.loginWrap { position: relative; margin: 150px auto 0 auto; padding-left: 345px; width: 800px; background:#FF6260 url(../assets/img/login/img.png) no-repeat left bottom; background-size: 345px ;
  h2 { position: absolute; left: 0; top: 50px; width: 345px; text-align: center; color:#fff; font-size: 28px;}
  .loginWrapCon { padding: 80px 60px 100px 60px; background-color: #fff;}
   h4 { margin-bottom: 30px; font-size: 28px;}
}

</style>
