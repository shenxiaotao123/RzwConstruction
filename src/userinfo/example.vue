<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="实例ID">
                <a-input v-model="exampleId" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="exampleTitle" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="设计年份">
                  <a-input v-model="designYear" placeholder="2021" />
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

      <div class="table-operator m-t-sm m-b-sm">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <a-table ref="table" size="default" rowKey="id" :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" @change="handleTableChange" :rowSelection="rowSelection" showPagination="auto" :scroll="{ x: 1500 }">
        <div style="height: 40px; overflow: hidden; text-align: center; line-height: 40px;" slot="thumb" slot-scope="text, record">
          <img style="heigth:40px; width:40px;" :src="record.thumb" />
        </div>
        <div style="height: 40px; overflow: hidden; text-align: center; line-height: 40px;" slot="video_thumb" slot-scope="text, record">
          <img style="heigth:40px; width:40px;" :src="record.video_thumb" />
        </div>
        <span slot="DesignPicture" slot-scope="text, record">
          <template>
            <a @click="$router.push({path:'imgList',query:{work_id:record.id,title:record.title}})">图片列表</a>
            </a>
          </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$router.push({path:'addExample',query:{id:record.id}})">修改</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record.id)">删除</a>
          </template>
        </span>
      </a-table>

    </a-card>

</template>

<script>
import { Table } from 'ant-design-vue';

// import moment from 'moment'
// import { STable, Ellipsis } from '@/components'
// import { getRoleList, getServiceList } from '@/api/manage'

// import StepByStepModal from './modules/StepByStepModal'
// import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '案例ID',
    dataIndex: 'id',
    width: '80px',
    //scopedSlots: { customRender: 'serial' }
  },
  {
    title: '标题',
    dataIndex: 'title',
    scopedSlots: { customRender: 'description' },
    width: '200px',
    ellipsis: true,
  },
  {
    title: '封面图',
    dataIndex: 'thumb',
    key: 'thumb',
    scopedSlots: { customRender: 'thumb' },
    width: '80px',
  },
  {
    title: '视频地址',
    dataIndex: 'video',
    ellipsis: true,
  },
  {
    title: '视频封面',
    dataIndex: 'video_thumb',
    key: 'video_thumb',
    scopedSlots: { customRender: 'video_thumb' },
    width: '90px',
  },
  {
    title: '户型',
    dataIndex: 'shape_name',
  },
  {
    title: '设计年份',
    dataIndex: 'year',
    sorter: true
  },
  {
    title: '花费',
    dataIndex: 'cost',
  },
  {
    title: '面积㎡',
    dataIndex: 'area',
    sorter: true
  },
  {
    title: '发布时间',
    dataIndex: 'created_at',
    sorter: true,
    needTotal: true,
    ellipsis: true,
    width: '120px',
  },
  {
    title: '设计图片',
    dataIndex: 'DesignPicture',
    width: '90px',
    scopedSlots: { customRender: 'DesignPicture' }

  },
  {
    title: '操作',
    dataIndex: 'work_id',
    fixed: 'right',
    width: '120px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  data () {
    return {
      exampleId:'', //筛选项.实例ID
      exampleTitle:'', //筛选项.标题
      designYear:'', //筛选项.设计年份
      data:[],
      pagination: {
        pageSize: 10,
        pageSizeOptions:['10', '20', '30', '40', '100']
      },
      loading: false,
      columns,

      visible: false,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return getServiceList(requestParameters)
      //     .then(res => {
      //       return res.result
      //     })
      // },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    //getRoleList({ t: new Date() })
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
    imglist(){
      this.$router.push({
         name: "imgList",
         params: {work_id: record.id}
      })
    },
    handleTableChange(pagination, filters, sorter) {
          console.log(pagination, "分页");
          const pager = { ...this.pagination };
          pager.current = pagination.current;
          this.pagination = pager;
          this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
          });
    },
    fetch(params = {}) {
      this.getWork(); //实例列表请求接口部分
    },
    //实例列表请求接口部分
    getWork(exampleId, exampleTitle, designYear){
      document.cookies
      var token = this.$cookies.get("token")
      this.loading = true;

      this.$ajax.get('/designer/work',{
          params:{
             user_token:token,
             itemsPerLoad:this.pagination.pageSize,
             lastIndex: this.pagination.pageSize*(this.pagination.current-1),
             work_id:exampleId, //实例ID
             title:exampleTitle, //实例标题
             year:designYear, //设计年份
          },
          type: 'json',
        },
      )
      .then((data)=>{
        const pagination = { ...this.pagination };
        pagination.total =  data.data.data.count;
        this.loading = false;
        this.data = data.data.data.data;
        this.pagination = pagination;
      });

      // this.$ajax({
      //   url: '/designer/work',
      //   method: 'get',
      //   data: {
      //     results: 20,
      //   },
      //   params:{
      //      user_token:token,
      //      itemsPerLoad:this.pagination.pageSize,
      //      lastIndex: this.pagination.pageSize*(this.pagination.current-1),
      //      work_id:exampleId, //实例ID
      //      title:exampleTitle, //实例标题
      //      year:designYear, //设计年份
      //   },
      //   type: 'json',
      // }).then(data => {
      //   const pagination = { ...this.pagination };
      //   // Read total count from server
      //   // pagination.total = data.totalCount;
      //   pagination.total =  data.data.data.count;
      //   this.loading = false;
      //   this.data = data.data.data.data;
      //   this.pagination = pagination;
      // });
    },

    handleAdd () {
      this.$router.push('/userinfo/addExample'); //跳转到新增页
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    //筛选项
    filterChange(){  //筛选项-查询
      this.exampleId; //实例ID
      this.exampleTitle; //实例标题
      this.designYear; //下单时间
      console.log(this.designYear)
      //console.log(this.orderStageType + "分隔" + this.orderNumber + "分隔" + this.phoneNumber + "分隔" + this.orderTimeData);
      this.getWork(this.exampleId,this.exampleTitle,this.designYear);
    },
    handleReset() { //筛选项-重置
      this.exampleId = null; //订单类型
      this.exampleTitle = null; //订单编号
      this.designYear = null; //手机号码
       //this.form.resetFields();
    },

    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) { //列表-删除
      this.recordID = record; //订单ID
      document.cookies
      var token = this.$cookies.get("token")
      this.loading = true;

      // this.$ajax.delete('/designer/work'
      // )
      // .then(response => {

      // });



      this.$ajax({
        url: '/designer/work/' + this.recordID,
        method: 'DELETE',
        params:{
           user_token:token,
        },
      }).then(res => {
        if(res.data.code == 1){
          this.$message.error(res.data.msg);
        }
        if(res.data.code == 0){
          this.$message.success(res.data.msg);
        }
        //this.$refs.table.refresh();
        this.getWork(); //实例列表请求接口部分
      });
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
