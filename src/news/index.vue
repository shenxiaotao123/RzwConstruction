<template>
  <div>
	<myhead></myhead>


	<!--热门专栏-->
	<div class="m-t-md">
	  <div class="wrap">
		<div v-for="colr in column">
			<div class="headline-news">
				<div class="newslistbox">
					<div class="fl"><img :src="colr.cover_pic" class="news-Pic" width="100%" alt=""></div>
					<div class="news-title">
						<h6 @click="$router.push({path:'/columnDetails',query:{id:colr.id}})" class="pointer">{{ colr.name }}</h6>
						<div @click="$router.push({path:'/columnDetails',query:{id:colr.id}})" class="text-gray size12 brief pointer">{{ colr.brief }}</div>
						<div class="news-count_infos_num">
							已更新 {{ colr.count_infos_num }} 期
							<div class="m-l-sm fr">
								<el-button @click="favorites($event)" :id="colr.id">+收藏此专栏</el-button>
							</div>
							<el-button type="danger" class="fr m-r-sm" @click="open">关注</el-button>
						</div>
					</div>
				</div>
				<div class="h-news-list">
					<div class="n-l-wrap pointer" v-for="inf of colr.infos.slice(0,6)">
						<img :src="inf.cover_img" class="news-Pic" width="100%" alt="" @click="$router.push({path:'/textDetails',query:{id:inf.id,cid:inf.column_id}})">
						<div class="news-link" @click="$router.push({path:'/textDetails',query:{id:inf.id,cid:inf.column_id}})">
						  	<h6>{{ inf.title }}</h6>
						  	<p class="size12 text-gray news-brief">{{inf.brief}}</p>
						</div>
					</div>
				</div>
			</div>
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
  name: 'newsindex',
  data () {
    return {    
	  column:[],
	  adscolumn:[]
    }
  },
  components: {
    myhead,
    myfooter,
    downloadApp
  },
  mounted() {
   this.$ajax.get('info/column').then((response) => { //专栏列表
       this.column = response.data.data.data
   });
  },
  methods: {
    open() {
      this.$alert(<downloadApp/>,{
        dangerouslyUseHTMLString: true,
        showConfirmButton:false,
      });
    },
	favorites(e){
		var columnid = e.currentTarget.id //获取自身ID
		//console.log(columnid)
		document.cookie
		var token = this.$cookies.get("token")
		this.tokenData = token
		
		var tokenData= {
		  'user_token' : this.tokenData, 
		  'target_type' : 'column_info',
		  'target_id' : columnid,
		};
	
		var token = tokenData; // 这里才是你的表单数据
		this.$ajax.post('consumer/collect',token).then((response) => { //收藏专栏
			this.collect = response.data.data
			var clocode = response.data.code
			var clomsg = response.data.msg
			if(clocode==1){
				//alert(clomsg)
				this.$message({
				    message: clomsg,
				    type: 'warning'
				});
			}
			if(clocode==99){
				this.$message({
				    message: '您还未登录，请先登录再收藏',
				    type: 'warning'
				});
			}
			if(clocode==0){
				this.$message({
				    message: '收藏成功！',
				    type: 'success'
				});
			}
		});
	},
  }
}
</script>
<style>
	.myhead,.el-menu,.el-menu-item:hover { background-color: transparent !important;}
	.el-image__inner { height: 500px;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @miam-color: #0c3052;
  @secondary-color: #67161f;
  @border-radius-5: 5px;
  @bg-color: #bd2032;

  .bg-miam { background: @secondary-color;}
  .br-mian { border-color: @bg-color;}
  //轮播图
  .carousel { height: 400px; border-radius:10px; overflow:hidden;
    .el-image {
      img { cursor: pointer;}
    }
  }
  .homeBox { padding: 90px 0;
    h2 { margin-bottom: 20px; font-size: 36px; font-weight: 300;}
    .vice { margin-bottom: 55px; font-size: 16px;}
  }

  //热门专栏
 .headline-news { margin-bottom: 20px; padding: 20px; background-color: #fff; border-radius: 5px; overflow:hidden;
	&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
	.newslistbox {
		&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
		.news-Pic { float: left; width: 225px; height:180px; border-radius:3px;}
		.news-title { margin-left: 30px;  float: left; width:880px; color:#333;
			h6 { margin: 3px 0 10px 0; font-size:18px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;}
			.brief { height: 105px;}
		}
		.news-count_infos_num {
			&:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
		}
	}
 }
  	.h-news-list { margin-top: 20px; text-align: left;
		 &:after { content:"."; display:block; height:0; clear:both; visibility:hidden;}
		 .n-l-wrap { margin-right: 30px; float: left; width: 140px; text-align: center;}
			.news-Pic { width: 140px; height:120px; border-radius:2px;}
  			.news-link {
				h6 { margin:5px 0 8px 0; color:#333; font-size: 14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; line-height: 1.3;}
				.news-brief { overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
  			}
  		
  	}


</style>
