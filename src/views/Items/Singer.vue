<template>
	<div style="padding: 20px 20px 20px 18px" v-infinite-scroll="load" infinite-scroll-delay="300"
		infinite-scroll-distance="50" ref="singerPage">
		<!-- 歌手背景图 -->
		<el-row v-if="singerInfo.artist">
			<el-col :span="6">
				<el-image :src="singerInfo.artist.cover" fit="cover"
					style="width: 90%;aspect-ratio: 1;border-radius: 50%;">
				</el-image>
			</el-col>
			<el-col :span="18">
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
					<span v-if="singerInfo.artist.identifyTag" class="idTag">{{singerInfo.artist.identifyTag[0]}}</span>
					<span v-for="item,index in singerInfo.artist.identities" :key="index" class="idTags">
						{{item}}
					</span>
				</el-row>
			</el-col>
		</el-row>
		<el-row style="margin-top: 10px;">
			<div class="tags" ref="tags">
				<span v-for="item,index in tags" :key="index" @click="changeTag(item)" :tabindex="index">{{item}}</span>
			</div>
		</el-row>
		<!-- 歌手热门歌曲 -->
		<el-row class="songRow" v-if="tagsActive == '热门歌曲'">
			<span class="iconfont icon-24gf-playCircle playIcon" @click="sendList()"></span>
			<el-table :data="hotSongs" style="width: 100%;border-radius: 10px;">
				<el-table-column label="#" type="index" width="50">
				</el-table-column>
				<el-table-column label="标题" width="75">
					<template slot-scope="scope">
						<el-image :src="scope.row.al.picUrl+'?param=200y200'" style="width:100%;aspect-ratio: 1;cursor: pointer;"
							fit="cover" @click="playMusic(scope.row.id)">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column width="460">
					<template slot-scope="scope">
						<el-row style="display: flex;align-items: center;">
							{{scope.row.name}}
							<span class="iconfont icon-shipin" style="color:aquamarine;opacity: 0.9;font-size: 20px;margin-left: 5px;cursor: pointer;" 
								v-if="scope.row.mv" @click="turnMvPage(scope.row.mv)"></span>
						</el-row>
						<el-row :gutter="5">
							<span v-for="item,index in scope.row.ar" :key="index"
								style="margin-right: 5px;cursor: pointer;" class="hover"
								@click="turnSingerPage(item.id)">
								{{item.name}}
							</span>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="专辑" width="300">
					<template slot-scope="scope">
						<el-row v-if="scope.row">
							<span @click="turnAlbumPage(scope.row.al.id)" style="cursor: pointer;" class="hover">
								{{scope.row.al.name}}
							</span>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="时长" width="70">
					<template slot-scope="scope">
						{{setDtime(scope.row.dt)}}
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<!-- 最新专辑 -->
		<el-row v-if="tagsActive=='最新专辑'">
			<el-card class="hotResult">
				<el-col :span="6" v-for="item,index in albums" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" v-if="item" :src="item.blurPicUrl+'?param=400y400'"
						@click="turnAlbumPage(item.id)"></el-image>
					<div style="width: 100%;height: 34px;">
						<p class="main-p" v-if="item">{{item.name}}</p>
					</div>
				</el-col>
			</el-card>
		</el-row>
		<!-- 歌手视频 -->
		<el-row v-if="tagsActive=='歌手MV'">
			<el-card>
				<el-row :gutter="30" style="margin-top: 20px;">
					<el-col :span="8" v-for="item,index in videos" :key="index" class="personalized-image">
						<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.imgurl16v9+'?param=568y320'" fit="cover"
							@click="turnMvPage(item.id)">
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
		<el-row v-if="tagsActive=='歌手详情'">
			<el-card>
				<div v-if="SingerDesc.length > 0">
					<el-row v-for="item,index in SingerDesc" :key="index" class="singerDesc">
						<p>{{item.ti}}</p>
						<p>{{item.txt}}</p>
					</el-row>
				</div>
				<el-row v-if="SingerDesc.length == 0">
					{{singerInfo.artist.briefDesc}}
				</el-row>
			</el-card>
		</el-row>
		<!-- 歌手界面 -->
		<el-row v-if="tagsActive=='相似歌手'">
			<el-card class="hotResult">
				<p style="font-size: 22px;font-weight: 700;margin-left: 15px;margin-bottom: 10px;">歌手</p>
				<el-col :span="6" v-for="item,index in simiSingers" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" :src="item.img1v1Url+'?param=300y300'" class="img-hidden" fit="cover"
						@click="turnSingerPage(item.id)">
					</el-image>
					<div style="width: 100%;height: 30px;">
						<p class="main-p">{{item.name}}</p>
					</div>
				</el-col>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				singerInfo: '', //歌手信息
				hotSongs: [], //歌手热门歌曲
				albums: [], //歌手专辑
				offset: 0,
				videos: [], //歌手视频
				simiSingers: [], //相似歌手
				SingerDesc: '', //歌手介绍
				tagsActive: '热门歌曲',
				tags: ['热门歌曲', '最新专辑', '歌手MV', '歌手详情', '相似歌手'],
				singerId: ''
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				if (vc.singerId == vc.$route.query.singerId) return
				vc.singerId = vc.$route.query.singerId
				vc.getSingerInfo()
				vc.getSingerHotSongs()
				vc.getSingerAlbums()
				vc.getSingerVideos()
				vc.getSimiSingers()
				vc.getSingerDesc()
				vc.albums = []
				vc.videos = []
				vc.offset = 0
				vc.tagsActive = '热门歌曲'
				vc.$nextTick(() => {
					vc.tags.forEach((item, ind) => {
						vc.$refs.tags.childNodes[ind].style = 'none'
					})
					vc.$refs.tags.childNodes[0].style = 'background:#ffffff;color:#121212'
					vc.$refs.singerPage.parentNode.scrollTop = 0
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
			this.getSimiSingers()
			this.getSingerDesc()
			this.$nextTick(() => {
				this.tags.forEach((item, ind) => {
					this.$refs.tags.childNodes[ind].style = 'none'
				})
				this.$refs.tags.childNodes[0].style = 'background:#ffffff;color:#121212'
				this.$refs.singerPage.parentNode.scrollTop = 0
			})
			next()
		},
		methods: {
			//跳转MV页面
			turnMvPage(id) {
				this.$router.push({
					path: '/main/video',
					query: {
						mvId: id
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
			//跳转专辑页面
			turnAlbumPage(id) {
				this.$router.push({
					path: '/main/album',
					query: {
						albumId: id
					}
				})
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
				if(this.$route.path!='/main/singer') return
				if (this.tagsActive === '最新专辑') {
					if (this.offset >= this.albums.length) return
					this.offset = this.albums.length
					this.getSingerAlbums()
				}
				if (this.tagsActive == '歌手MV') {
					if (this.offset >= this.videos.length ) return
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
			getSimiSingers() {
				this.$http.get('/simi/artist', {
					params: {
						id: this.singerId
					}
				}).then(res => {
					this.simiSingers = res.data.artists
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
	* {
		transform: translate3d(0, 0, 0);
		scroll-behavior: smooth;
		color: rgba(255, 255, 255, 0.9);
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
		padding: 15px 20px;
	}

	.songRow {
		.el-table {
			background-color: transparent;
		}

		.el-image {
			transform: translateY(3px);
		}

		.playIcon {
			position: absolute;
			font-size: 26px;
			color: rgba(255, 255, 255, 0.9);
			top: -35px;
			right: 20px;
			transition: 0.2s ease;

			&:hover {
				cursor: pointer;
				transform: translateY(-3px);
				filter: contrast(0.7);
			}
		}

		/deep/.el-table--scrollable-x .el-table__body-wrapper {
			overflow-x: hidden;
		}

		/deep/table {
			border-spacing: 0;
		}

		/deep/.el-table__cell {
			color: rgba(255, 255, 255, 0.9);
			padding: 3px 0;
			background-color: transparent;
		}

		/deep/tr {
			background-color: #121212;
			opacity: 0.9;
		}

		/deep/th.el-table__cell {
			padding: 10px 0;
			background-color: transparent;
			color: rgba(255, 255, 255, 0.9);
			overflow: visible;
		}

		/deep/.el-table__row {
			background-color: #121212;
			opacity: 0.9;

		}

		/deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #2a2a2a;

		}

		/deep/.el-table__row>td {
			border: none;
		}


		.el-table::before {
			height: 0px;
		}

		/deep/.el-table th.is-leaf {
			/* 去除上边框 */
			border: none;
		}
	}

	.tags {
		margin: 7px 0 13px 0;
		margin-bottom: 20px;

		span {
			margin-right: 10px;
			background-color: #232323;
			padding: 8px 12px;
			border-radius: 10px;
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
