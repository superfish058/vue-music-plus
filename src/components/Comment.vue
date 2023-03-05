<template>
	<div class="comment" ref="comment">
		<div class="hotcomment" v-if="page==1&&hotComments!==undefined && hotComments.length > 0">
			<div class="title"  >
				热门评论({{hotComments.length}})
			</div>
			<div class="comments">
				<ul>
					<li v-for="(item,index) in hotComments" :key="index">
						<!-- 头像 -->
						<div class="img">
							<img :src="item.user.avatarUrl+'?param=200y200'">
						</div>
						<!-- 评论主体 -->
						<div class="content" >
							<div class="text">
								<div class="name" > {{item.user.nickname+":"}}</div>
								<p >{{item.content}}</p>
							</div>
							<!-- 评论回复 -->
							<div class="replay" v-if="item.beReplied.length==1" >
								<div class="text">
									<div class="name" >@{{item.beReplied[0].user.nickname+":"}}</div>
									<p >{{item.beReplied[0].content}}</p>
								</div>
							</div>
							<!-- 日期点赞 -->
							<div class="date">
								{{setDatePlus(item.time)}}
								<div class="likes">
									<span class="iconfont icon-dianzan"> </span>
									<div class="likedCount">
										{{item.likedCount}}
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<br><br>
		</div>
		<div class="newcomment">
			<div class="title">
				最新评论({{total}})
			</div>
			<div class="comments">
				<ul>
					<li v-for="(item,index) in comments" :key="index">
						<!-- 头像 -->
						<div class="img">
							<img :src="item.user.avatarUrl">
						</div>
						<!-- 评论主体 -->
						<div class="content">
							<div class="text">
								<div class="name">{{item.user.nickname}}</div>
								<p >{{item.content}}</p>
							</div>
							<!-- 评论回复 -->
							<div class="replay" v-if="item.beReplied.length==1" >
								<div class="text">
									<div class="name" >@{{item.beReplied[0].user.nickname}}</div>
									<p >{{item.beReplied[0].content}}</p>
								</div>
							</div>
							<!-- 日期点赞 -->
							<div class="date">
								{{setDatePlus(item.time)}}
								<div class="likes">
									<span class="iconfont icon-dianzan"> </span>
									<div class="likedCount">
										{{item.likedCount}}
									</div>
								</div>
							</div>
						</div>
					</li>
					<!-- 分页 -->
					<div class="pagination page">
						<el-pagination class="pagin" @current-change="pageChange" layout="prev, pager, next"
							:total="total" :page-size='20' :current-page="page">
						</el-pagination>
					</div>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				page: 1, ///起始页码
				comments: '', //评论数据
				hotComments: [], //热门评论
				total: 0, //分页总数
			}
		},
		mounted() {
			if(this.id!=0){
				this.getComments()
			}
		},
		props:{
			theId:{
				default:0
			},
			theScrollTop:{
				default:0
			},
			mode:{
				default:'music'
			},
			parentNode:{
				default:1
			}
		} ,
		computed:{
			id(){
				return this.theId
			},
			scrollTop(){
				return this.theScrollTop
			},
			
		},
		watch: {
			id: function() {
				if(this.id!=0){
					this.page = 1
					this.getComments()
					if(this.parentNode==1){
						this.$refs.comment.parentNode.scrollTop=0
					}else if(this.parentNode==2){
						this.$refs.comment.parentNode.parentNode.scrollTop=0
					}else if(this.parentNode==3){
						this.$refs.comment.parentNode.parentNode.parentNode.scrollTop=0
					}else if(this.parentNode==4){
						this.$refs.comment.parentNode.parentNode.parentNode.parentNode.scrollTop=0
					}
				}	
			}, //改变歌单id时刷新重新获取数据
		},
		methods: {
			// 获取评论
			getComments() {
				let offset =(this.page - 1) * 20
				axios({
					url: '/comment/'+this.mode,
					method: 'get',
					params: {
						id: this.id,
						limit: 20,
						offset: offset,
						time:new Date().getTime()
					}
				}).then((res) => {
					this.comments = res.data.comments
					this.hotComments = res.data.hotComments
					this.total = res.data.total
					if(this.mode=='album'){
						this.$store.commit('setCommentTotal',this.total)
					}	
				})
			}, //获取歌单评论
			setDatePlus(date) {
				var t = new Date(date).toLocaleString();
				t = /(.+)\/(.+)\/(.+) (.+:.+):.+/gm.exec(t)
				t = (t[1] == new Date().getFullYear() ? '' : t[1] + '年') + t[2] + '月' + t[3] + '日' + ' ' + t[4]
				return t;
			}, //评论时间戳
			pageChange(page) {
				console.log(this.scrollTop);
				this.page = page
				this.getComments()
				if(this.parentNode==1){
					this.$refs.comment.parentNode.scrollTop=this.scrollTop
				}else if(this.parentNode==2){
					this.$refs.comment.parentNode.parentNode.scrollTop=this.scrollTop
				}else if(this.parentNode==3){
					this.$refs.comment.parentNode.parentNode.parentNode.scrollTop=this.scrollTop
				}else if(this.parentNode==4){
					this.$refs.comment.parentNode.parentNode.parentNode.parentNode.scrollTop=this.scrollTop
				}			
			}, //页面改变绑定
		}
	}
</script>

<style scoped lang="less">
	
	.pagination {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 15px;
		margin-bottom: 20px;
		/deep/.el-pager li {
			background-color: transparent;
			color: rgba(255, 255, 255, 0.9);
	
			&:hover {
				color: aquamarine;
			}
		}
	
		/deep/.el-pager li.active {
			color: aquamarine;
		}
	
		/deep/ .el-pagination button {
			background-color: transparent;
			color: rgba(255, 255, 255, 0.9);
	
			&:hover {
				color: aquamarine;
				transition: 0.3s;
			}
		}
	}
	
	.comment {
		width: 100%;
		.title {
			width: 100%;
			display: flex;
			align-items: center;
			font-size: 20px;
			font-weight: 500;
			font-size: 18px;

		}

		.comments {
			transform: translateX(5px);
			width: 98%;
			ul {
				margin-top: 10px;
				li {
					width:100%;
					display: flex;
					font-size: 18px;
					flex-wrap: wrap;
					padding: 5px 0;
					border-top: 1.5px solid rgba(200,200,200,0.4);

					.img {
						height: 40px;
						width: 40px;
						border-radius: 20px;
						overflow: hidden;
						display: flex;
						margin-right: 5px;
						transform: translateX(-6px);

						img {
							width: 100%;
							opacity: 0.95;
						}
					}

					.content {
						flex: 1;
						width: 90%;
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						line-height: 30px;

						.text {
							width: 100%;
							font-size: 16px;
							line-height: 24px;
							.name {
								display: inline-block;
								color: rgba(255,255,255,0.9);
								margin-right: 4px;
								cursor: default;

							}

							color:rgba(255,255,255,0.9);
						}

						.replay {
							border: 1.6px solid rgba(255,255,255,0.9);
							padding: 1px 0 7px 0;
							width: 100%;
							border-radius: 5px;
							align-items: center;
							display: flex;
							flex-wrap: wrap;
							padding-left: 5px;

							.text {
								width: 100%;

								.name {
									display: inline-block;
									color: #efefef;
									margin-right: 4px;
									cursor: default;
								}

								color:#fff;
							}
						}

						.date {
							display: flex;
							width: 100%;
							color: #efefef;
							line-height: 20px;
							cursor: default;
							margin-bottom: 5px;
							margin-top: 5px;
							font-size: 14px;
							.likes {
								display: flex;
								flex: 1;
								justify-content: flex-end;
								transform: translateY(4px);

								span {
									margin-right: 5px;
								}

								.likedCount {
									margin-right: 5px;
								}

							}
						}
					}

				}

				li:first-child {
					border-top: none;
				}
			}
		}

	}
</style>
