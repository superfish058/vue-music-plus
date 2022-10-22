<template>
	<div style="padding: 20px 20px 20px 18px;height: 100%;box-sizing: border-box;overflow-y: scroll;" v-infinite-scroll="load" infinite-scroll-delay="300"
		infinite-scroll-distance="50" ref="playListPage" class="PlayList">
		<!-- 专辑信息区 -->
		<el-row style="margin-bottom: 10px;height: 230px;position: relative;margin-top: 10px;">
			<el-col :span="6" v-if="playListInfo.coverImgUrl">
				<el-image :src="playListInfo.coverImgUrl" fit="cover" style="width: 90%;aspect-ratio: 1;">
				</el-image>
			</el-col>
			<el-col :span="18" style="position: relative;height: 100%;">
				<el-row>
					<span class="textIcon" style="position: absolute;top: 5px;">歌单</span>
					<span v-show="showDesc" style="position: absolute;top: -3px;left: 50px;font-size: 30px;">
						{{playListInfo.name}}
					</span>
					<!-- 简介 -->
					<span class="funcIcon" style="position: absolute;top: 5px;right:60px">
						简介&nbsp;
						<i :class="'el-icon-caret-'+ (!showDesc?'bottom':'top')" @click="showDesc=!showDesc"></i>
					</span>
					<p v-show="showDesc" class="descInfo">{{playListInfo.description}}</p>
				</el-row>
				<el-row style="font-weight: 700;position: absolute;top: 25px;left: -7px;width: 100%;">
					<p style="font-size: 80px;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
						margin: 0;height: 115px;display: flex;align-items: center;" ref="autoSize" v-show="!showDesc">
						{{playListInfo.name}}
					</p>
				</el-row>
				<el-row style="position: absolute;bottom: 18px;">
					<!-- 创作者 -->
					<div v-if="playListInfo.creator"
						style="display: flex;align-items: center;margin-bottom: 10px;transition: 0.4s ease;"
						ref="creator">
						<el-image :src="playListInfo.creator.avatarUrl+'?param=100y100'" fit="cover" style="width: 35px; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;"></el-image>
						<span ref="creatorName">{{playListInfo.creator.nickname}}</span>
					</div>
					<!-- 创作时间+专辑长度 -->
					<div style="letter-spacing: 0.2px;transition: 0.3s ease;" ref="createrInfo">
						<span>{{setDate(playListInfo.createTime)}}</span>
						<span style="font-size: 20px;margin: 0 1px 0 2px;">·</span>
						<span>{{playListInfo.trackCount+'首歌曲'}}</span>
					</div>
				</el-row>
			</el-col>
		</el-row>
		<!-- 歌曲信息区 -->
		<el-row>
			<el-row class="songRow">
				<span class="iconfont icon-24gf-playCircle playIcon" @click="sendList()"></span>
				<el-table :data="playListSongs" style="width: 100%;border-radius: 10px;">
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
								<span v-for="item,index in scope.row.ar" :key="index" class="hover"
									style="margin-right: 5px;cursor: pointer;" @click="turnSingerPage(item.id)">
									{{item.name}}
								</span>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column label="专辑" width="300">
						<template slot-scope="scope">
							<el-row>
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
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				playListInfo: '', //歌单信息
				playListSongs: [], //歌单歌曲
				showDesc: false, //简介是否展示
				offset:0
			}
		},
		computed: {
			listId() {
				return this.$route.query.listId
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.playListSongs = []
				vc.offset = 0
				vc.getPlayListInfo()
				vc.getAllListSongs()
				vc.showDesc = false				
				vc.$nextTick(() => {
					vc.$refs.playListPage.scrollTop = 0
					vc.$store.state.localTop = 'PlayList'
				})
			})
		},
		watch: {
			showDesc() {
				this.showDetail()
			}
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
			load(){
				if(this.$route.path!='/main/playlist') return
				if (this.offset >= this.playListSongs.length ||!this.playListSongs.length%50) return
				this.offset = this.playListSongs.length
				this.getAllListSongs()
			},
			//展示歌单简介
			showDetail() {
				if (this.showDesc) {
					let nameWidth = this.$refs.creatorName.getBoundingClientRect().width
					this.$refs.creator.style.transform = "translateY(41px)"
					this.$refs.createrInfo.style.transform = 'translateX(' + (nameWidth + 50) + 'px' + ')'
				} else {
					this.$refs.creator.style.transform = "none"
					this.$refs.createrInfo.style.transform = "none"
				}
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
			//获取歌单信息
			getPlayListInfo() {
				this.$http.get('/playlist/detail', {
					params: {
						id: this.listId
					}
				}).then(res => {
					this.playListInfo = res.data.playlist
					this.setSize()
				})
			},
			getAllListSongs(id) {
				this.$http.get('/playlist/track/all', {
					params: {
						id: this.listId,
						limit:50,
						offset:this.offset
					}
				}).then(res => {
					this.playListSongs = this.playListSongs.concat(res.data.songs)  
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
				return year + '年创建'
			},
			setSize() {
				this.$nextTick(() => {
					if (this.playListInfo.description == null) {
						this.playListInfo.description = '此用户没有创建相关简介喵(,,•́ . •̀,,)'
					}
					if (this.playListInfo.name.length > 22) {
						this.$refs.autoSize.style.fontSize = '32px'
					} else if (this.playListInfo.name.length > 15) {
						this.$refs.autoSize.style.fontSize = '38px'
					} else if (this.playListInfo.name.length > 9) {
						this.$refs.autoSize.style.fontSize = '50px'
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
				this.playListSongs.forEach(item => {
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

	.textIcon {
		border: 1px solid rgba(255, 255, 255, 0.9);
		padding: 2px 4px 3px 3px;
		border-radius: 3px;
	}

	.funcIcon {
		transform: translateY(5px);
		user-select: none;

		i:hover {
			cursor: pointer;
		}
	}

	.descInfo {
		position: absolute;
		top: 24px;
		height: 121px;
		width: 650px;
		font-size: 18px;
		border: 1px solid rgba(255, 255, 255, 0.9);
		padding: 2px 5px;
		border-radius: 3px;
		overflow-y: scroll;

		p {
			padding: 0;
			line-height: 30px;
			margin: 0;
		}
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
