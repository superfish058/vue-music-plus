<template>
	<div ref="playListPage" class="PlayList" v-infinite-scroll="load" infinite-scroll-delay="300"
		infinite-scroll-distance="50">
		<!-- 歌单信息区 PC-->
		<el-row class="playlistInfoArea PC">
			<!-- 歌单封面 -->
			<el-col :span="6" style="height: 100%;">
				<el-image :src="playListInfo.coverImgUrl" fit="cover" style="width: 85%;aspect-ratio: 1;"
					v-if="playListInfo.coverImgUrl">
				</el-image>
				<el-skeleton style="width: 85%;aspect-ratio: 1" :loading="skeLoading" animated v-show="skeLoading">
					<template slot="template">
						<el-skeleton-item variant="image" style="width:100%;height: 100%;"/>  
					</template>
				</el-skeleton>
			</el-col>
			<!-- 主要信息区 -->
			<el-col :span="18" style="position: relative;height: 100%;">
				<el-row class="mainInfo">
					<span class="textIcon">歌单</span>
					<span v-show="showDesc" class="playlistInfoName">
						{{playListInfo.name}}
					</span>
					<!-- 简介 -->
					<span class="funcIcon" v-show="playListInfo.description">
						简介&nbsp;<i :class="'el-icon-caret-'+ (!showDesc?'bottom':'top')"
							@click="showDesc=!showDesc"></i>
					</span>
					<p v-show="showDesc" class="descInfo">{{playListInfo.description}}</p>
				</el-row>
				<!-- 歌单名称Plus -->
				<el-row class="listNamePlus">
					<el-skeleton :rows="4" :loading="skeLoading" animated v-show="skeLoading" />
					<p ref="autoSize" v-show="!showDesc">
						{{playListInfo.name}}
					</p>
				</el-row>
				<!-- 创建信息 -->
				<el-row style="position: absolute;bottom: 18px;">
					<!-- 创作者 -->
					<div v-if="playListInfo.creator"
						style="display: flex;align-items: center;margin-bottom: 5px;transition: 0.4s ease;"
						ref="creator">
						<el-image :src="playListInfo.creator.avatarUrl+'?param=100y100'" fit="cover" style="width: 35px; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;" lazy></el-image>
						<span ref="creatorName">{{playListInfo.creator.nickname}}</span>
					</div>
					<!-- 创作时间+专辑长度 -->
					<div style="letter-spacing: 0.2px;transition: 0.3s ease;" ref="createrInfo"
						v-show="playListInfo.createTime">
						<span>{{setDate(playListInfo.createTime)}}</span>
						<span style="font-size: 20px;margin: 0 1px 0 2px;">·</span>
						<span>{{playListInfo.trackCount+'首歌曲'}}</span>
					</div>
				</el-row>
			</el-col>
		</el-row>

		<!-- 歌单信息区 mobile-->
		<el-row class="mobile" style="height: 35vw;padding: 15px 5px;">
			<el-col :span="8" style="height: 100%;">
				<el-image :src="playListInfo.coverImgUrl" fit="cover" style="width: 85%;aspect-ratio: 1;"
					v-if="playListInfo.coverImgUrl">
				</el-image>
				<el-skeleton style="width: 85%;aspect-ratio: 1;" :loading="skeLoading" animated v-show="skeLoading">
					<template slot="template">
						<el-skeleton-item variant="image" style="width: 90%;height: 90%;" />
					</template>
				</el-skeleton>
			</el-col>
			<el-col :span="16" style="height: 100%;">
				<div style="display: flex;flex-direction: column;height: 100%;">
					<el-skeleton :rows="3" :loading="skeLoading" animated v-show="skeLoading" />
					<div style="flex:2;">
						<p style="font-size: 20px;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;line-clamp: 2;">{{playListInfo.name}}</p>
					</div>					
					<div style="flex:1;display: flex;align-items: center;height: 100%;" v-if="playListInfo.creator">
						<el-image :src="playListInfo.creator.avatarUrl+'?param=100y100'" fit="cover" style="width: 9vw;; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;" lazy></el-image>
						<span>{{playListInfo.creator.nickname}}</span>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row style="width: 100%;padding: 0 5px;opacity: 0.9;" v-show="playListInfo.description" class="mobile">
			<p :style="showDescMobile?'':'overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 100%;'" 
				v-tap="()=>{showDescMobile= !showDescMobile}">
				简介：{{playListInfo.description||'此歌单暂未添加任何简介喵'}}
			</p>
		</el-row>
		
		<!-- 歌曲信息区 -->
		<el-row style="margin-top: 10px;" >
			<songList :songList="playListSongs||[]"></songList>
		</el-row>
	</div>


</template>

<script>
	import songList from '@/components/songList'
	export default {
		data() {
			return {
				playListInfo: '', //歌单信息
				playListSongs: [], //歌单歌曲
				showDesc: false, //简介是否展示
				offset: 0,
				skeLoading: true, //骨架屏加载标识
				firstSet: false,
				showDescMobile:false,//展示简介标识
			}
		},
		components: {
			songList
		},
		computed: {
			listId() {
				return this.$route.query.listId
			}
		},
		mounted() {
			this.getPlayListInfo()
			this.getAllListSongs()
		},
		watch: {
			showDesc() {
				this.showDetail()
			},
			listId() {
				this.reload()
			}
		},
		methods: {
			reload() {
				if (!this.listId) return
				this.$refs.playListPage.scrollTop = 0
				this.$store.state.localTop = 'PlayList'
				this.$store.state.localPage = '歌单'
				this.offset = 0
				this.playListSongs = []
				this.getPlayListInfo()
				this.getAllListSongs()
				this.showDesc = false
			},
			//加载更多
			load() {
				if (this.$route.path != '/main/playlist') return
				if (this.offset >= this.playListSongs.length || !this.playListSongs.length % 50) return
				this.offset = this.playListSongs.length
				this.getAllListSongs()
			},
			//展示歌单简介
			showDetail() {
				if (this.showDesc) {
					let nameWidth = this.$refs.creatorName.getBoundingClientRect().width
					this.$refs.creator.style.transform = "translateY(36px)"
					this.$refs.createrInfo.style.transform = 'translateX(' + (nameWidth + 50) + 'px' + ')'
				} else {
					this.$refs.creator.style.transform = "none"
					this.$refs.createrInfo.style.transform = "none"
				}
			},
			//获取歌单信息
			async getPlayListInfo() {
				let res = await this.$http.get('/playlist/detail', {
					params: {
						id: this.listId
					}
				})
				this.playListInfo = res.data.playlist
				this.setSize()
				this.skeLoading = false
			},
			async getAllListSongs(id) {
				let res = await this.$http.get('/playlist/track/all', {
					params: {
						id: this.listId,
						limit: 50,
						offset: this.offset
					}
				})
				this.playListSongs = this.playListSongs.concat(res.data.songs)
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
					if (this.playListInfo.name.length > 20) {
						this.$refs.autoSize.style.fontSize = '28px'
					} else if (this.playListInfo.name.length > 15) {
						this.$refs.autoSize.style.fontSize = '32px'
					} else if (this.playListInfo.name.length > 9) {
						this.$refs.autoSize.style.fontSize = '42px'
					} else {
						this.$refs.autoSize.style.fontSize = '54px'
					}
				})
			}
		}

	}
</script>

<style scoped lang="less">
	.PlayList {
		padding: 20px 20px 20px 18px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;

		.playlistInfoArea {
			margin-bottom: 10px;
			height: 20vw;
			margin-top: 10px;
		}

		.mainInfo {
			padding-top: 5px;

			.textIcon {
				border: 1px solid rgba(255, 255, 255, 0.9);
				padding: 2px 4px 3px 3px;
				border-radius: 3px;
				position: relative;

				span {
					position: absolute;
					top: 5px;
				}
			}

			.playlistInfoName {
				position: absolute;
				top: -4px;
				left: 50px;
				font-size: 27px;
				width: 82%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.funcIcon {
				transform: translateY(5px);
				user-select: none;
				position: absolute;
				top: 3px;
				right: 0px;

				i:hover {
					cursor: pointer;
				}
			}

			.descInfo {
				position: absolute;
				z-index: 2;
				top: 36px;
				height: 96px;
				line-height: 24px;
				width: 100%;
				font-size: 18px;
				border: 1px solid rgba(255, 255, 255, 0.9);
				padding: 2px 5px;
				border-radius: 3px;
				overflow-y: scroll;

			}
		}

		.listNamePlus {
			width: 100%;
			height: 75px;
			font-weight: 700;
			position: relative;
			top: 15px;
			left: -7px;

			p {
				font-size: 54px;
				height: 100%;
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin: 0;
			}
		}


	}

	/deep/.el-skeleton {
		height: 100%;
	}

	@media screen and (max-width:850px) {
		.PlayList {
			padding: 0 !important;
		}


	}
</style>
