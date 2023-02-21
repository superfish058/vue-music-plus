<template>
	<div ref="albumPage" class="Album">
		<!-- 专辑信息区 -->
		<el-row class="infoArea PC">
			<el-col :span="7" style="padding-left: 10px;">
				<el-image :src="albumInfo.picUrl" fit="cover" style="width: 80%;aspect-ratio: 1;"
					v-if="albumInfo.picUrl">
				</el-image>
				<el-skeleton style="width: 80%;aspect-ratio: 1;" :loading="!albumInfo.picUrl" animated
					v-show="!albumInfo.picUrl">
					<template slot="template">
						<el-skeleton-item variant="image" style="width: 100%;height: 100%;" />
					</template>
				</el-skeleton>
			</el-col>
			<el-col :span="15" style="position: relative;height: 100%;">
				<el-row><span class="textIcon" style="position: absolute;top: 5px;">专辑</span></el-row>
				<el-skeleton :rows="4" :loading="!albumInfo.picUrl" animated style="position: relative;top: 45px;" />
				<el-row style="font-weight: 700;position: absolute;top: 25px;left: -7px;width: 100%;">
					<p style="font-size: 80px;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
						margin: 0;height: 115px;display: flex;align-items: center;" ref="autoSize" v-if="albumInfo">
						{{albumInfo.name}}
					</p>
				</el-row>
				<el-row style="position: absolute;bottom: 35px;" >
					<!-- 歌手 -->
					<div v-if="albumInfo.artist" style="display: flex;align-items: center;margin-bottom: 10px;">
						<el-image :src="albumInfo.artist.img1v1Url+'?param=100y100'" fit="cover" style="width: 35px; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;" ></el-image>
						<div class="hover" @click="turnSingerPage(albumInfo.artist.id)" style="cursor: pointer;">
							<span v-if="albumInfo">{{albumInfo.artist.name}}</span>
							<span v-if="albumInfo.artist.alias.length">{{'('+albumInfo.artist.alias[0]+')'}}</span>
						</div>
					</div>
					<!-- 创作时间+专辑长度 -->
					<div style="letter-spacing: 0.2px;" v-show="albumInfo.publishTime">
						<span>{{setDate(albumInfo.publishTime)}}</span>
						<span style="font-size: 20px;margin: 0 1px 0 2px;">·</span>
						<span>{{albumInfo.size+'首歌曲'}}</span>
					</div>
				</el-row>
			</el-col>
		</el-row>

		<!-- 专辑信息区 mobile-->
		<el-row class="mobile" style="height: 35vw;padding: 15px 5px;">
			<el-col :span="8" style="height: 100%;">
				<el-image :src="albumInfo.picUrl" fit="cover" style="width: 90%;aspect-ratio: 1;"
					v-if="albumInfo.picUrl">
				</el-image>
				<el-skeleton style="width: 90%;aspect-ratio: 1;" :loading="!albumInfo.picUrl" animated
					v-show="albumInfo.picUrl">
					<template slot="template">
						<el-skeleton-item variant="image" style="width: 90%;height: 90%;" />
					</template>
				</el-skeleton>
			</el-col>
			<el-col :span="16" style="height: 100%;">
				<div style="display: flex;flex-direction: column;height: 100%;" v-if="albumInfo.artist">
					<el-skeleton :rows="3" :loading="!albumInfo.picUrl" animated v-show="albumInfo.picUrl" />
					<div style="flex:2;">
						<p style="font-size: 20px;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;line-clamp: 2;">
							{{albumInfo.name}}</p>
					</div>
					<div style="flex:1;display: flex;align-items: center;height: 100%;" v-if="albumInfo.artist.name">
						<el-image :src="albumInfo.artist.img1v1Url+'?param=100y100'" fit="cover" style="width: 9vw;; aspect-ratio: 1;
							border-radius: 50%;margin-right: 5px;" lazy></el-image>
						<span @click="turnSingerPage(albumInfo.artist.id)">{{albumInfo.artist.name}}</span>
					</div>
				</div>
			</el-col>
		</el-row>

		<!-- 歌曲信息区 -->
		<el-row>
			<songList :songList="albumSongs"></songList>
		</el-row>
		<!-- 专辑简介区 -->
		<el-row class="albumDesc">
			<span>专辑详情</span>
			<p>{{albumInfo.description||'专辑尚未添加详情'}}</p>
		</el-row>
	</div>
</template>

<script>
	import songList from '@/components/songList'
	import {
		turnSingerPage
	} from '@/utils/index'
	export default {
		data() {
			return {
				albumInfo: '',
				albumSongs: []
			}
		},
		components: {
			songList
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
					vc.$store.state.localPage = '专辑'
					vc.$store.state.localTop = 'Album'
				})

			})
		},
		methods: {
			//跳转歌手
			turnSingerPage(id) {
				turnSingerPage.call(this, id)
			},
			//获取专辑信息
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
			setDate(date) {
				let year = new Date(date).getFullYear()
				return year + '年发表'
			},
			setSize() {
				this.$nextTick(() => {
					if (this.albumInfo.name.length > 20) {
						this.$refs.autoSize.style.fontSize = '28px'
					} else if (this.albumInfo.name.length > 15) {
						this.$refs.autoSize.style.fontSize = '32px'
					} else if (this.albumInfo.name.length > 9) {
						this.$refs.autoSize.style.fontSize = '42px'
					} else {
						this.$refs.autoSize.style.fontSize = '54px'
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.Album {
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;

		.infoArea {
			margin-bottom: 10px;
			height: 230px;
			position: relative;
			margin-top: 10px;
		}
	}


	.albumDesc {
		margin-top: 20px;
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

	/deep/.el-skeleton {
		height: 100%;
	}
</style>
