<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <div class="m-b-md">
          <a @click="$router.push({path:'/userinfo/example'})" class="fr">返回实例列表</a>
          实例ID：{{work_id}}
          <span class="m-l-lg">标题：{{work_title}}</span>
        </div>

      </div>

      <div class="table-operator m-b-sm">
        <a-button type="primary" icon="plus" @click="handleAdd(true)">新增图片</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <a-table size="default" rowKey="id" :columns="columns" :data-source="imgList" :pagination="pagination" :loading="loading" :rowSelection="rowSelection" showPagination="auto">
        <div style="height: 40px; overflow: hidden; background-color: #e7e7e7; text-align: center; line-height: 40px;" slot="imgurl" slot-scope="text, record">
          <img style="heigth:40px; width:40px;" :src="record.url" />
        </div>

        <span slot="del" slot-scope="text, record">
          <template>
            <a @click="handleDel(record.id)">删除</a>
          </template>
        </span>
      </a-table>

      <!-- 新增图片 -->
      <a-modal title="新增图片" :width="840" :visible="addImgVisible" @cancel="() => handleAdd(false)" :confirm-loading="confirmLoading" :footer="null">
        <addImg v-if="addImgshow" :workId="work_id" v-on:childClose="getChildClose" />
      </a-modal>

    </a-card>
</template>

<script>
import addImg from './addImg' //新增图片
const columns = [
  {
    title: '图片ID',
    dataIndex: 'id',
    width: '80px',
  },
  {
    title: '图片',
    dataIndex: 'url',
    scopedSlots: { customRender: 'imgurl' },
    width: '80px',
  },
  {
    title: '图片类型',
    dataIndex: 'type_name'
  },
  {
    title: '空间名',
    dataIndex: 'space_name'
  },
  {
    title: '简介',
    dataIndex: 'note',
    width: '300px',
    ellipsis: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '上传时间',
    dataIndex: 'created_at',
    ellipsis: true,
    width: '120px',
  },
  {
    title: '操作',
    dataIndex: 'del',
    width: '80px',
    scopedSlots: { customRender: 'del' }
  }
]

export default {
  name: 'TableList',
  components: {
    addImg
  },
  data () {
    return {
      addImgshow: true, //强制刷新新增图片子组件
      addImgVisible: false,//对话框是否可见
      confirmLoading: false,
      imgList: [],
      childClose:{},//新增图片，弹出框 关闭信号
      work_id: null,
      work_title: null,
      pagination: {
        pageSize: 10,
        pageSizeOptions:['10', '20', '30', '40', '100']
      },
      loading: false,
      columns,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象

      selectedRowKeys: [],
      selectedRows: []
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
    this.fetch();//图片列表请求接口部分
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
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
      this.getWorkImage(); //图片列表请求接口部分
    },
    //图片列表请求接口部分
    getWorkImage(){
      document.cookies
      var token = this.$cookies.get("token")
      this.work_id = this.$route.query.work_id //实例列表传值过来的实例ID
      this.work_title = this.$route.query.title //实例列表传值过来的实例标题
      this.loading = true;
      this.$ajax({
        url:'/designer/workImage',
        method: 'get',
        data: {
          results: 20,
        },
        params:{
           work_id: this.work_id,
           user_token:token,
           itemsPerLoad:this.pagination.pageSize,
           lastIndex: this.pagination.pageSize*(this.pagination.current-1)
        },
        type: 'json',
      }).then(data => {
        const pagination = { ...this.pagination };
        pagination.total =  data.data.data.count;
        this.loading = false;
        this.imgList = data.data.data.data;
        this.pagination = pagination;
      });
    },

    handleAdd (addImgVisible) {
       this.addImgVisible = addImgVisible;
    },
    getChildClose(data){ //新增图片 子组件向父组件传值
       this.childClose = data;
       if(this.childClose == 0){
          this.handleAdd(); //收到关闭信号,执行关闭
          this.getWorkImage(); //重新请求列表接口
          //强制刷新新增图片子组件
          this.addImgshow= false;
          this.$nextTick(() => {
              this.addImgshow= true;
          });
       }
     },
    handleDel (record) { //图片列表-删除
      this.recordID = record; //图片ID
      document.cookies
      var token = this.$cookies.get("token")
      this.loading = true;
      this.$ajax({
        url: '/designer/workImage/' + this.recordID,
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
        this.getWorkImage(); //重新请求图片列表请求接口部分
      });
    },
  }
}
</script>
