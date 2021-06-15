<template>
    <a-spin :spinning="loading">
      <a-card :body-style="{padding: '20px 20px'}" :bordered="false" class="order_form">
      <a-row :gutter="[0,40]">
        <a-col :span="12">
          <h3>订单信息</h3>
          <a-form-item label="订单编号" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{orderSg.sg_order_no}}
          </a-form-item>
          <a-form-item label="订单类型" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          设计&amp;施工订单
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <h3>房屋信息</h3>
          <a-form-item label="订单阶段" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{orderSg.sg_order_stage_name}}
          </a-form-item>
          <a-form-item label="创建时间" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{orderSg.sg_created_at	}}
          </a-form-item>
        </a-col>
        <a-divider class="m-t-lg" />
        <a-col :span="12">
          <h3>劳务公司及费用</h3>
          <a-form-item label="劳务公司" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{orderSg.company_name}}
          </a-form-item>
          <a-form-item label="施工总费用" class="m-b-none" :labelCol="{lg: {span: 5}, sm: {span: 7}}" :wrapperCol="{lg: {span: 19}, sm: {span: 17} }">
          {{orderSg.sg_total_fee}}元
          </a-form-item>
        </a-col>
      </a-row>
      </a-card>
    </a-spin>
</template>

<script>

export default {
  props: {
    orderId:null,
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
        xs: { span: 16 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 13 }
      }
    }
    return {
      orderSg:[],
    }
  },
  mounted () {
    this.$ajax({
      url:'/designer/orderList/' + this.orderId, //订单详情
      method: 'get',
      params:{
        user_token:this.tokenData
      }
    })
    .then((res)=>{
      this.orderSg = res.data.data.sg_info
    });
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
  .area { line-height: 1.2;}
  .housing-info { line-height: 2;}
  .order_form h3 { margin-bottom: 10px; font-size: 18px; font-weight: 700; color: #000000;}
</style>
