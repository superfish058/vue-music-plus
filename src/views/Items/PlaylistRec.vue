<template>
	<div style="height: 100%;overflow: auto;" ref="scrollBack" class="playListRec">
		<!-- 头部精品歌单预览区 -->
		<div class="listBanner" v-if="localBanner"   >
			<div class="imgArea">
				<el-image :src="localBanner.coverImgUrl" fit="cover" style="width: 100%;height: 100%;"></el-image>
			</div>
			<div class="infoArea">
				<div class="classTitle">
					<p @click="turnPlayListPage(localBanner.id)">精品歌单</p>
				</div>
				<div class="infoText">
					<p>{{localBanner.name}}</p>
				</div>
			</div>
		</div>
		<!-- 标签区域 -->
		<div class="tagArea">
			<div class="allTag">
				<span @click="showAllTags">
					{{localTag}}
					<i class="el-icon-arrow-right"></i>
				</span>
			</div>
			<!-- 展开标签区域 -->
			<div class="extags" v-show="showTag">
				<div v-for="(item,index) in allTags" :key="index" class="extagRow">
					<div class="exleft">
						<span>{{tagCates[index]}}</span>
					</div>
					<div class="exright">
						<span v-for="(it,ind) in item" :key="ind" @click="localTag=it[0]">{{it[0]}}</span>
					</div>
				</div>
			</div>
			<!-- 热门标签 -->
			<div class="hotTag PC" ref="hotTag" >
				<span v-for="(item,index) in hotTags" :key="index" @click="setSelectStyle(item)">
					{{item}}
				</span>
			</div>
		</div>
		<!-- 歌单展示区 -->
		<div class="playListArea">
			<div class="listOut">
				<div class="listInner" v-for="(item,index) in playListRec" :key="index">
					<playListBox :item="item"></playListBox>
				</div>
			</div>
		</div>
		<!-- 分页区域 -->
		<div class="pagination">
			<div class="PC">
				<el-pagination :page-size="8" :pager-count="9" layout="prev, pager, next" :total="pageSize"
					@current-change="pageChange" :current-page="listPage" >
				</el-pagination>
			</div>
			<div class="mobile">
				<el-pagination :page-size="8" :pager-count="5" layout="prev, pager, next" :total="pageSize"
					@current-change="pageChange" :current-page="listPage" >
				</el-pagination>
			</div>
			
		</div>

	</div>
</template>

<script>
	import playListBox from '@/components/playListBox'
	import {
		turnPlayListPage
	} from '@/utils/index'
	export default {
		data() {
			return {
				allTags: [], //全部标签
				tagCates: [], //标签分类
				hotTags: [], //热门标签
				playListRec: [], //相关歌单
				listBanners: [], //头部歌单展示
				localTag: '华语', //当前标签
				listPage: 1, //当前页码
				localBanner: null, //当前头部展示信息
				showTag: false, //展示标签
				pageSize: 64, //页码尺寸
			}
		},
		mounted() {
			this.getAllTags()
			this.getHotTags()
			this.getListBanner()
			this.getplayListRec()
		},
		components: {
			playListBox
		},
		watch: {
			localTag() {
				this.showTag = false
				this.listPage = 1
				this.setSelectStyle(this.localTag)
				this.getListBanner()
				this.getplayListRec()
				this.changePageSize()
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.$nextTick(() => {
					vc.$store.state.localPage = '推荐歌单'
					vc.$store.state.localTop = 'playListRec'
				})
		
			})
		},
		methods: {
			//跳转歌单
			turnPlayListPage(id){
				turnPlayListPage.call(this,id)
			},
			//改变页码
			pageChange(pagenum) {
				this.listPage = pagenum
				this.getplayListRec()
				this.$refs.scrollBack.scrollTop = '0px'
			},
			//改变页码尺寸
			changePageSize() {
				this.allTags.forEach(item => {
					item.forEach(it => {
						if (it[0] == this.localTag) {
							this.pageSize = it[1]
						}
					})
				})
			},
			//展示全部标签
			showAllTags() {
				this.showTag = !this.showTag
			},
			//设置选中样式
			setSelectStyle(tagitem) {
				let hotTags = this.hotTags
				let index = hotTags.findIndex(res => res == tagitem)
				hotTags.forEach((item, ind) => {
					this.$refs.hotTag.childNodes[ind].className = ""
				})
				if (index == -1) return
				this.$refs.hotTag.childNodes[index].className = "selected"
				this.localTag = tagitem
			},
			//获取热门标签
			getHotTags() {
				this.$http.get('/playlist/hot').then(res => {
					let hotTags_before = res.data.tags
					let hotTags = []
					hotTags_before.forEach(item => {
						hotTags.push(item.name)
					})
					this.hotTags = hotTags
					this.$nextTick(() => {
						this.setSelectStyle('华语')
						this.changePageSize()
					})

				})
			},
			// 获取全部标签
			getAllTags() {
				this.$http.get('/playlist/catlist').then(res => {
					this.tagCates = Object.values(res.data.categories)
					let allTags = res.data.sub
					let allTagPlus = []
					this.tagCates.forEach(item => {
						allTagPlus.push([])
					})
					allTags.forEach(item => {
						allTagPlus[item.category].push([item.name, item.resourceCount])
					})
					this.allTags = allTagPlus
				})
			},
			getListBanner() {
				this.$http.get('/top/playlist/highquality', {
					params: {
						cat: this.localTag,
						limit: 20
					}
				}).then(res => {
					this.listBanners = res.data.playlists
					let index = Math.round(Math.random() * 19);
					this.localBanner = this.listBanners[index]
				})
			},
			getplayListRec() {
				this.$http.get('/top/playlist', {
					params: {
						cat: this.localTag,
						offset: (this.listPage - 1) * 8,
						limit: 8
					}
				}).then(res => {
					this.playListRec = res.data.playlists
				})
			}
		},
	}
</script>

<style scoped lang="less">
	p,
	span {
		opacity: 0.9;
		cursor: default;
	}

	.listBanner {
		width: 91.5%;
		margin: 10px auto;
		display: flex;
		flex-wrap: wrap;
		
		
		.imgArea {
			flex: 2;
			width: 100%;
			aspect-ratio: 1;
			overflow: hidden;
		}

		.infoArea {
			flex: 8;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;

			.classTitle {
				flex: 1;
				margin-left: 3%;
				display: flex;
				align-items: center;

				p {
					border: 1.5px solid rgba(249, 250, 251, 0.5);
					background: radial-gradient(circle, rgba(92, 110, 114, 0.2) 0%, rgba(118, 174, 241, 0.1) 100%);
					padding: 2px 7px;

					&:hover {
						cursor: pointer;
						background: rgba(255, 255, 255, 0.1);
					}
				}
			}
		}

		.infoText {
			flex: 1;
			margin-left: 3%;
			font-size: 28px;
			opacity: 0.9;
		}
		
		
		@media screen and (max-width:650px) {
			.imgArea {
				flex:3;
				
			}
			
			.infoArea{
				flex:7;
			}
			
			.infoText{
				font-size: 20px;
			}
		}
	}

	.tagArea {
		position: relative;
		width: 91.5%;
		margin: 5px auto;
		display: flex;
		justify-content: space-between;

		.allTag {
			user-select: none;
			border: 1.5px solid white;
			padding: 2px 0 1px 10px;
			border-radius: 3px;

			span {
				cursor: pointer;
			}

			i {
				transform: translate(-30%, 1%);
			}
		}

		.extags {
			position: absolute;
			z-index: 99;
			top: 130%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.9);
			border: 1.5px solid rgba(255, 255, 255, 0.8);
			border-radius: 5px;

			.extagRow {
				display: flex;
				flex-wrap: wrap;
				padding: 5px 0;

				.exleft {
					flex: 1;
					display: flex;
					padding-left: 10px;

					span {
						margin: 4px 5px;
					}
				}

				.exright {
					flex: 9;
					display: flex;
					flex-wrap: wrap;

					span {
						margin: 4px 5px;
						cursor: pointer;
						border-bottom: 1.5px solid transparent;

						&:hover {
							border-bottom: 2px solid rgba(255, 255, 255, 0.9);
							transition: 0.3s ease-out;
						}
					}
				}
			}
		}

		.hotTag {
			span {
				margin: 0 3px;
				display: inline-block;
				padding: 2px;
				cursor: pointer;
				border: 1.5px solid transparent;
			}

			.selected {
				border: 1.5px solid white;
				border-radius: 3px;
				cursor: default;
			}
		}


	}

	.playListArea {
		width: 100%;
		display: flex;
		justify-content: center;

		.listOut {
			width: 95%;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.listInner {
				width: 25%;
			}
			@media screen and (max-width:650px) {
				.listInner {
					width: 50%;
				}
			}
		}
		
		@media screen and (max-width:650px) {
			.listOut{
				width: 100%;
			}
		}
		
	}

	// 分页样式
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
</style>
