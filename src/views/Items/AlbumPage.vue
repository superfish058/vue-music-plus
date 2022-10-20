<template>
	<div style="padding: 20px 20px 20px 18px;" ref="albumPage">
		<!-- 专辑信息区 -->
		<el-row style="margin-bottom: 10px;height: 230px;position: relative;margin-top: 10px;">
			<el-col :span="6" v-if="albumInfo.picUrl">
				<el-image :src="albumInfo.picUrl" fit="cover" style="width: 90%;aspect-ratio: 1;">
				</el-image>
			</el-col>
			<el-col :span="18" style="position: relative;height: 100%;">
				<el-row><span class="textIcon" style="position: absolute;top: 5px;">专辑</span></el-row>
				<el-row style="font-weight: 700;position: absolute;top: 25px;left: -7px;width: 100%;">
					<p style="font-size: 80px;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
						margin: 0;height: 115px;display: flex;align-items: center;" ref="autoSize" v-if="albumInfo">
						{{albumInfo.name}}
					</p>
				</el-row>
				<el-row style="position: absolute;bottom: 18px;">
					<!-- 歌手 -->
					<div v-if="albumInfo.artist" style="display: flex;align-items: center;margin-bottom: 10px;cursor: pointer;">
						<el-image :src="albumInfo.artist.img1v1Url+'?param=100y100'" fit="cover" style="width: 35px; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;"></el-image>
							<div class="hover" @click="turnSingerPage(albumInfo.artist.id)">
								<span v-if="albumInfo" >{{albumInfo.artist.name}}</span>
								<span v-if="albumInfo.artist.alias.length">{{'('+albumInfo.artist.alias[0]+')'}}</span>
							</div>	
					</div>
					<!-- 创作时间+专辑长度 -->
					<div style="letter-spacing: 0.2px;">
						<span>{{setDate(albumInfo.publishTime)}}</span>
						<span style="font-size: 20px;margin: 0 1px 0 2px;">·</span>
						<span>{{albumInfo.size+'首歌曲'}}</span>
					</div>
				</el-row>
			</el-col>
		</el-row>
		<!-- 歌曲信息区 -->
		<el-row>
			<el-row class="songRow">
				<span class="iconfont icon-24gf-playCircle playIcon" @click="sendList()"></span>
				<el-table :data="albumSongs" style="width: 100%;border-radius: 10px;">
					<el-table-column label="#" type="index" width="50">
					</el-table-column>
					<el-table-column label="标题" width="75">
						<template slot-scope="scope">
							<el-image :src="scope.row.al.picUrl+'?param=200y200'" style="width:100%;aspect-ratio: 1;cursor: pointer;"
								fit="cover" @click="playMusic(scope.row.id)">
							</el-image>
						</template>
					</el-table-column>
					<el-table-column width="760">
						<template slot-scope="scope">
							<el-row style="display: flex;align-items: center;">
								{{scope.row.name}}
								<span class="iconfont icon-shipin" style="color:aquamarine;opacity: 0.9;font-size: 20px;margin-left: 5px;cursor: pointer;" 
									v-if="scope.row.mv" @click="turnMvPage(scope.row.mv)"></span>
							</el-row>
							<el-row :gutter="5">
								<span v-for="item,index in scope.row.ar" :key="index" class="hover"
									style="margin-right: 5px;cursor: pointer;" @click="turnSingerPage(item.id)">
									{{item.name}}
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
		</el-row>
		<!-- 专辑简介区 -->
		<el-row class="albumDesc">
			<span>专辑详情</span>
			<p>{{albumInfo.description}}</p>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				albumInfo: '',
				albumSongs: []
			}
		},
		computed: {
			albumId() {
				return this.$route.query.albumId
			}
		},
		mounted() {
			this.getAlbums()
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.getAlbums()
				vc.$nextTick(() => {
					vc.$refs.albumPage.parentNode.scrollTop = 0
				})

			})
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
			getAlbums() {
				this.$http.get('/album', {
					params: {
						id: this.albumId
					}
				}).then(res => {
					this.albumInfo = res.data.album
					this.albumSongs = res.data.songs
					this.setSize()
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
			setDate(date) {
				let year = new Date(date).getFullYear()
				return year + '年发表'
			},
			setSize() {
				this.$nextTick(() => {
					if (this.albumInfo.name.length > 22) {
						this.$refs.autoSize.style.fontSize = '40px'
					} else if (this.albumInfo.name.length > 16) {
						this.$refs.autoSize.style.fontSize = '50px'
					} else if (this.albumInfo.name.length > 9) {
						this.$refs.autoSize.style.fontSize = '60px'
					} else {
						this.$refs.autoSize.style.fontSize = '80px'
					}
				})
			},
			//播放单曲
			playMusic(id) {
				this.$store.dispatch('getMusicUrl', id)
			},
			//设置播放列表
			sendList() {
				let ids = ''
				this.albumSongs.forEach(item => {
					ids += (item.id + ',')
				})
				ids = ids.slice(0, -1)
				if (ids == this.$store.state.ids && ids != '') return
				this.$store.dispatch('sendList', ids)
			}
		}
	}
</script>

<style scoped lang="less">
	* {
		transform: translate3d(0, 0, 0);
		scroll-behavior: smooth;
	}

	.albumDesc {
		margin-top: 12px;
		padding: 10px;
		padding-bottom: 20px;
		border-radius: 10px;
		background-color: #121212;
		opacity: 0.9;
		color: rgba(255, 255, 255, 0.9);

		span {
			width: 100;
			display: flex;
			font-size: 26px;
			margin-bottom: 10px;
			font-weight: 700;
		}

		p {
			text-indent: 2em;
			margin: 0;
			font-size: 18px;
			line-height: 26px;
		}
	}

	.textIcon {
		border: 1px solid rgba(255, 255, 255, 0.9);
		padding: 2px 4px 3px 3px;
		border-radius: 3px;
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
</style>
