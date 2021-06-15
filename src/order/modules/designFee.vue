<template>
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout" @submit="designFeeSubmit">
        <div class="bg-f7 wrapper-md m-b-md">
          <h3>房屋信息</h3>
          <a-row class="text-darkgray housing-info">
            <a-col :span="12">
              <span class="m-r text-gray">所在地区</span>{{confirmOrderhouse.address}}
            </a-col>
            <a-col :span="12">
              <span class="m-r text-gray">详细地址</span>{{confirmOrderhouse.detail_address}}
            </a-col>
            <a-col :span="12">
              <span class="m-r text-gray">房屋现状</span>{{confirmOrderhouse.house_status}}
            </a-col>
            <a-col :span="12">
              <span class="m-r text-gray">房屋类型</span>{{confirmOrderhouse.house_type}}
            </a-col>
            <a-col :span="12">
              <span class="m-r text-gray">房屋户型</span>{{confirmOrderhouse.shi}}室{{confirmOrderhouse.ting}}厅{{confirmOrderhouse.chu}}厨{{confirmOrderhouse.wei}}卫
            </a-col>
            <a-col :span="12">
              <span class="m-r text-gray">房屋面积</span>{{confirmOrderhouse.area}}m²
            </a-col>
          </a-row>
        </div>
        <a-form-item label="房屋面积">
          <a-input v-model="confirmOrderForm.area" />
          <p class="area text-gray">请核对房屋面积，系统会根据您设计单价和房屋面积确定设计费用。公式为：设计费用 = 房屋面积 * 设计单价</p>
        </a-form-item>
        <a-form-item label="设计费用">
          {{confirmOrderForm.area}}m² * {{confirmOrder.design_price}}元/㎡ = {{confirmOrderForm.area * confirmOrder.design_price}}元
        </a-form-item>
        <div class="m-b-xxl text-c">
          <a-button size="large" type="primary" htmlType="submit" class="w">立即提交</a-button>
        </div>
      </a-form>
    </a-spin>
</template>

<script>

export default {
  props: {
    confirmOrder:{},  //确认房屋信息及订单金额 数据1
    confirmOrderhouse:{},  //确认房屋信息及订单金额 数据
    oid:null,
    tokenData:'',
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
      form: this.$form.createForm(this),
      // confirmOrder:[],
      // confirmOrderhouse:[],
      confirmOrderForm:[],
      fileList: [ //当前操作的文件对象
         {
            uid: '-1', // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            name: 'xxx.png',  // 文件名
            status: 'done', //状态有：uploading done error removed
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
         }
       ],
    }
  },
  methods: {
    designFeeSubmit(){
      console.log(this.tokenData)
      this.$ajax({
        url:'/designer/order/confirmOrder', //设计师确认 房屋信息及订单金额 (确认订单)
        method: 'post',
        params:{
          user_token:this.tokenData,
          order_id: this.oid,
          area : this.confirmOrderForm.area,
        }
      })
      .then((res)=>{
        this.confirmOrderForm = res.data.data
        this.cof_code = res.data.code
        if(this.cof_code == 0){
          this.$message.success(res.data.msg);
          this.$emit('childClose','0'); //向父组件发送关闭弹出框信号
        }
        if(this.cof_code == 1){
          this.$message.error(res.data.msg);
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
  .area { line-height: 1.2;}
  .housing-info { line-height: 2;}
</style>
