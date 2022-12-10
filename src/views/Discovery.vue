<template>
	<div class="Discovery">
		<div>
			<!-- 轮播图 PC-->
			<div class="bannerStyle PC">
				<el-carousel :interval="4000" type="card" height="27vh" trigger="click">
					<el-carousel-item v-for="(item,index) in banners" :key="index">
						<el-image style="position: absolute;border-radius: 5px;height: 27vh;" :src="item.imageUrl"
							fit="fill" @click="turnRelatedPage(item,index)">
						</el-image>
						<span class="banner-text">{{item.typeTitle}}</span>
					</el-carousel-item>
				</el-carousel>
			</div>
			<!-- 轮播图 mobile-->
			<div class="bannerStyle mobile" style="padding-right: 15px;box-sizing: border-box;">
				<van-swipe :autoplay="30000" indicator-color="white" >
					<van-swipe-item v-for="(item,index) in banners" :key="index" >
						<div style="position: relative;width: 100%;height: 35vw;">
							<el-image style="position: absolute;border-radius: 5px;height:100%;width: 100%;" :src="item.imageUrl"
								fit="cover" @click="turnRelatedPage(item,index)">
							</el-image>
							<span class="banner-text" >{{item.typeTitle}}</span>
						</div>
					</van-swipe-item>
				</van-swipe>
			</div>

			<!-- 推荐歌单 -->
			<el-row>
				<!-- 文字 -->
				<el-row>
					<p class="textArea">
						<i class="el-icon-cloudy icon1"></i>
						推荐歌单
						<i class="el-icon-arrow-right icon2"></i>
					</p>
				</el-row>
				<!-- 歌单 -->
				<div class="PC ">
					<el-col :span="6" v-for="item,index in personalized" :key="index">
						<el-row class="personalized-image" v-if="item.picUrl">
							<el-image class="recImg" :src="item.picUrl+'?param=450y450'" fit="cover"
								@click="turnPlayListPage(item.id)">
							</el-image>
						</el-row>
						<el-row>
							<p class="personalized-desc" v-if="item">{{item.name}}</p>
						</el-row>
					</el-col>
				</div>
				<div class="mobile mobileRecList">
					<el-col :span="8" v-for="item,index in personalized" :key="index">
						<el-row class="personalized-image" v-if="item.picUrl">
							<el-image class="recImg" :src="item.picUrl+'?param=450y450'" fit="cover"
								@click="turnPlayListPage(item.id)">
							</el-image>
						</el-row>
						<el-row>
							<p class="personalized-desc" v-if="item">{{item.name}}</p>
						</el-row>
					</el-col>
				</div>
			</el-row>
			<!-- 最新音乐 -->
			<el-row>
				<!-- 文字 -->
				<el-row>
					<p class="textArea">
						<i class="el-icon-coffee-cup hover icon1" @click="sendList()"></i>
						音乐上新
					</p>
				</el-row>
				<el-row>
					<!-- 音乐 PC-->
					<div class="PC">
						<el-col :span="8" v-for="item,index in newsongs" :key="index" class="newArea">
							<el-row class="newsong-row">
								<el-col :span="8" style="display: flex;" v-if="item.picUrl">
									<el-image class="newImg" :src="item.picUrl+'?param=300y300'" fit="fill"
										@click="playMusic(item.id)">
									</el-image>
								</el-col>
								<el-col :span="16" v-if="item.song">
									<el-row class="songNameStyle">{{item.name}}</el-row>
									<el-row class="singerNameStyle">
										<span v-for="it,ind in item.song.artists" :key="ind" style="cursor: pointer;"
											class="hover" @click="turnSingerPage(it.id)">
											{{it.name}}
										</span>
									</el-row>
								</el-col>
							</el-row>
						</el-col>
					</div>

					<!-- 音乐 mobile -->
					<div class="mobile">
						<el-col :span="12" v-for="item,index in newsongs" :key="index" class="newArea">
							<el-row class="newsong-row">
								<el-col :span="8" style="display: flex;" v-if="item.picUrl">
									<el-image class="newImg" :src="item.picUrl+'?param=300y300'" fit="fill"
										@click="playMusic(item.id)">
									</el-image>
								</el-col>
								<el-col :span="16" v-if="item.song">
									<el-row class="songNameStyle">{{item.name}}</el-row>
									<el-row class="singerNameStyle">
										<span v-for="it,ind in item.song.artists" :key="ind" style="cursor: pointer;"
											class="hover" @click="turnSingerPage(it.id)">
											{{it.name}}
										</span>
									</el-row>
								</el-col>
							</el-row>
						</el-col>
					</div>

				</el-row>
			</el-row>
		</div>

	</div>



</template>

<script>
	import {
		turnSingerPage,
		turnPlayListPage
	} from '@/utils/index'
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
				vc.$nextTick(() => {
					vc.$store.state.localTop = 'Discovery'
					vc.$store.state.localPage = '发现'
				})
			})
		},
		methods: {
			//轮播图跳转
			turnRelatedPage(item, index) {
				let type = item.targetType
				if (type == 1) {
					this.playMusic(item.targetId)
				} else if (type == 10) {
					this.$router.push({
						path: '/main/album',
						query: {
							albumId: item.targetId
						}
					})
				} else if (type == 1000) {
					turnPlayListPage.call(this, item.targetId)
				}

			},
			// 跳转歌手页面
			turnSingerPage(id) {
				turnSingerPage.call(this, id)
			},
			//跳转歌单页面
			turnPlayListPage(id) {
				turnPlayListPage.call(this, id)
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
	@media screen and (max-width:1150px) {
		.PCAside {
			width: 150px !important;
		}
	}

	@media screen and (max-width:850px) {
		.Discovery {
			padding: 0px 0px 10px 15px !important;
		}

		.mobile {
			display: block !important;
		}

		.PC {
			display: none;
		}

		.recImg {
			width: 91% !important;
		}

		.personalized-desc {
			width: 91% !important;
		}

		.mobileRecList {
			font-size: 14px !important;
		}

		.songNameStyle {
			font-size: 14px !important;
			top: 12% !important;
			left: 37%;
		}

		.singerNameStyle {
			font-size: 12px !important;
			top: 62% !important;
			left: 37%;
		}
		


	}

	.mobile {
		display: none;

	}

	.Discovery {
		padding: 20px;
		box-sizing: border-box;
		transform: translate3d(0, 0, 0);
		height: 100%;
		overflow-y: scroll;
		color: rgba(255, 255, 255, 0.8);
	}

	.bannerStyle {
		position: relative;
		top: 0;
		width: 100%;
	}

	.textArea {
		font-size: 18px;
		letter-spacing: 0.1em;
		margin: 15px 0 20px 0;

		.icon1 {
			font-size: 20px;
		}

		.icon2 {
			font-size: 20px;
			transform: translate(-8px, 1px);
		}
	}

	.newArea {
		margin-bottom: 10px;
		position: relative;
		box-sizing: border-box;
		padding-right: 10px;

		.newsong-row {
			margin-bottom: 20px;

			.newImg {
				border-radius: 5px;
				width: 100%;
				aspect-ratio: 1;
			}

			.songNameStyle {
				position: absolute;
				top: 18%;
				left: 37%;
				font-size: 18px;
				width: 64%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.singerNameStyle {
				position: absolute;
				top: 57%;
				left: 37%;
				font-size: 16px;
				width: 64%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}


			&:hover {
				background-color: rgba(0, 0, 0, 0.4);
				border-radius: 5px;
				transition: 0.2s ease;

			}

			.hover:hover {
				cursor: pointer;
				transform: translateY(-3px);
				transition: 0.3s ease;
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
	}

	.banner-text {
		display: flex;
		position: absolute;
		font-size: 12px;
		letter-spacing: 0.1em;
		bottom: 0px;
		right: 0px;
		z-index: 8;
		padding: 4px 6px;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.personalized-desc {
		margin-top: 5px;
		margin-bottom: 18px;
		width: 80%;
		line-height: 20px;
		height: 40px;
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

		.recImg {
			width: 80%;
			aspect-ratio: 1;
			border-radius: 5px;
		}
	}


	/deep/.el-image__inner {
		opacity: 0.9;
	}
</style>
