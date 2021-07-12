<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="userId" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="户型">
                    <a-select default-value="请选择" style="width: 120px" @change="shapes">
                       <a-select-option :id="shapes.id" :value="shapes.name" v-for="shapes in shapesData" :key="shapes.id">
                          {{shapes.name}}
                       </a-select-option>
                    </a-select>
              </a-form-item>
            </a-col>

            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="工地阶段">
                   <a-select default-value="请选择" style="width: 120px" @change="stage">
                      <a-select-option :id="ssl.id" :value="ssl.name" v-for="ssl in SiteStageList">
                         {{ssl.name}}
                      </a-select-option>
                   </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="地区">
                   <a-cascader :options="district" v-model="areaArray" placeholder="选择地区" @change="areaChange" :field-names="{ label: 'name', value: 'id', children: 'children'}" />
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
          <img style="heigth:40px; width:40px;" :src="record.thumb_img" />
        </div>
        <div style="height: 40px; overflow: hidden; text-align: center; line-height: 40px;" slot="video_thumb" slot-scope="text, record">
          <img style="heigth:40px; width:40px;" :src="record.video_thumb" />
        </div>
        <div slot="cost" slot-scope="text, record">
          {{record.cost}}万元
        </div>

        <span slot="DesignPicture" slot-scope="text, record">
          <template>
            <a @click="$router.push({path:'stageInfo',query:{site_id:record.id,stageId:record.stage_id}})">查看修改</a>
            </a>
          </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$router.push({path:'addSite',query:{id:record.id}})">修改</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record.id)">删除</a>
          </template>
        </span>
      </a-table>

    </a-card>

</template>

<script>
import { Table } from 'ant-design-vue';
const district = [ //省市县自定义字段名
  {
    id: '',
    name: '',
    children: [
      {
        id: '',
        name: '',
        children: [
          {
            id: '',
            name: '',
          },
        ],
      },
    ],
  }
];
const columns = [
  {
    title: '工地ID',
    dataIndex: 'id',
    width: '80px',
    //scopedSlots: { customRender: 'serial' }
  },
  {
    title: '工地标题',
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
    title: '用户',
    dataIndex: 'video',
    ellipsis: true,
  },
  {
    title: '负责人',
    dataIndex: 'manager',
    width: '90px',
  },
  {
    title: '户型',
    dataIndex: 'shape_name',
  },
  {
    title: '造价',
    dataIndex: 'cost',
    scopedSlots: { customRender: 'cost' }
  },
  {
    title: '面积㎡',
    dataIndex: 'area',
    sorter: true
  },
  {
    title: '地区',
    dataIndex: 'created_at',
    ellipsis: true,
    width: '120px',
  },
  {
    title: '目前阶段',
    dataIndex: 'stage_name',
    width: '120px',
  },
  {
    title: '阶段信息',
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
      userId:'', //筛选项.用户ID
      exampleTitle:'', //筛选项.标题
      designYear:'', //筛选项.设计年份
      data:[],
      pagination: {
        pageSize: 10,
        pageSizeOptions:['10', '20', '30', '40', '100']
      },
      loading: false,
      areaArray: [], //省市县ID数组
      shapesData:[],
      shapesName:'',
      shapesId:'',
      SiteStageList:[],
      stageName:'',
      stageId:'',
      columns,
      district,

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
    this.$ajax({ //户型数据
      url: '/api/config/shapes',
      method: 'get',
    }).then(res => {
      this.shapesData= res.data.data;
      let all = {
         id:0,
         name:'全部',
         sort:0,
       }
      this.shapesData.unshift(all) //全部，添加到数组里
    });

    this.$ajax({ //施工阶段列表
      url: '/sg/stage/list',
      method: 'get',
    }).then(res => {
      this.SiteStageList= res.data.data;
      let sgAll = {
         id:0,
         name:'全部',
         pic:'',
         sort:0,
         created_at:'',
       }
      this.SiteStageList.unshift(sgAll) //全部，添加到数组里
    });

    this.$ajax({ //地区(省市区)列表 数据
      url:'/api/regions/list',
      method: 'get',
      params:{
        type:'treeNoKey'
      }
    })
    .then((res)=>{
      this.district = res.data.data
    });
    this.fetch();
  },
  methods: {
    // imglist(){
    //   this.$router.push({
    //      name: "imgList",
    //      params: {work_id: record.id}
    //   })
    // },
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
      this.getSite(); //工地列表请求接口部分
    },
    //工地列表请求接口部分
    getSite(userId){
      document.cookies
      var token = this.$cookies.get("token")
      this.loading = true;
      this.$ajax.get('/sg/site',{
          params:{
             user_token:token,
             itemsPerLoad:this.pagination.pageSize,
             lastIndex: this.pagination.pageSize*(this.pagination.current-1),
             user_id:userId, //用户ID
             shape_id:this.shapesId,//户型ID
             stage_id:this.stageId,//阶段ID
             province_id:this.provincial,//省 ID
             city_id:this.city,//市 ID
             area_id:this.region,//区 ID
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
    },

    handleAdd () {
      this.$router.push('/userinfo/addSite'); //跳转到新增页
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    //筛选项
    filterChange(){  //筛选项-查询
      this.userId; //用户ID
      //console.log(this.orderStageType + "分隔" + this.orderNumber + "分隔" + this.phoneNumber + "分隔" + this.orderTimeData);
      this.getSite(this.userId);
    },
    handleReset() { //筛选项-重置
      this.userId = null; //用户ID
      this.shapesId = null; //户型ID
      this.shapesName = '全部'; //户型名
      this.shapesData.name = this.shapesName;
      console.log(this.shapesData.name)
    },
    areaChange(value) { //所在地区 省市县
      this.provincial = value[0]; //省
      this.city = value[1]; //市
      this.region = value[2]; //区县
      var areaArray = []; //设置一个空数组
      areaArray.push(this.provincial, this.city, this.region) //省市县ID添加到空数组里
      this.areaArray = areaArray
      console.log(this.areaArray)
    },
    shapes(value,id){
      this.shapesName = value; //获取户型名
      this.shapesId = id.data.attrs.id; //获取户型ID
    },
    stage(value,id){
      this.stageName = value; //获取目前施工阶段名
      this.stageId = id.data.attrs.id; //获取	目前施工阶段ID
      console.log(this.stageId)
      console.log(this.stageName,'名字')
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
        url: '/sg/site/' + this.recordID,
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
        this.getSite(); //实例列表请求接口部分
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
