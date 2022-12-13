<template>
	<div v-infinite-scroll="load" infinite-scroll-delay="300" infinite-scroll-distance="50" ref="userPage"
		class="UserPage">
		<!-- PC -->
		<el-row style="margin-bottom: 10px;" class="PC">
			<el-col :span="6">
				<el-image :src="hzPlayList[0].al.picUrl+'?param=500y500'" fit="cover" v-if="hzPlayList.length"
					style="width: 90%;aspect-ratio: 1;">
				</el-image>
				<el-image :src="defaultImg" fit="cover" v-show="!hzIds" style="width: 90%;aspect-ratio: 1;"></el-image>
				<el-skeleton v-show="!hzPlayList.length&&hzIds" style="width: 90%;aspect-ratio: 1;">
					<template slot="template">
						<el-skeleton-item variant="image" style="width: 100%;height: 100%;" />
					</template>
				</el-skeleton>
			</el-col>
			<el-col :span="18" style="position: relative;height: 100%;">
				<el-row>
					<span class="textIcon" style="position: absolute;top: 5px;">用户歌单</span>
				</el-row>
				<el-row style="position: absolute;top: 25px;left: -7px;width: 100%;">
					<p style="font-size: 55px;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
						margin: 0;height: 115px;display: flex;align-items: center;">
						皇子音乐专属歌单
					</p>
				</el-row>
			</el-col>
		</el-row>
		<!-- mobile -->
		<el-row style="margin-bottom: 10px;margin-top: 10px;padding-left: 5px;" class="mobile">
			<el-col :span="7">
				<el-image :src="hzPlayList[0].al.picUrl+'?param=500y500'" fit="cover" v-if="hzPlayList.length"
					style="width: 25vw;height: 25vw;">
				</el-image>
				<el-image :src="defaultImg" fit="cover" v-show="!hzIds" style="width: 25vw;height: 25vw;"></el-image>
				<el-skeleton v-show="!hzPlayList.length&&hzIds" style="width: 25vw;height: 25vw;">
					<template slot="template">
						<el-skeleton-item variant="image" style="width: 100%;height: 100%;" />
					</template>
				</el-skeleton>
			</el-col>
			<el-col :span="17">
				<el-row style="font-size: 14px;margin-top: 5px;">
					<span class="textIcon">用户歌单</span>
				</el-row>
				<el-row>
					<p style="font-size: 22px;margin-top: 10px;">
						皇子音乐专属歌单
					</p>
				</el-row>
			</el-col>
		</el-row>
		<!-- 歌曲信息区 -->
		<el-row>
			<div v-if="!hzIds" style="width: 100%;text-align: center;font-size: 22px;margin-top: 20px;">快去添加喜欢的歌曲吧</div>
			<songList :songList="hzPlayList" v-if="hzIds"></songList>
		</el-row>
	</div>
</template>

<script>
	import songList from '@/components/songList'
	export default {
		data() {
			return {
				hzPlayList: [], //皇子音乐歌单
				offset: 0,
				setOffset: false,
				defaultImg: require('@/assets/logoImg.png')
			}
		},
		components: {
			songList
		},
		computed: {
			hzIds() {
				return this.$store.state.hzIds
			}
		},
		mounted() {
			this.setHzIds()
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.setHzIds()
				vc.getListDetail()
				if (vc.$store.state.listChange) {
					vc.hzPlayList = []
					vc.offset = 0
					vc.setOffset = false

				}
				vc.$nextTick(() => {
					vc.$refs.userPage.scrollTop = 0
					vc.$store.state.localTop = 'UserPage'
					vc.$store.state.localPage = '我的'
				})
			})
		},
		methods: {
			getListDetail() {
				let ids = this.$store.state.hzIds
				if (!ids) {
					this.hzPlayList = []
					return
				}
				this.$http.get('/song/detail', {
					params: {
						ids
					}
				}).then(res => {
					this.hzPlayList = res.data.songs
				})
			},
			//设置hzId
			setHzIds() {
				let hzIds = localStorage.getItem('hzIds')
				if (hzIds != null && !hzIds.includes('undefined')) {
					this.$store.state.hzIds = hzIds
				} else {
					localStorage.setItem('hzIds', '')
				}
			},
			//获取本地收藏音乐
			getHzlist() {
				let hzids = []
				hzids = localStorage.getItem('hzids')
			},
			load() {
				this.offset = this.hzPlayList.length
				// this.getHzPlayList()
			},
			//设置播放列表
			sendList() {
				let ids = ''
				let idsArr = ''
				this.hzPlayList.forEach(item => {
					ids += (item.id + ',')
				})
				ids = ids.slice(0, -1)
				this.$store.state.musicInfo.forEach(item => {
					idsArr = (item.id + ',')
				})
				idsArr = idsArr.slice(0, -1)
				if (ids == idsArr && ids != '') return
				this.$store.dispatch('sendList', ids)
			},


		}
	}
</script>

<style scoped lang="less">
	/deep/.el-skeleton {
		height: 100%;
	}

	@media screen and(max-width:850px) {
		.UserPage {
			padding: 0 !important;
		}
	}

	.UserPage {
		padding: 20px 20px 20px 18px;
		height: 100%;
		overflow-y: scroll;
		box-sizing: border-box;
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
