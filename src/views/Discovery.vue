<template>
	<div style="padding: 20px;box-sizing: border-box;height: 590px;transform: translate3d(0, 0, 0);overflow-y:scroll;">
		<div style="position: relative; top: 0;height: 220px;">
			<el-carousel :interval="4000" type="card" height="190px" trigger="click" ref="carousel">
				<el-carousel-item v-for="(item,index) in banners" height="200px" :key="index">
						<el-image style="position: absolute;border-radius: 5px;height: 190px;" :src="item.imageUrl"
							fit="fill" @click="turnRelatedPage(item,index)">
							<div slot="error" class="image-slot">
								<i class="el-icon-loading"></i>
								<span>loading</span>
							</div>
						</el-image>
					<span class="banner-text">{{item.typeTitle}}</span>
				</el-carousel-item>
			</el-carousel>
		</div>
		<!-- 推荐歌单 -->
		<el-row class="fontstyle">
			<el-row>
				<p style="font-size: 18px;letter-spacing: 0.1em;margin:30px 0 20px 0 ;">
					<i class="el-icon-cloudy" style="font-size: 20px;"></i>
					推荐歌单
					<i class="el-icon-arrow-right" style="font-size: 20px;transform: translate(-8px,1px);"></i>
				</p>
			</el-row>
			<el-col :span="6" v-for="item,index in personalized" :key="index">
				<el-row class="personalized-image" v-if="item.picUrl">
					<el-image style="width:80%; aspect-ratio: 1; border-radius: 5px;" :src="item.picUrl+'?param=450y450'" fit="cover"
						@click="turnPlayListPage(item.id)" >
						<div slot="error" class="image-slot">
							<i class="el-icon-loading"></i>
							<span>loading</span>
						</div>
					</el-image>
				</el-row>
				<el-row>
					<p class="personalized-desc" v-if="item">{{item.name}}</p>
				</el-row>
			</el-col>
		</el-row>
		<!-- 最新音乐 -->
		<el-row class="fontstyle">
			<el-row>
				<p style="font-size: 18px;letter-spacing: 0.1em;margin:30px 0 20px 0 ;">
					<i class="el-icon-coffee-cup hover" style="font-size: 20px;" @click="sendList()"></i>
					音乐上新
				</p>
			</el-row>
			<el-row>
				<el-col :span="8" v-for="item,index in newsongs" :key="index"
					style="margin-bottom: 10px;position: relative;box-sizing: border-box;padding-right:10px;">
					<el-row class="newsong-row">
						<el-col :span="8" style="display: flex;" v-if="item.picUrl">
							<el-image style="border-radius: 5px;width: 100%;aspect-ratio: 1;" :src="item.picUrl+'?param=300y300'"
								fit="fill" @click="playMusic(item.id)" @error="getNewSongs()">
								<div slot="error" class="image-slot">
									<i class="el-icon-loading"></i>
									<span>loading</span>
								</div>
							</el-image>
						</el-col>
						<el-col :span="16" v-if="item.song">
							<el-row style="position: absolute;top: 18%; left: 37%;font-size: 18px;width: 68%;
								overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.name}}</el-row>
							<el-row style="position: absolute;top: 57%; left: 37%;font-size: 16px;width: 68%;
								overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
								<span v-for="it,ind in item.song.artists" :key="ind" style="cursor: pointer;"
									class="hover" @click="turnSingerPage(it.id)">
									{{it.name}}
								</span>
							</el-row>
						</el-col>
					</el-row>

				</el-col>
			</el-row>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				banners: [], //轮播图数据
				personalized: new Array(12).fill(1), //每日推荐歌单数据
				newsongs: new Array(12).fill(1), //最新音乐数据
			}
		},
		mounted() {
			//获取轮播图
			this.getBanner()
			this.getPersonalized()
			this.getNewSongs()
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				if(!vc.banners){
					vc.getBanner()
					vc.getNewSongs()
				}
			})
		},
		methods: {
			turnRelatedPage(item,index) {
				if(this.$refs.carousel.activeIndex != index) return
				let type = item.targetType
				if (type == 3000) {
					window.open(item.url, '_blank')
				} else if (type == 1) {
					this.playMusic(item.targetId)
				} else if (type == 10) {
					this.$router.push({
						path: '/main/album',
						query: {
							albumId: item.targetId
						}
					})
				}else if (type == 1000) {
					this.turnPlayListPage(item.targetId)
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
			//跳转歌单页面
			turnPlayListPage(id) {
				this.$router.push({
					path: '/main/playlist',
					query: {
						listId: id
					}
				})
			},
			//获取轮播图
			getBanner() {
				this.$http.get('/banner').then(res => {
					this.banners = res.data.banners
				})
			},
			//获取推荐歌单
			getPersonalized() {
				this.$http.get('/personalized?limit=12').then(res => {
					this.personalized = res.data.result
				})

			},
			//获取最新音乐
			getNewSongs() {
				this.$http.get('/personalized/newsong', {
					params: {
						limit: 12
					}
				}).then(res => {
					this.newsongs = res.data.result
				})
			},
			//播放音乐
			playMusic(id) {
				this.$store.dispatch('getMusicUrl', id)
			},
			//设置播放列表
			sendList() {
				let ids = ''
				this.newsongs.forEach(item => {
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
		color: rgba(255, 255, 255, 0.8);
	}

	.hover {
		&:hover {
			cursor: pointer;
			transform: translateY(-3px);
			transition: 0.3s ease;
		}
	}

	/deep/.image-slot {
		height: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		font-size: 16px;
		letter-spacing: 0.1em;

		span {
			margin-left: 10px;
			font-style: oblique;
			opacity: 0.8;
		}
	}

	.banner-text {
		display: flex;
		position: absolute;
		font-size: 12px;
		letter-spacing: 0.1em;
		bottom: 0px;
		right: 0px;
		z-index: 8;
		font-family: sans-serif;
		padding: 4px 6px;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.personalized-desc {
		margin-top: 5px;
		margin-bottom: 18px;
		width: 80%;
		height: 2.6em;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;

	}

	.personalized-image {
		/deep/.el-image {
			overflow: visible;

			img {
				border-radius: 5px;
			}
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}
	}

	.newsong-row {
		margin-bottom: 20px;

		&:hover {
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 5px;
			transition: 0.2s ease;

		}

		/deep/.el-image {
			overflow: visible;

			img {
				border-radius: 5px;
			}
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 0px 1px 2px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.8);
			transition: 0.2s ease;
			opacity: 1;

		}
	}

	/deep/.el-image__inner {
		opacity: 0.9;
	}
</style>
