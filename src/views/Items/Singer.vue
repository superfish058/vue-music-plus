<template>
	<div v-infinite-scroll="load" infinite-scroll-delay="300" infinite-scroll-distance="50" ref="singerPage"
		class="Singer">
		<!-- 歌手背景图 -->
		<el-row style="margin-top: 10px;">
			<el-col :span="!this.$store.state.mobileMode?6:8" >
				<div class="mobile">
					<el-image :src="singerInfo.artist.cover+'?param=570y570'" fit="cover" v-if="singerInfo.artist"
						style="width: 29vw;height: 29vw;border-radius: 50%;">
					</el-image>
					<el-skeleton style="width: 29vw;height: 29vw;" :loading="!singerInfo.artist"
						animated v-show="!singerInfo.artist">
						<template slot="template">
							<el-skeleton-item variant="image" style="width: 100%;height: 100%;border-radius: 50%;" />
						</template>
					</el-skeleton>
				</div>
				<div class="PC">
					<el-image :src="singerInfo.artist.cover+'?param=570y570'" fit="cover" v-if="singerInfo.artist"
						style="width: 90%;aspect-ratio:1;border-radius:50%;transform: translateX(5%);"> 
					</el-image>
					<el-skeleton style="width: 90%;aspect-ratio:1;;border-radius: 50%;transform: translateX(5%);" :loading="!singerInfo.artist"
						animated v-show="!singerInfo.artist">
						<template slot="template">
							<el-skeleton-item variant="image" style="width: 100%;height: 100%;border-radius:50%;transform: translateX(5%);" />
						</template>
					</el-skeleton>
				</div>
			</el-col>
			<el-col :span="!this.$store.state.mobileMode?18:16">
				<el-skeleton :rows="3" animated :style="!this.$store.state.mobileMode?'transform: translate(7%,18%);width:90%':'transform: translateY(5%);width:90%'"  
					v-show="!singerInfo.artist" /> 
				<div v-if="singerInfo.artist">
					<div class="PC">
						<el-row>
							<p style="font-size: 40px;font-weight: 700;margin: 20px 0;">{{singerInfo.artist.name}}</p>
						</el-row>
						<el-row class="singerInfo">
							<el-col :span="4">
								<span>{{singerInfo.artist.musicSize}}</span>
								<span>单曲数</span>
							</el-col>
							<el-col :span="4">
								<span>{{singerInfo.artist.albumSize}}</span>
								<span>专辑数</span>
							</el-col>
							<el-col :span="4">
								<span>{{singerInfo.artist.mvSize}}</span>
								<span>视频数</span>
							</el-col>
						</el-row>
						<el-row style="margin-top: 30px;">
							<span v-if="singerInfo.artist.identifyTag"
								class="idTag">{{singerInfo.artist.identifyTag[0]}}</span>
							<span v-for="item,index in singerInfo.artist.identities" :key="index" class="idTags">
								{{item}}
							</span>
						</el-row>
					</div>
					<div class="mobile">
						<el-row >
							<p style="font-size: 20px;margin: 4vw 0;text-align: center;">{{singerInfo.artist.name}}</p>
						</el-row>
						<el-row class="singerInfo" style="transform:translateX(0)">
							<el-col :span="8">
								<span>{{singerInfo.artist.musicSize}}</span>
								<span>单曲数</span>
							</el-col>
							<el-col :span="8">
								<span>{{singerInfo.artist.albumSize}}</span>
								<span>专辑数</span>
							</el-col>
							<el-col :span="8">
								<span>{{singerInfo.artist.mvSize}}</span>
								<span>视频数</span>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row style="margin-top: 10px;">
			<div class="tags" ref="tags" v-if="!$store.state.mobileMode">
				<span v-for="item,index in tags" :key="index" @click="changeTag(item)">
					{{item}}
				</span>
			</div>
			<div class="tags" ref="tags" v-if="$store.state.mobileMode">
				<span v-for="item,index in tags" :key="index" @click="changeTag(item)">
					{{mobileTags[index]}}
				</span>
			</div>
		</el-row>
		<!-- 歌手热门歌曲 -->
		<el-row class="songRow" v-if="tagsActive == '热门歌曲'">
			<songList :songList="hotSongs"></songList>
		</el-row>
		<!-- 最新专辑 -->
		<el-row v-if="tagsActive=='最新专辑'">
			<el-card class="hotResult">
				<el-col :span="!$store.state.mobileMode?6:8" v-for="item,index in albums" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" v-if="item" :src="item.blurPicUrl+'?param=400y400'"
						lazy @click="turnAlbumPage(item.id)"></el-image>
					<div style="width: 100%;height: 34px;">
						<p class="main-p" v-if="item">{{item.name}}</p>
					</div>
				</el-col>
			</el-card>
		</el-row>
		<!-- 歌手视频 -->
		<el-row v-if="tagsActive=='歌手MV'">
			<el-card>
				<el-row :gutter="30" style="margin-top: 20px;padding: 0 10px;">
					<div v-show="!videos.length" style="font-size: 22px;margin-top: 20px;">
						<p>此歌手尚未拍摄相关视频喵</p>
					</div>
					<el-col :span="!$store.state.mobileMode?8:12" v-for="item,index in videos" :key="index" class="personalized-image">
						<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.imgurl16v9+'?param=568y320'"
							fit="cover" lazy @click="turnMvPage(item.id)">
						</el-image>
						<div style="height: 40px;font-size: 16px;">
							<p style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
								font-size: 18px; width: 100%;margin-bottom: 5px;margin-top: 5px;">
								{{item.name}}
							</p>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
		<!-- 歌手详情 -->
		<el-row v-if="tagsActive=='歌手详情'" >
			<el-card>
				<div style="padding: 0 10px;">
					<div v-if="SingerDesc.length > 0">
						<el-row v-for="item,index in SingerDesc" :key="index" class="singerDesc">
							<p>{{item.ti}}</p>
							<p>{{item.txt}}</p>
						</el-row>
					</div>
					<el-row v-if="SingerDesc.length == 0">
						<p>{{singerInfo.artist.briefDesc}}</p>
					</el-row>
				</div>
			</el-card>
		</el-row>
		</div>
</template>

<script>
	import {
		turnAlbumPage,
		turnMvPage,
		turnSingerPage
	} from '@/utils'
	import songList from '@/components/songList'
	export default {
		data() {
			return {
				singerInfo: '', //歌手信息
				hotSongs: [], //歌手热门歌曲
				albums: [], //歌手专辑
				offset: 0,
				videos: [], //歌手视频
				SingerDesc: '', //歌手介绍
				tagsActive: '热门歌曲',
				tags: ['热门歌曲', '最新专辑', '歌手MV', '歌手详情'],
				mobileTags: ['热门', '专辑', 'MV', '详情'],
				singerId: ''
			}
		},
		components: {
			songList
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				if (vc.singerId == vc.$route.query.singerId) return
				vc.singerId = vc.$route.query.singerId
				vc.getSingerInfo()
				vc.getSingerHotSongs()
				vc.getSingerAlbums()
				vc.getSingerVideos()
				vc.getSingerDesc()
				vc.albums = []
				vc.videos = []
				vc.offset = 0
				vc.tagsActive = '热门歌曲'
				vc.$nextTick(() => {
					vc.tags.forEach((item, ind) => {
						vc.$refs.tags.childNodes[ind].style = 'none'
					})
					vc.$store.state.localTop = 'Singer'
					vc.$store.state.localPage = '歌手'
					vc.$refs.tags.childNodes[0].style = 'background:#ffffff;color:#121212'
					vc.$refs.singerPage.scrollTop = 0
				})
			})
		},
		beforeRouteUpdate(to, from, next) {
			this.singerId = to.query.singerId
			this.albums = []
			this.videos = []
			this.offset = 0
			this.tagsActive = '热门歌曲'
			this.getSingerInfo()
			this.getSingerHotSongs()
			this.getSingerAlbums()
			this.getSingerVideos()
			this.getSingerDesc()
			this.$nextTick(() => {
				this.tags.forEach((item, ind) => {
					this.$refs.tags.childNodes[ind].style = 'none'
				})
				this.$refs.tags.childNodes[0].style = 'background:#ffffff;color:#121212'
				this.$refs.singerPage.scrollTop = 0
			})
			next()
		},
		methods: {
			//跳转MV页面
			turnMvPage(id) {
				turnMvPage.call(this, id)
			},
			//跳转歌手页面
			turnSingerPage(id) {
				turnSingerPage.call(this, id)
			},
			//跳转专辑页面
			turnAlbumPage(id) {
				turnAlbumPage.call(this, id)
			},
			//切换标签
			changeTag(tag) {
				let index = this.tags.indexOf(tag)
				this.tags.forEach((item, ind) => {
					this.$refs.tags.childNodes[ind].style = 'none'
				})
				this.$refs.tags.childNodes[index].style = 'background:#ffffff;color:#121212'
				this.tagsActive = tag
				this.offset = 0
			},
			load() {
				if (this.$route.path != '/main/singer') return
				if (this.tagsActive === '最新专辑') {
					if (this.offset >= this.albums.length) return
					this.offset = this.albums.length
					this.getSingerAlbums()
				}
				if (this.tagsActive == '歌手MV') {
					if (this.offset >= this.videos.length) return
					this.offset = this.videos.length
					this.getSingerVideos()
				}
			},
			getSingerInfo() {
				this.$http.get('/artist/detail', {
					params: {
						id: this.singerId
					}
				}).then(res => {
					this.singerInfo = res.data.data
				})
			},
			getSingerHotSongs() {
				this.$http.get('/artist/top/song', {
					params: {
						id: this.singerId
					}
				}).then(res => {
					this.hotSongs = res.data.songs
				})
			},
			getSingerAlbums() {
				this.$http.get('/artist/album', {
					params: {
						id: this.singerId,
						limit: 20,
						offset: this.offset
					}
				}).then(res => {
					this.albums = this.albums.concat(res.data.hotAlbums)
				})
			},
			getSingerVideos() {
				this.$http.get('/artist/mv', {
					params: {
						id: this.singerId,
						limit: 12,
						offset: this.offset
					}
				}).then(res => {
					this.videos = this.videos.concat(res.data.mvs)
				})
			},
			getSingerDesc() {
				this.$http.get('/artist/desc', {
					params: {
						id: this.singerId
					}
				}).then(res => {
					this.SingerDesc = res.data.introduction
				})
			},
			//播放时间格式化
			setDtime(dt) {
				let time = new Date(dt)
				let min = time.getMinutes()
				let sec = time.getSeconds()
				if (min == 0) {
					min = '00'
				}
				if (sec < 10) {
					sec = '0' + sec
				}
				return min + ':' + sec
			},
			//播放单曲
			playMusic(id) {
				this.$store.dispatch('getMusicUrl', id)
			},
			//设置播放列表
			sendList() {
				let ids = ''
				this.hotSongs.forEach(item => {
					ids += (item.id + ',')
				})
				ids = ids.slice(0, -1)
				if (ids == this.$store.state.ids && ids != '') return
				this.$store.dispatch('sendList', ids)
			}
		},

	}
</script>

<style scoped lang="less">
	
	@media screen and (max-width:850px){
		.Singer{
			padding: 0!important;
		}
		/deep/.el-card__body{
			padding: 0;
		}
	}
	
	/deep/.el-skeleton {
		height: 100%;
	}

	.Singer {
		transform: translate3d(0, 0, 0);
		scroll-behavior: smooth;
		padding: 20px 20px 20px 18px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
		p {
			color: rgba(255, 255, 255, 0.9);
		}

		cursor: default;
	}

	.singerDesc {
		margin-bottom: 20px;

		p {
			white-space: pre-wrap;
			margin: 0;
			font-size: 18px;
			line-height: 30px;

			&:first-child {
				font-size: 24px;
				font-weight: 700;
				text-indent: 0;
				line-height: 50px;
			}
		}
	}

	.idTags {
		padding: 2px 3px 3px 2px;
		border: 1px solid #f0f0f0;
		border-radius: 3px;
		color: #f0f0f0;
		opacity: 0.75;
		user-select: none;
		margin-right: 15px;
		background-color: #121212;
	}

	.idTag {
		padding: 2px 2px 3px 2px;
		border: 2px solid #2a2a2a;
		border-radius: 3px;
		background-color: #999999;
		color: #2a2a2a;
		opacity: 0.85;
		user-select: none;
		margin-right: 15px;
	}

	.hotResult {
		/deep/.el-image {
			box-sizing: border-box;
			overflow: visible;
		}

		.img-hidden {
			/deep/img {
				border-radius: 50%;
			}
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 1px rgba(55, 55, 55, 0.8), -1px -1px 2px 1px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}
	}

	.singerInfo {
		transform: translateX(-30px);
		margin-bottom: 20px;

		.el-col {
			border-left: 1px solid rgba(255, 255, 255, 0.9);

			&:first-child {
				border: none
			}

			span {
				font-size: 18px;
				width: 100%;
				display: flex;
				justify-content: center;

				&:first-child {
					letter-spacing: 0.4px;
				}
			}

		}
	}

	.personalized-image {
		/deep/.el-image {
			overflow: visible;
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}
	}

	.recommend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding: 22px 0;
		border-radius: 7px;
		;

		p {
			display: flex;
			justify-content: center;
			margin: 3px 0;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.main-p {
			padding: 0 12px;
			width: auto;
			display: block;
			margin-top: 10px;
			font-size: 20px;
			font-weight: 500;
			text-align: center;
		}

		transition: 0.2s ease;

		&:hover {
			background-color: #2a2a2a;
		}
	}

	.el-card {
		position: relative;
		background-color: #121212;
		opacity: 0.9;
		border: none;
		border-radius: 10px;
	}


	.tags {
		margin-bottom: 10px;
		margin-left: 5px;
		span {
			margin-right: 10px;
			background-color: #232323;
			padding: 8px 12px;
			border-radius: 10px;
			line-height: 45px;
			color: #f0f0f0;
			transition: 0.1 ease;
			cursor: pointer;
			opacity: 0.9;

			&:hover {
				background-color: #ffffff;
				color: #2a2a2a;
			}
		}
	}
</style>
