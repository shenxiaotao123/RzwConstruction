<template>

    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class="order_form">
        <div class="text-r m-b-sm"> <router-link to="/order/list">返回订单列表</router-link></div>
        <a-row>
          <a-col :span="12">
            <h3>订单信息</h3>
            <a-form-item label="订单编号" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetails.order_no}}
            </a-form-item>
            <a-form-item label="订单阶段" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsStage.name}}
            </a-form-item>
            <a-form-item label="订单金额" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetails.total_fee}}元
            </a-form-item>
            <a-form-item label="创建时间" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetails.created_at}}
            </a-form-item>
            <a-form-item label="订单类型" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <span v-if="orderDetails.is_merge == 0">施工订单</span>
              <a v-if="orderDetails.is_merge == 1" @click="setModalRelated()">设计&amp;施工订单（点击查看）</a>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <h3>房屋信息</h3>
            <a-form-item label="所在地区" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.address}}
            </a-form-item>
            <a-form-item label="详细地址" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.detail_address}}
            </a-form-item>
            <a-form-item label="房屋户型" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.house_type}}
            </a-form-item>
            <a-form-item label="房屋现状" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.house_status}}
            </a-form-item>
            <a-form-item label="房屋类型" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.house_type}}
            </a-form-item>
            <a-form-item label="房屋面积" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.area	}}m²
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider />
        <a-row>
          <a-col :span="12">
            <h3>客户信息</h3>
            <a-form-item label="用户姓名" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.user_name}}
            </a-form-item>
            <a-form-item label="联系方式" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.user_tel}}
            </a-form-item>
            <a-form-item label="邮箱" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.user_mail}}
            </a-form-item>
            <a-form-item label="收货地址" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.shipping_address}}
            </a-form-item>
            <!-- <a-form-item label="购房证明" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <img style="width: 80px; height: 80px;" :src="orderDetailsHouse.pic" alt="">
            </a-form-item>
            <a-form-item label="装修要求" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.demand}}
            </a-form-item> -->
          </a-col>
          <a-col :span="12">
            <h3>附件</h3>
            <a-form-item label="劳务合同" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <span v-if="getOrderImages.url == null">劳务合同还未上传</span>
              <span v-if="getOrderImages.url != null">
                <a :href="getOrderImages.url" target="_blank">{{getOrderImages.url}}</a>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="m-t-lg text-c">
          <span v-if="orderDetails.order_stage_id === 3">
            <a-button type="primary" size="large" @click="setModal2Visible(true)">上传劳务合同</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 4">
            <a-button type="primary" size="large" @click="hydropower">确认水电完成</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 6">
            <a-button type="primary" size="large" @click="woodworking">确认泥工木工完成</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 8">
            <a-button type="primary" size="large" @click="paint">确认油漆完成</a-button>
          </span>

        </div>


        <!-- 关联设计订单详情 -->
        <a-modal title="关联设计订单详情" :width="840" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
          <relatedOrders :orderId="orderId" :tokenData="tokenData" />
        </a-modal>

        <!-- 上传施工图 -->
        <a-modal title="上传劳务合同" :width="840" :visible="modal2Visible" @ok="postUploadImageUrl" @cancel="() => setModal2Visible(false)">
          <construction v-on:uploadImageUrl="getUploadImageUrl" />
        </a-modal>

    </a-card>

</template>

<script>
import relatedOrders from './modules/relatedOrders' //关联施工订单详情
import construction from './modules/construction' //上传施工图

export default {
  name: 'order_details',
  data () {
    return {
      orderDetails:[],
      orderDetailsStage:[],
      orderDetailsHouse:[],
      getOrderImages:[],
      recordID:'', //确认房屋信息及订单金额 订单ID
      visible: false,//对话框是否可见
      modal1Visible: false,//对话框是否可见
      modal2Visible: false,
      modal3Visible: false,
      confirmLoading: false,
      confirmOrderhouse:{}, //确认房屋信息及订单金额 数据1
      confirmOrder:{}, //确认房屋信息及订单金额数据2
      orderId:'',
      tokenData:'',
      //form: this.$form.createForm(this),
    }
  },
  components: {
    relatedOrders,
    construction
  },
  mounted () {
    this.recordID = this.$route.query.id
    this.orderDetailsCancel()
    document.cookies
    var token = this.$cookies.get("token")
    this.$ajax({
      url:'/sg/order/getContract', //获取订单图纸信息
      method: 'get',
      params:{
        user_token:token,
        order_id:this.$route.query.id //订单列表传值过来的订单ID
      }
    })
    .then((res)=>{
      this.getOrderImages = res.data.data
    });
  },
  methods: {
    setModalRelated() { //关联设计订单详情 - 弹出框、子组件传参
         this.visible = true;
         this.orderId = this.$route.query.id; //订单ID
         document.cookies
         this.tokenData = this.$cookies.get("token")
         console.log(this.tokenData)
         //this.tokenData;
         // if(modalRelated == true){
         //   this.getDesignFee();
         // }
    },
    orderDetailsCancel(){ //订单详情接口
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url:'/sg/orderList/' + this.$route.query.id, //订单详情
        method: 'get',
        params:{
          user_token:token
        }
      })
      .then((res)=>{
        this.orderDetails = res.data.data
        this.orderDetailsStage = res.data.data.sg_stage
        this.orderDetailsHouse = res.data.data.house
      });
    },
    setModal2Visible(modal2Visible,record) { //上传劳务合同 - 弹出框
          this.modal2Visible = modal2Visible;
          this.recordID; //订单ID
          // this.tokenData;
    },
    getUploadImageUrl(data){ //上传劳务合同 文件地址 子组件向父组件传值
       this.uploadImageUrl = data;
    },
    postUploadImageUrl(data){ //上传劳务合同 “确定” 回调事件
      this.modal2Visible = false;
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({url:'/sg/order/uploadContract', //提交上传劳务合同
       method: 'post',
       params:{
          user_token: token,
          order_id: this.recordID,
        },
        data:{
          sg_contract_zip:this.uploadImageUrl,
        }
      })
      .then((res)=>{
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
        }
        this.getOrderList(); //订单列表请求接口部分
      });
    },
    hydropower(record){ //确认水电施工
      let self = this;
      this.$confirm({
              title: '提示',
              content: '请您确认水电施工已经完成？',
              okText: '确认已完成',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                document.cookies
                var token = self.$cookies.get("token")
                console.log(token)
                self.$ajax({url:'/sg/order/sgConfirmShuiDian',
                  method: 'post',
                    params:{
                    user_token: token,
                    order_id: self.recordID,
                  }
                })
                .then((res)=>{
                  self.dropIn = res.data.msg
                  if(res.data.code == 1){
                    self.$message.error(res.data.msg);
                  }
                  if(res.data.code == 0){
                    self.$message.success(res.data.msg);
                  }
                  self.orderDetailsCancel(); //订单详情请求接口部分
                });
              },
              onCancel() {},
            });
    },
    woodworking(record){ //确认泥工木工施工完成
      let self = this;
      this.$confirm({
              title: '提示',
              content: '请您确认泥工木工施工完成？',
              okText: '确认已完成',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                document.cookies
                var token = self.$cookies.get("token")
                console.log(token)
                self.$ajax({url:'/sg/order/sgConfirmNiMu',
                  method: 'post',
                    params:{
                    user_token: token,
                    order_id: self.recordID,
                  }
                })
                .then((res)=>{
                  self.dropIn = res.data.msg
                  if(res.data.code == 1){
                    self.$message.error(res.data.msg);
                  }
                  if(res.data.code == 0){
                    self.$message.success(res.data.msg);
                  }
                  self.orderDetailsCancel(); //订单详情请求接口部分
                });
              },
              onCancel() {},
            });
    },
    paint(record){ //确认油漆施工完成
      let self = this;
      this.$confirm({
              title: '提示',
              content: '请您确认油漆施工完成？',
              okText: '确认已完成',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                document.cookies
                var token = self.$cookies.get("token")
                console.log(token)
                self.$ajax({url:'/sg/order/sgConfirmYouQi',
                  method: 'post',
                    params:{
                    user_token: token,
                    order_id: self.recordID,
                  }
                })
                .then((res)=>{
                  self.dropIn = res.data.msg
                  if(res.data.code == 1){
                    self.$message.error(res.data.msg);
                  }
                  if(res.data.code == 0){
                    self.$message.success(res.data.msg);
                  }
                  self.orderDetailsCancel(); //订单详情请求接口部分
                });
              },
              onCancel() {},
            });
    },

    handleOk(e){
      this.visible = false;
    },
    handleCancel(e){
      this.visible = false;
    },
  }
}
</script>

<style lang="less" scoped>
.order_form h3 { margin-bottom: 10px; font-size: 18px; font-weight: 700; color: #000000;}
</style>
