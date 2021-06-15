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
              {{orderDetails.total_fee}}
            </a-form-item>
            <a-form-item label="创建时间" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetails.created_at}}
            </a-form-item>
            <a-form-item label="订单类型" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <span v-if="orderDetails.is_merge == 0">设计订单</span>
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
            <a-form-item label="购房证明" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <img style="width: 80px; height: 80px;" :src="orderDetailsHouse.pic" alt="">
            </a-form-item>
            <a-form-item label="装修要求" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              {{orderDetailsHouse.demand}}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <h3>设计图纸</h3>
            <a-form-item label="平面图" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <span v-if="getOrderImages.plan == null">平面图还未上传</span>
              <span v-if="getOrderImages.plan != null">
                 <img style="width: 80px; height: 80px;" :src="getOrderImages.plan.url" alt="">
              </span>
            </a-form-item>
            <a-form-item label="施工图" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
              <span v-if="getOrderImages.sg == null">施工图还未上传</span>
              <span v-if="getOrderImages.sg != null">
                <a :href="getOrderImages.sg.url"><a-icon type="download" /> 施工图{{getOrderImages.sg.created_at}}(点击下载)</a>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="m-t-lg text-c">
          <span v-if="orderDetails.order_stage_id === 1">
            <a-button type="primary" size="large" @click="setModal1Visible(true)">确认房屋面积及设计费</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 3">
            <a-button type="primary" size="large"  @click="showDoor">确认上门</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 4">
            <a-button type="primary" size="large" @click="setModal2Visible(true)">上传平面图</a-button>
          </span>
          <span v-if="orderDetails.order_stage_id === 6">
            <a-button type="primary" size="large" @click="setModal3Visible(true)">上传施工图</a-button>
          </span>

        </div>


        <!-- 关联施工订单详情 -->
        <a-modal title="关联施工订单详情" :width="840" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
          <relatedOrders :orderId="orderId" :tokenData="tokenData" />
        </a-modal>

        <!-- 确认房屋面积及设计费 -->
        <a-modal title="确认房屋面积及设计费" :width="840" :visible="modal1Visible" @cancel="() => setModal1Visible(false)" :footer="null">
          <designFee :oid="recordID" :tokenData="tokenData" :confirmOrderhouse="confirmOrderhouse" :confirmOrder="confirmOrder" v-on:childClose="getChildClose"/>
        </a-modal>
        <!-- 上传平面图 -->
        <a-modal title="上传平面图" :width="500" :visible="modal2Visible" @ok="postUploadImageUrl" @cancel="() => setModal2Visible(false)">
          <floorplan v-on:uploadImageUrl="getUploadImageUrl" />
        </a-modal>
        <!-- 上传施工图 -->
        <a-modal title="上传施工图包" :width="1000" v-model="modal3Visible"  @ok="() => (modal3Visible = false)">
          <construction :oid="recordID" :tokenData="tokenData" />
        </a-modal>
    </a-card>

</template>

<script>
import relatedOrders from './modules/relatedOrders' //关联施工订单详情
import designFee from './modules/designFee' //确认房屋面积及设计费
import floorplan from './modules/floorplan' //上传平面图
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
    designFee,
    floorplan,
    construction
  },
  mounted () {
    this.recordID = this.$route.query.id
    document.cookies
    var token = this.$cookies.get("token")
    this.$ajax({
      url:'/designer/orderList/' + this.$route.query.id, //订单详情
      method: 'get',
      params:{
        user_token:token
      }
    })
    .then((res)=>{
      this.orderDetails = res.data.data
      this.orderDetailsStage = res.data.data.designer_stage
      this.orderDetailsHouse = res.data.data.house
    });
    this.$ajax({
      url:'/designer/order/getOrderImages', //获取订单图纸信息
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
    setModalRelated() { //确认设计费 - 弹出框、子组件传参
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

    getDesignFee(){ //获取 确认房屋面积及设计费 的接口数据
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url:'/designer/order/confirmOrder', //确认房屋信息及订单金额
        method: 'get',
        params:{
          user_token:token,
          order_id: this.recordID,
        }
      })
      .then((res)=>{
        this.confirmOrderhouse = res.data.data.house
        this.confirmOrder = res.data.data
      });
    },
    getChildClose(data){ //确认房屋面积及设计费 子组件向父组件传值
       this.childClose = data;
       if(this.childClose == 0){
          //this.orderTableChange();
          this.setModal1Visible(); //收到关闭信号,执行关闭
          // 重置表单数据
          //form.resetFields()
          // 刷新表格
          //this.$refs.table.refresh()
          this.getOrderList(); //订单列表请求接口部分
          //location.reload(); //刷新页面
       }
     },
    setModal1Visible(modal1Visible) { //确认设计费 - 弹出框、子组件传参
         this.modal1Visible = modal1Visible;
         this.recordID; //订单ID
         this.tokenData;
         if(modal1Visible == true){
           this.getDesignFee();
         }
     },
    setModal2Visible(modal2Visible,record) { //上传平面图 - 弹出框
          this.modal2Visible = modal2Visible;
          // this.recordID = record; //订单ID
          // this.tokenData;
    },
    setModal3Visible(modal3Visible,record) { //上传施工图 - 弹出框
          this.modal3Visible = modal3Visible;
          this.recordID; //订单ID
          document.cookies
          var token = this.$cookies.get("token")
          this.tokenData = token;
    },
    getUploadImageUrl(data){ //上传平面图 图片地址 子组件向父组件传值
       this.uploadImageUrl = data;
    },
    postUploadImageUrl(data){ //上传平面图 “确定” 回调事件
      this.modal2Visible = false;
      document.cookies
      var token = this.$cookies.get("token")
      this.$ajax({
        url:'/designer/order/uploadFloorPlan', //提交订单设计平面图
        method: 'post',
        params:{
          user_token: token,
          order_id: this.recordID,
        },
        data:{
          plan_image:this.uploadImageUrl,
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
        //location.reload(); //刷新页面
      });

    },
    showDoor(record){ //确认上门
      let self = this;
      this.$confirm({
              title: '提示',
              content: '请您确认已上门服务？',
              okText: '确认已上门',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                console.log(self)
                self.recordID;
                document.cookies
                var token = self.$cookies.get("token")
                console.log(token)
                self.$ajax({
                  url:'/designer/order/dropIn', //设计师确认上门
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
                  this.getOrderList(); //订单列表请求接口部分
                  //location.reload(); //刷新页面
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
