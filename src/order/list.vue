<template>
  <div>
    <!-- <div class="order_tabs">
        <a v-for="tba in tbas" @click="tabFilter(tba.index)" :key="tba.id" :class="{ active: tba.index === currentIndex }">{{tba.name}}</a>
    </div> -->
    <div class="order_tabs" id="tabs">
      <a @click="tabFilter(0)" :class="{ active9: 0 === currentIndex }" :key="0">全部</a>
      <a @click="tabFilter(1)" :class="{ active9: 1 === currentIndex }" :key="1">进行中</a>
      <a @click="tabFilter(2)" :class="{ active9: 2 === currentIndex }" :key="2">已完成</a>
      <a @click="tabFilter(3)" :class="{ active9: 3 === currentIndex }" :key="3">已关闭</a>
    </div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper m-b">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="订单编号">
                <a-input v-model="orderNumber" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号码">
                <a-input v-model="phoneNumber" maxlength="11" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="订单类型">
                  <a-select default-value="请选择" style="width: 120px" @change="orderType">
                        <a-select-option value="0">
                          全部
                        </a-select-option>
                        <a-select-option value="1">
                          进行中
                        </a-select-option>
                        <a-select-option value="2">
                          已完成
                        </a-select-option>
                        <a-select-option value="3">
                          已关闭
                        </a-select-option>
                      </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="下单时间">
                  <a-range-picker :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" @change="orderTime" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="filterChange">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <a-table ref="table" size="default" rowKey="id" :data-source="orderList" :columns="columns" :pagination="pagination" :loading="loading" @change="orderTableChange" :rowSelection="rowSelection" showPagination="auto">
        <span slot="orderType" slot-scope="text, record">
          <span v-if="record.is_merge == 0">设计</span>
          <span v-if="record.is_merge == 1">设计&amp;施工</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$router.push({path:'order_details',query:{id:record.id}})">订单详情</a>
            <span v-if="record.order_stage_id === 3">
              <a-divider type="vertical" />
              <a @click="setModal2Visible(true,record.id)">上传劳务合同</a>
            </span>
            <span v-if="record.order_stage_id === 4">
              <a-divider type="vertical" />
              <a @click="hydropower(record.id)">确认水电完成</a>
            </span>
            <span v-if="record.order_stage_id === 6">
              <a-divider type="vertical" />
              <a @click="woodworking(record.id)">确认泥工木工完成</a>
            </span>
            <span v-if="record.order_stage_id === 8">
              <a-divider type="vertical" />
              <a @click="paint(record.id)">确认油漆完成</a>
            </span>
          </template>
        </span>
      </a-table>

      <!-- 上传施工图 -->
      <a-modal title="上传劳务合同" :width="840" :visible="modal2Visible" @ok="postUploadImageUrl" @cancel="() => setModal2Visible(false)">
        <construction v-on:uploadImageUrl="getUploadImageUrl" />
      </a-modal>

    </a-card>

  </div>
</template>

<script>
import construction from './modules/construction' //上传施工图
const columns = [
  {
    title: '订单ID',
    //scopedSlots: { customRender: 'serial' },
    dataIndex: 'id',
    width: '80px',
  },

  {
    title: '订单编号',
    dataIndex: 'order_no',
    //scopedSlots: { customRender: 'description' }
  },
  {
    title: '订单阶段',
    dataIndex: 'sg_stage.name'
  },
  {
    title: '用户名',
    dataIndex: 'user.nick_name'
  },
  {
    title: '手机号',
    dataIndex: 'user.phone',
    //scopedSlots: { customRender: 'status' }
  },
  {
    title: '订单金额(元)',
    dataIndex: 'total_fee',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    sorter: true,
    needTotal: true,
    ellipsis: true,
    width: '120px',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    scopedSlots: { customRender: 'orderType' }

  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '230px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'orderTableList',
  components: {
    construction
  },
  data () {
    return {
      tbas:[
        { id: 0, name: '全部'},
        { id: 1, name: '进行中'},
        { id: 2, name: '已完成'},
        { id: 3, name: '已关闭'},
      ],
      orderNumber:'', //筛选项.订单编号
      phoneNumber:'', //筛选项.手机号码
      orderList:[],
      pagination: {
        pageSize: 10,
        pageSizeOptions:['10', '20', '30', '40', '100']
      },
      confirmOrderForm:{
        area:''
      },
      loading: false,
      columns,
      tokenData:'',
      recordID:{}, //确认房屋信息及订单金额 订单ID
      confirmOrderhouse:{}, //确认房屋信息及订单金额 数据1
      confirmOrder:{}, //确认房屋信息及订单金额数据2
      childClose:{},//确认面积，关闭信号
      uploadImageUrl:{},//上传平面图图片地址
      modal1Visible: false,//对话框是否可见
      modal2Visible: false,
      confirmLoading: false,
      orderStageType:'',//订单阶段类型
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象

      selectedRowKeys: [],
      selectedRows: [],
       currentIndex:0
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
   orderTableChange(pagination, filters, sorter) {  //全部订单
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager || 0;
      this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
      });
   },
   fetch(params = {}) {
      this.getOrderList(); //订单列表请求接口部分
   },
   //订单列表请求接口部分
   getOrderList(orderStageType, orderNumber, phoneNumber, orderTimeData){
     document.cookies
     var token = this.$cookies.get("token")
     this.loading = true;
     this.$ajax({url:'/sg/orderList',
       method: 'get',
       params:{
          user_token:token,
          itemsPerLoad:this.pagination.pageSize,
          lastIndex: this.pagination.pageSize*(this.pagination.current-1),
          order_stage_type:orderStageType, //订单阶段类型
          order_time:orderTimeData,//下单时间
          order_no:orderNumber,//订单编号
          user_tel:phoneNumber,//用户手机号码
       },
       type: 'json',
     }).then(data => {
       const pagination = { ...this.pagination };
       // Read total count from server
       // pagination.total = data.totalCount;
       pagination.total =  data.data.data.count;
       this.loading = false;
       this.orderList = data.data.data.data;
       this.pagination = pagination;
     });
   },
   //顶部TAB类型大筛选
   tabFilter(index){
     this.orderStageType = index;
     console.log(index)
     this.getOrderList(this.orderStageType);
     this.currentIndex = index;
     // var tabs = document.getElementById('tabs a');
     // var tabs0 = document.getElementById('tabs-0');
     // var tabs1 = document.getElementById('tabs-1');
     // var tabs2 = document.getElementById('tabs-2');
     // var tabs3 = document.getElementById('tabs-3');
     // if(id === 0){
     //   tabs.classList.remove("tabs-active");
     //   tabs0.classList.add("tabs-active");
     // }
     // if(id === 1){
     //   tabs0.classList.remove("tabs-active");
     //   tabs1.classList.add("tabs-active");
     // }
     // if(id === 2){
     //   document.getElementById('tabs a').classList.remove("tabs-active");
     //   tabs2.classList.add("tabs-active");
     // }
     // if(id === 3){
     //   document.getElementById('tabs a').classList.remove("tabs-active");
     //   tabs3.classList.add("tabs-active");
     // }
   },
   setModal2Visible(modal2Visible,record) { //上传劳务合同 - 弹出框
         this.modal2Visible = modal2Visible;
         this.recordID = record; //订单ID
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
               console.log(self)
               self.recordID = record;
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
                 self.getOrderList(); //订单列表请求接口部分
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
               console.log(self)
               self.recordID = record;
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
                 self.getOrderList(); //订单列表请求接口部分
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
               console.log(self)
               self.recordID = record;
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
                 self.getOrderList(); //订单列表请求接口部分
               });
             },
             onCancel() {},
           });
   },
   //筛选项
   orderTime(value, dateString) { //筛选项-下单时间
      this.orderTimeData = dateString.join(","); //转换成接口要求的字符串格式
      console.log(this.orderTimeData)
   },
   orderType(value){ //筛选项-订单类型
     console.log(value)
     this.orderStageType = value;
   },
   filterChange(){  //筛选项-查询
     this.orderStageType; //订单类型
     this.orderNumber; //订单编号
     this.phoneNumber; //手机号码
     this.orderTimeData; //下单时间
     //console.log(this.orderStageType + "分隔" + this.orderNumber + "分隔" + this.phoneNumber + "分隔" + this.orderTimeData);
     this.getOrderList(this.orderStageType,this.orderNumber,this.phoneNumber,this.orderTimeData);
   },
   handleReset() { //筛选项-重置
     this.orderStageType = null; //订单类型
     this.orderNumber = null; //订单编号
     this.phoneNumber = null; //手机号码
     this.orderTimeData = null; //下单时间
      //this.form.resetFields();
   },

   handleOk () {
      this.visible = false
   },
   handleCancel () {
      this.visible = false
      // const form = this.$refs.createModal.form
      // form.resetFields() // 清理表单数据（可不做）s
    },
   onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
   toggleAdvanced () {
      this.advanced = !this.advanced
    },
   resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style lang="less">
  .active9 { color: #fff !important; background-color: #1890ff !important; border-color: #1890ff !important;}
  .order_tabs { margin-bottom: 5px;
    a { display: inline-block; padding: 10px 20px; border: 1px solid #eee; background-color: #fff; color:#999;
     &:hover { color:#1890ff;}
     &:target { color: #000; font-weight: 700;}
    }
  }
</style>
