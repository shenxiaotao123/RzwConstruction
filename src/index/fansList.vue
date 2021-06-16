<template>
      <a-table size="default" rowKey="id" :columns="columns" :data-source="fansList" :pagination="pagination" :loading="loading" showPagination="auto">
        <div style="height: 30px; overflow: hidden; background-color: #e7e7e7; text-align: center; line-height: 30px;" slot="imgurl" slot-scope="text, record">
          <img style="heigth:30px; width:30px;" :src="record.user.user_image" />
        </div>
      </a-table>
</template>

<script>
const columns = [
  {
    title: '头像',
    dataIndex: 'url',
    scopedSlots: { customRender: 'imgurl' },
    width: '80px',
  },
  {
    title: '粉丝名称',
    dataIndex: 'user.nick_name',
  },
  {
    title: '关注时间',
    dataIndex: 'created_at',
    ellipsis: true,
  },
]

export default {
  name: 'fansList',
  data () {
    return {
      confirmLoading: false,
      fansList: [],
      pagination: {
        pageSize: 5,
        pageSizeOptions:['10', '20', '30', '40', '100']
      },
      loading: false,
      columns,

      selectedRowKeys: [],
      selectedRows: []
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
          // console.log(this.pagination)
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
      this.loading = true;
      this.$ajax({
        url:'/designer/fans',
        method: 'get',
        data: {
          results: 10,
        },
        params:{
           user_token:token,
           itemsPerLoad:this.pagination.pageSize,
           lastIndex: this.pagination.pageSize*(this.pagination.current-1)
        },
        type: 'json',
      }).then(data => {
        const pagination = { ...this.pagination };
        pagination.total =  data.data.data.count;
        this.loading = false;
        this.fansList = data.data.data.data;
        //console.log(pagination)
        this.pagination = pagination;
      });
    },

  }
}
</script>
