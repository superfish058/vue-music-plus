<template>
	<div ref="videoPage" class="VideoPage">
		<el-row>
			<!-- 视频主体区 -->
			<el-col :span="!$store.state.mobileMode?15:24" :style="!$store.state.mobileMode?'padding-right: 20px':''">
				<!-- 视频 -->
				<el-row>
					<p style="margin: 10px 0px 15px 3px;;font-size: 22px;font-weight: 700;">视频详情</p>
					<video :src="videoUrl" style="width: 100%;aspect-ratio: 16/9;background-color: #000;" controls
						autoplay></video>
				</el-row>
				<!-- 作者头像 -->
				<el-row style="display: flex;align-items: center;margin-top: 15px;">
					<el-image :src="avatarUrl+'?param=200y200'" v-if="avatarUrl" fit="cover"
						style="width: 46px;aspect-ratio: 1;border-radius: 50%;"></el-image>
					<span style="font-size: 18px;margin-left: 10px;letter-spacing: 0.2px;"
						v-if="creatorId == 0">{{creatorName}}</span>
					<span style="font-size: 18px;margin-left: 10px;letter-spacing: 0.2px;cursor: pointer;" class="hover"
						v-if="creatorId != 0" @click="turnSingerPage(creatorId)">
						{{creatorName}} 
					</span>
				</el-row>
				<!-- 标题和简介 -->
				<el-row style="margin-top: 15px;">
					<p :style="!$store.state.mobileMode?'font-size: 24px':'font-size: 20px'">
						{{title}}
						<span @click="listOn = !listOn" v-if="description" style="font-size: 20px;cursor: pointer;">
							<i class="el-icon-caret-bottom hover" v-show="!listOn"></i>
							<i class="el-icon-caret-top hover" v-show="listOn"></i>
						</span>
					</p>
					<p style="margin-top: 5px;border: 1px solid rgba(255,255,255,0.9);padding: 3px 2px 5px 7px;border-radius: 4px;
						font-size: 18px;letter-spacing: 0.2px;" v-show="listOn">
						{{description}}
					</p>
				</el-row>
				<!-- 发布信息 -->
				<el-row style="margin-top: 8px;" v-if="videoInfo.publishTime">
					<span style="margin-right: 10px;">发布时间：{{setDate(videoInfo.publishTime)}}</span>
					<span :style="$store.state.mobileMode?'display:block;margin-top:8px':''">播放次数：{{resetCount(playTime)}}</span>
				</el-row>
			</el-col>
			<!-- 推荐视频区 -->
			<el-col :span="!$store.state.mobileMode?9:24" style="height: 100%;" v-if="relatedVideos.length">
				<p style="margin: 10px 0 15px 0px;font-size: 22px;">相关推荐</p>
				<el-row v-for="item,index in relatedVideos" :key="index" style="margin-bottom: 15px;"
					class="personalized-image">
					<el-col :span="12">
						<div style="position: relative;">
							<el-image :src="item.coverUrl+'?param=340y190'" fit="cover" @click="turnVideoPage(item)"
								style="width: 95%;aspect-ratio: 16/9;border-radius: 3px;">
							</el-image>
							<span class="count"><i
									class="el-icon-caret-right countIcon"></i>{{resetCount(item.playTime)}}</span>
							<span class="dtime">{{setDtime(item.durationms)}}</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="relatedText">
							<div class="relatedTitle">
								<p>{{item.title}}</p>
							</div>
							<div class="relatedCreator">
								<span v-if="item.type==1" style="word-break: break-all;">
									by&nbsp;{{item.creator[0].userName}}
								</span>
								<span v-if="item.type==0">
									{{item.creator[0].userName}}
								</span>
							</div>
						</div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				videoInfo: {}, //视频信息
				relatedVideos: [], //推荐视频
				videoId: '', //视频Id
				mvId: '', //mvId
				videoUrl: '', //视频地址
				listOn: false, //展开简介
				avatarUrl: '', //头像地址
				creatorName: '',
				description: '',
				playTime: 0,
				title: '',
				creatorId: 0,
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.$store.state.localTop = 'VideoPage'
				vc.$store.state.localPage = '视频'
				vc.listOn = false
				if (vc.$route.query.videoId) {
					vc.mvId = false
					vc.videoId = vc.$route.query.videoId
				} else {
					vc.videoId = false
					vc.mvId = vc.$route.query.mvId
				}
				vc.getVideoInfo()
				vc.$nextTick(() => {
					vc.$refs.videoPage.scrollTop = 0
				})

			})
		},
		beforeRouteUpdate(to, from, next) {
			if (to.query.mvId) {
				this.mvId = to.query.mvId
				this.videoId = false
			} else {
				this.videoId = to.query.videoId
				this.mvId = false
			}
			this.listOn = false
			this.$refs.videoPage.scrollTop = 0
			this.getVideoInfo()
			next()
		},
		methods: {
			turnRecVideoPage(item) {
				this.$router.push({
					path: '/main/recvideo',
					query: {
						id: item.id,
						name: item.name
					}
				})
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
			//跳转视频页面
			turnVideoPage(data) {
				if (!isNaN(parseFloat(data.vid)) && isFinite(data.vid)) {
					this.$router.push({
						path: '/main/video',
						query: {
							mvId: data.vid
						}
					})
				} else {
					this.$router.push({
						path: '/main/video',
						query: {
							videoId: data.vid
						}
					})
				}

			},
			getMvInfo() {
				this.$http.get('/mv/detail', {
					params: {
						mvid: this.mvId
					}
				}).then(res => {
					this.videoInfo = res.data.data
					this.avatarUrl = this.videoInfo.artists[0].img1v1Url
					this.creatorName = this.videoInfo.artistName
					this.creatorId = this.videoInfo.artistId
					this.description = this.videoInfo.desc
					this.playTime = this.videoInfo.playCount
					this.title = this.videoInfo.name

				})
				this.getMvUrl()
				this.getRelatedVideos()
			},
			getVideoInfo() {
				if (this.mvId) {
					this.getMvInfo()
					return
				}
				this.$http.get('/video/detail', {
					params: {
						id: this.videoId
					}
				}).then(res => {
					this.videoInfo = res.data.data
					this.avatarUrl = this.videoInfo.avatarUrl
					this.creatorName = this.videoInfo.creator.nickname
					this.creatorId = 0
					this.description = this.videoInfo.description
					this.playTime = this.videoInfo.playTime
					this.title = this.videoInfo.title
				})
				this.getVideoUrl()
				this.getRelatedVideos()
			},
			getMvUrl() {
				this.$http.get('/mv/url', {
					params: {
						id: this.mvId
					}
				}).then(res => {
					this.videoUrl = res.data.data.url
				})
			},
			getVideoUrl() {
				this.$http.get('/video/url', {
					params: {
						id: this.videoId
					}
				}).then(res => {
					this.videoUrl = res.data.urls[0].url
				})
			},
			getRelatedVideos() {
				let id = 0
				if (this.videoId) {
					id = this.videoId
				} else {
					id = this.mvId
				}
				this.$http.get('/related/allvideo', {
					params: {
						id
					}
				}).then(res => {
					this.relatedVideos = res.data.data
				})
			},
			//格式化日期
			setDate(time) {
				if (this.mvId) return time
				let date = new Date(time)
				let year = date.getFullYear()
				let month = date.getMonth()
				let day = date.getDay()
				return year + '年' + month + '月' + day + '日'
			},
			resetCount(count) {
				let lastCount = count
				if (count / 10000 > 10) {
					lastCount = parseFloat(count / 10000).toFixed(1) + '万'
				}
				return lastCount
			},
			setDtime(dt) {
				let time = new Date(dt)
				let min = time.getMinutes()
				let sec = time.getSeconds()
				if (min == 0) {
					min = '00'
				} else if (min < 10) {
					min = '0' + min
				}
				if (sec < 10) {
					sec = '0' + sec
				}
				return min + ':' + sec
			},
		}

	}
</script>

<style scoped lang="less">
	.VideoPage {
		padding: 0px 20px 20px 18px;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: scroll;
		transform: translate3d(0, 0, 0);
		scroll-behavior: smooth;
		color: rgba(255, 255, 255, 0.9);

		p {
			margin: 0;
			padding: 0;
			cursor: default;
		}

		span {
			cursor: default;
		}
	}

	.personalized-image {
		/deep/.el-image {
			overflow: visible;

			img {
				border-radius: 3px;
			}
		}

		/deep/.el-image__inner {
			opacity: 0.9;
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 2px 1px rgba(55, 55, 55, 0.8), -1px -1px 2px 1px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}
	}

	.relatedText {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;

		.relatedTitle {
			position: absolute;
			left: 3px;
			top: 2px;

			p {
				width: 175px;
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				line-clamp: 3;
				-webkit-line-clamp: 3;
			}

		}

		.relatedCreator {
			position: absolute;
			left: 3px;
			top: 73px;
			font-size: 14px;

			span {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}


	.count {
		position: absolute;
		top: 3px;
		right: 15px;
		text-shadow: 2px 2px 5px #000;
		opacity: 0.85;

		.countIcon {
			color: #fff;
		}
	}

	.dtime {
		opacity: 0.85;
		position: absolute;
		bottom: 7px;
		right: 15px;
		text-shadow: 2px 2px 5px #000;
	}


	.tagFont {
		display: inline-block;
		margin-bottom: 11px;
		padding: 2px 3px 3px 2px;
		border: 1px solid #121212;
		border-radius: 3px;
		color: #121212;
		opacity: 0.9;
		user-select: none;
		margin-right: 15px;
		background-color: #f5f5f5;
		cursor: pointer;

		&:hover {
			color: #fff;
			background-color: #121212;
			border: 1px solid #fff;
		}
	}
</style>
