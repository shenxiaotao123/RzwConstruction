<template>
  <div>
	<myhead></myhead>
	<div class="wrap">
		<el-breadcrumb separator="/" class="m-b-sm text-gray">
			<span class="fl">当前位置：</span>
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a @click="$router.push({path:'/news'})">专栏</a></el-breadcrumb-item>
			<el-breadcrumb-item>详情页</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="cd-top">
			<img :src="columnd.cover_pic" class="news-Pic" width="100%" alt="">
			<div class="news-title">
				<h6 >{{ columnd.name }}</h6>
				<div class="text-gray size12 brief">{{ columnd.introduction }}</div>
				<div class="news-count_infos_num size14">
					{{ columnd.follow_num }}人关注
					<span class="m-l-sm">|</span>
					已更新 {{ columnd.count_infos_num }} 期
				</div>
			</div>
		</div>
		<div class="wrap">
			<div class="cd-left">
				<template>
				  <el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="介绍" name="Introduction">
						<div class="wrapper-sm">{{ columnd.introduction }}</div>
					</el-tab-pane>
				    <el-tab-pane label="目录" name="directory">
						<ul class="directory">
							<li v-for="col in columnInfos">
								<div class="pointer" v-if="col.type == '3'" @click="$router.push({path:'/textDetails',query:{id:col.id,cid:col.column_id}})">
									<div class="column-con-icon pointer" v-if="col.type == '1'">
										<i class="el-icon-video-camera fl" title="视频" />
									</div>
									<div class="column-con-icon pointer" v-else-if="col.type == '3'">
										<i class="el-icon-tickets fl" title="文章" />
									</div>
									{{ col.title }}
									<span class="size12 text-gray fr">{{ col.updated_at }}</span>
								</div>
								<div class="pointer" v-else-if="col.type == '1'" @click="$router.push({path:'/videoDetails',query:{id:col.id,cid:col.column_id}})">
									<div class="column-con-icon pointer" v-if="col.type == '1'">
										<i class="el-icon-video-camera fl" title="视频" />
									</div>
									<div class="column-con-icon pointer" v-else-if="col.type == '3'">
										<i class="el-icon-tickets fl" title="文章" />
									</div>
									{{ col.title }}
									<span class="size12 text-gray fr">{{ col.updated_at }}</span>
								</div>
							</li>
						</ul>
					</el-tab-pane>
				  </el-tabs>
				</template>
			</div>
			<div class="cd-right">
				<h3>更多推荐</h3>
				<ul class="recommend-news">
					<li v-for="rec in recommend.slice(0,6)">
						<img :src="rec.cover_pic" class="recommend-Pic pointer" width="100%" alt="" @click="$router.push({path:'/columnDetails',query:{id:rec.id}})">
						<div class="recommend-text">
							<h6 @click="$router.push({path:'/columnDetails',query:{id:rec.id}})" class="pointer">{{ rec.name }}</h6>
							<p class="size12 text-gray m-t-xs">已更新 {{rec.count_infos_num}} 期</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>

    <myfooter></myfooter>
  </div>
</template>

<script>
  import myhead from '@/components/myhead'
  import myfooter from '@/components/myfooter'
  import downloadApp from '@/public/downloadApp' //弹出框APP引导
export default {
  name: 'columnDetails',
  data () {
    return {    
	  columnd:[],
	  columnInfos:[],
	  recommend:[],
	  activeName: 'Introduction'
    }
  },
  components: {
    myhead,
    myfooter,
    downloadApp
  },
  mounted() {
   this.$ajax.get('info/column/' + this.$route.query.id).then((response) => { //专栏详情
       this.columnd = response.data.data
   });
   this.$ajax.get('info/columnInfos' + '?column_id=' + this.$route.query.id).then((response) => { //专栏文章列表
       this.columnInfos = response.data.data.data
   });
   this.$ajax.get('info/column' + '?is_rec=1').then((response) => { //推荐专栏
       this.recommend = response.data.data.data
   });
  },
  methods: {
    open() {
      this.$alert(<downloadApp/>,{
        dangerouslyUseHTMLString: true,
          showConfirmButton:false,
      });
    },
	handleClick(tab, event) {
	    console.log(tab, event);
	}
  }
}
</script>
<style>
	.myhead,.el-menu,.el-menu-item:hover { background-color: transparent !important;}
	.el-tabs__item { font-size: 16px;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @miam-color: #0c3052;
  @secondary-color: #67161f;
  @border-radius-5: 5px;
  @bg-color: #bd2032;

  .bg-miam { background: @secondary-color;}
  .br-mian { border-color: @bg-color;}
  
 .cd-top { margin-bottom: 10px; padding: 20px; background-color: #fff; border-radius: 5px; overflow:hidden;
	&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
		.news-Pic { float: left; width: 400px; height:320px; border-radius:3px;}
		.news-title { margin-left: 30px;  float: left; width:700px; color:#333;
			h6 { margin: 3px 0 10px 0; font-size:18px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;}
			.brief { height: 220px;}
		}
		.news-count_infos_num {
			&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
		}
 }
 .cd-left { padding: 20px; float: left; width: 870px; background-color: #fff;
	.directory { padding: 10px 10px 0 10px;
		li { margin-bottom: 20px;
			i { margin: 3px 10px 0 0;}
		}
	}
 }
 .cd-right { padding: 20px; float: right; width: 240px; background-color: #fff;
	h3 { font-size: 14px;}
	.recommend-news { margin-top: 20px;
		li { margin-bottom: 10px;
			&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
			.recommend-Pic { float: left; width: 70px; height:56px; border-radius:3px;}
			.recommend-text { margin-left: 10px; float: left; width: 156px;
				h6 { line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
			}
		}
	}
 }
</style>
