<template>
	<div style="padding: 20px 20px 20px 18px" v-infinite-scroll="load" infinite-scroll-delay="300"
		infinite-scroll-distance="50" ref="recVideoPage">
		<el-row>
			<el-card>
				<el-row style="position: relative;top: 10px;">
					<span class="selectTag taghover" @click="showAllTags()">{{selectTag}}<i
							class="el-icon-arrow-right"></i></span>
					<!-- 全部展示标签 -->
					<div ref="tagRow" class="tagRow ">
						<span v-for="item,index in videoTags" :key="index" @click="changeTag(item.id,index)"
							class="videoTag taghover">{{item.name}}</span>
					</div>
					<!-- 默认展示标签 -->
					<div ref="tagRowPlus" style="position: absolute; right: 0;top: 0;">
						<span v-for="item,index in defaultTags" :key="index" @click="changeDefaultTag(index)"
							class="defaultTag taghover">
							{{item}}
						</span>
					</div>
				</el-row>
				<el-row :gutter="30" style="margin-top: 20px;">
					<el-col :span="8" v-for="item,index in videoList" :key="index" class="personalized-image" >
						<div v-if="item.data">
							<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.data.coverUrl+'?param=570y320'" fit="cover"
								@click="turnVideoPage(item.data)">
							</el-image>
							<div style="height: 64px;font-size: 16px;">
								<p style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
									font-size: 18px; width: 100%;margin-bottom: 5px;margin-top: 5px;">
									<span v-if="item.data.title">{{item.data.title}}</span>
									<span v-if="item.data.name">{{item.data.name}}</span>
								</p>
								<p v-if="item.type==2" class="main-p">
									<span v-for="it,ind in item.data.artists" :key="ind" @click="turnSingerPage(it.id)"
										class="hover">
										{{it.name}}
									</span>
								</p>
								<p v-if="item.type==1" style="text-align: justify;word-break: break-all;" class="main-p">
									by&nbsp;{{item.data.creator.nickname}}
								</p>
							</div>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				videoList: [], //视频信息
				offset: 0, //视频偏移量
				videoTags: [], //视频标签
				defaultTags: ['现场', '舞蹈', 'MV', '流行', '演唱会', '最佳饭制', 'ACG音乐'], //默认标签
				defaultTagId: [], //默认标签Id
				defaultTagIndex: [], //默认标签对应下标
				allTagIndex: '', //选中标签对应下标
				tagId: 58100,
				showTags: false, //展示标签
				setOk: false, //获取视频标志
				selectTag: '现场'
			}
		},
		mounted() {
			this.getVideoTags()
			this.getVideoLists()

		},
		beforeRouteEnter(to, from, next) {
			if (from.path != '/main/video') {
				next(vc => {
					if(!vc.$store.state.userId) return
					vc.$nextTick(() => {
						vc.$refs.recVideoPage.parentNode.scrollTop = 0
					})

				})
			} else {
				next(vc => {
					vc.$nextTick(() => {
						vc.$refs.recVideoPage.parentNode.scrollTop = 0
						vc.selectTag = to.query.name
						let name = to.query.name
						vc.allTagIndex = -1
						vc.changeTag(to.query.id, vc.findIndex(name))
						vc.tagId = to.query.id
					})
				})
			}

		},
		watch: {
			showTags() {
				if (this.showTags) {
					this.$refs.tagRow.style.height = '332px'
				} else {
					this.$refs.tagRow.style.height = 0
				}
			}
		},
		methods: {
			//跳转视频页面
			turnVideoPage(data) {
				let id = ''
				if (data.id) {
					id = data.id
					this.$router.push({
						path: '/main/video',
						query: {
							mvId: id
						}
					})
				} else {
					id = data.vid
					this.$router.push({
						path: '/main/video',
						query: {
							videoId: id
						}
					})
				}
			},
			//跳转歌手页面
			turnSingerPage(id) {
				this.$router.push({
					path: '/main/singer',
					query: {
						singerId: id
					}
				})
			},
			//展示全部标签
			showAllTags() {
				this.showTags = !this.showTags
				if (this.showTags) {
					this.videoTags.forEach((item, ind) => {
						this.$refs.tagRow.childNodes[ind].style = "none"
					})
					if (this.allTagIndex == -1) return
					this.$refs.tagRow.childNodes[this.allTagIndex].style.background = "#fff"
					this.$refs.tagRow.childNodes[this.allTagIndex].style.color = "#121212"
					this.$refs.tagRow.childNodes[this.allTagIndex].style.border = "1px solid #121212"
				}
			},
			load() {
				if (this.$route.path != '/main/recvideo') return
				if (!this.setOk || this.offset > this.videoList.length) return
				this.offset = this.videoList.length
				this.getVideoLists()
			},
			//根据标签名字找到标签下标
			findIndex(name) {
				let theIndex = -1
				this.videoTags.forEach((item, index) => {
					if (item.name == name) {
						theIndex = index
						return
					}
				})
				return theIndex
			},
			//改变视频标签
			changeTag(id, index) {
				if (this.tagId == id) return
				this.tagId = id
				this.offset = 0
				this.videoList = []
				this.getVideoLists()
				this.showTags = false
				//判断默认标签颜色改变
				this.defaultTags.forEach((item, ind) => {
					this.$refs.tagRowPlus.childNodes[ind].style = "none"
				})
				if (index == -1) return
				//判断全部标签颜色改变
				this.allTagIndex = index
				this.selectTag = this.videoTags[index].name
				this.$refs.tagRow.childNodes[index].style.background = "#fff"
				this.$refs.tagRow.childNodes[index].style.color = "#121212"
				this.$refs.tagRow.childNodes[index].style.border = "1px solid #121212"
				if (this.defaultTags.indexOf(this.selectTag) == -1) {
					this.defaultTags.forEach((item, ind) => {
						this.$refs.tagRowPlus.childNodes[ind].style = "none"
					})
				} else {
					this.defaultTags.forEach((item, ind) => {
						this.$refs.tagRowPlus.childNodes[ind].style = "none"
					})
					let index = this.defaultTags.indexOf(this.selectTag)
					this.$refs.tagRowPlus.childNodes[index].style.background = "#fff"
					this.$refs.tagRowPlus.childNodes[index].style.color = "#121212"
					this.$refs.tagRowPlus.childNodes[index].style.border = "1px solid #121212"
				}

			},
			//改变默认标签视频
			changeDefaultTag(index) {
				if (this.defaultTags[index] == this.selectTag) return
				this.selectTag = this.defaultTags[index]
				this.allTagIndex = this.defaultTagIndex[index]
				this.tagId = this.defaultTagId[index]
				this.defaultTags.forEach((item, ind) => {
					this.$refs.tagRowPlus.childNodes[ind].style = "none"
				})
				this.$refs.tagRowPlus.childNodes[index].style.background = "#fff"
				this.$refs.tagRowPlus.childNodes[index].style.color = "#121212"
				this.$refs.tagRowPlus.childNodes[index].style.border = "1px solid #121212"
				this.offset = 0
				this.videoList = []
				this.getVideoLists()
				if (this.showTags) {
					this.showTags = false
				}
			},
			getVideoTags() {
				this.$http.get('/video/group/list').then(res => {
					this.videoTags = res.data.data
					this.setVideoDefaultId()
				})
			},
			setVideoDefaultId() {
				let ids = []
				let num = 0
				let counts = this.defaultTags.length
				for (let num = 0; num < counts; num++) {
					this.videoTags.forEach((item, index) => {
						if (item.name == this.defaultTags[num]) {
							this.defaultTagId.push(item.id)
							this.defaultTagIndex.push(index)
						}
					})
				}
				this.allTagIndex = this.defaultTagIndex[0]
				this.$refs.tagRowPlus.childNodes[0].style.background = "#fff"
				this.$refs.tagRowPlus.childNodes[0].style.color = "#121212"
				this.$refs.tagRowPlus.childNodes[0].style.border = "1px solid #121212"
			},
			getVideoLists() {
				if(!this.$store.state.userId||!this.$store.state.hzId){
					this.$message('请先登录哦')
					return
				}
				this.setOk = false
				this.getVideoList()
				this.offset += 8
				setTimeout(() => {
					this.getVideoList()
					this.offset += 8
					setTimeout(() => {
						this.getVideoList()
						this.offset += 8
						this.setOk = true
					}, 200)
				}, 100)

			},
			getVideoList() {
				let offset = this.offset
				this.$http.get('/video/group', {
					params: {
						offset,
						id: this.tagId
					}
				}).then(res => {
					this.videoList = this.videoList.concat(res.data.datas)
				})
			}
		}
	}
</script>

<style scoped lang="less">
	* {
		color: rgba(255, 255, 255, 0.9);
		cursor: default;
		user-select: none;
		transform: translate3d(0, 0, 0);
		scroll-behavior: smooth;


		p {
			margin: 0;
			padding: 0;
		}
	}

	.taghover {
		cursor: pointer;
		transition: 0.1s ease;

		i {
			cursor: pointer;
		}

		&:hover {
			background-color: #fff;
			color: #121212;
			border: 1px solid #121212;

			i {
				color: #121212;
			}
		}
	}

	.tagRow {
		border-radius: 5px;
		transition: 0.3s ease;
		height: 0;
		overflow: hidden;
	}


	.videoTag {
		display: inline-block;
		padding: 2px 3px 3px 2px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.defaultTag {
		display: inline-block;
		padding: 2px 3px 3px 2px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 15px;
	}

	.selectTag {
		display: inline-block;
		padding: 2px 3px 3px 8px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 10px;
		margin-bottom: 10px;
	}


	.personalized-image {
		/deep/.el-image {
			overflow: visible;
		}

		/deep/.el-image__inner {
			opacity: 0.9;
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}

		.main-p {
			font-size: 16px !important;
			width: auto;
			display: block;
			margin-top: 7px;
			font-size: 20px;

			span {
				display: flex;
			}
		}
	}

	.el-card {
		position: relative;
		background-color: #121212;
		opacity: 0.9;
		border: none;
		border-radius: 10px;
		padding: 15px 20px;
	}
</style>
