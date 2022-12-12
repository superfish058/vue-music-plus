<template>
	<div class="RecVideo" v-infinite-scroll="load" infinite-scroll-delay="300" infinite-scroll-distance="50"
		ref="recVideoPage">
		<el-row>
			<el-card>
				<el-row style="position: relative;top: 10px;height: 40px;">
					<span class="selectTag taghover" @click="showAllTags()">全部<i class="el-icon-arrow-right"></i></span>
					<!-- 全部展示标签 -->
					<div ref="tagRow" class="tagRow ">
						<div ref="typetags">
							<span v-for="item,index in types" :key="index" @click="changeTags(item,'type')"
								class="videoTag taghover">{{item}}</span>
						</div>
						<div ref="ordertags">
							<span v-for="item,index in orders" :key="index" @click="changeTags(item,'order')"
								class="videoTag taghover">{{item}}</span>
						</div>

					</div>
					<!-- 默认展示标签 -->
					<div ref="areatags" style="position: absolute; right: 0;top: 0;">
						<span v-for="item,index in areas" :key="index" @click="changeTags(item,'area')"
							class="defaultTag taghover">
							{{item}}
						</span>
					</div>
				</el-row>
				<div ref="mainArea" style="transition: 0.3s ease;margin-top: 20px;">
					<el-empty description="正在加载视频中" style="height: 80vh;" v-show="!videoList.length"></el-empty>
					<el-row :gutter="30">
						<el-col :span="8" v-for="item,index in videoList" :key="index" class="personalized-image">
							<div v-if="item.cover">
								<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.cover+'?param=570y320'"
									fit="cover" @click="turnVideoPage(item)">
								</el-image>
								<div style="height: 64px;font-size: 16px;">
									<p style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
											font-size: 18px; width: 100%;margin-bottom: 5px;margin-top: 5px;">
										<span v-if="item.name">{{item.name}}</span>
									</p>
									<p class="main-p">
										<span v-for="it,ind in item.artists" :key="ind" @click="turnSingerPage(it.id)"
											class="hover">
											{{it.name}}
										</span>
									</p>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				videoList: [], //视频信息
				offset: 0, //视频偏移量
				areas: ['全部', '内地', '港台', '欧美', '日本', '韩国'], //默认标签
				types: ['全部', '官方版', '原声', '现场版', '网易出品'],
				orders: ['上升最快', '最热', '最新'],
				showTags: false, //展示标签
				area: '全部',
				type: '全部',
				order: '上升最快'
			}
		},
		mounted() {
			this.getVideoList()
			this.$refs.recVideoPage.scrollTop = 0
			this.$store.state.localTop = 'RecVideo'
			this.$store.state.localPage = 'MV'
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.$nextTick(() => {
					vc.setTagColor()
					vc.$refs.recVideoPage.scrollTop = 0
					vc.$store.state.localTop = 'RecVideo'
					vc.$store.state.localPage = 'MV'
				})

			})
		},
		watch: {
			showTags() {
				if (this.showTags) {
					this.$refs.tagRow.style.height = '70px'
					this.$refs.tagRow.style.position = 'none'
					this.$refs.mainArea.style.marginTop = '90px'
				} else {
					this.$refs.tagRow.style.height = 0
					this.$refs.mainArea.style.marginTop = '20px'
				}
			}
		},
		methods: {
			//设置标签颜色
			setTagColor() {
				let refs = ['areatags', 'ordertags', 'typetags']
				let select1 = this.areas.findIndex(it => it == this.area)
				let select2 = this.types.findIndex(it => it == this.type)
				let select3 = this.orders.findIndex(it => it == this.order)
				this.$refs[refs[0]].childNodes[select1].style = "background:#fff;color:#121212;"
				this.$refs[refs[1]].childNodes[select3].style = "background:#fff;color:#121212;"
				this.$refs[refs[2]].childNodes[select2].style = "background:#fff;color:#121212;"

			},
			//跳转视频页面
			turnVideoPage(data) {
				let id = ''
				if (data.id) {
					id = data.id
					this.$router.push({
						path: '/main/video',
						query: {
							mvId: id
						}
					})
				} else {
					id = data.vid
					this.$router.push({
						path: '/main/video',
						query: {
							videoId: id
						}
					})
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
			//修改地区标签
			changeTags(item, type = 'area') {
				let select = 0
				let i = 0
				let ref = type + 'tags'
				if (type == 'area') {
					if (item == this.area) return
					this.area = item
					select = this.areas.findIndex(it => it == item)
					i = this.areas.length
				} else if (type == 'type') {
					if (item == this.type) return
					this.type = item
					select = this.types.findIndex(it => it == item)
					i = this.types.length
				} else if (type == 'order') {
					if (item == this.order) return
					this.order = item
					select = this.orders.findIndex(it => it == item)
					i = this.orders.length
				}
				this.getVideoList('clc')
				while (i > 0) {
					this.$refs[ref].childNodes[i - 1].style = "none"
					i--
				}
				this.$refs[ref].childNodes[select].style = "background:#fff;color:#121212;"
			},
			//展示全部标签
			showAllTags() {
				this.showTags = !this.showTags
			},
			load() {
				if (this.$route.path != '/main/recvideo') return
				if (this.offset > this.videoList.length) return
				this.offset = this.videoList.length
				this.getVideoList()
			},
			getVideoList(mode = '') {
				this.$http.get('/mv/all', {
					params: {
						limit: 30,
						area: this.area,
						offset: this.offset,
						type: this.type,
						order: this.order
					}
				}).then(res => {
					if (mode == 'clc') {
						this.videoList = res.data.data
					} else {
						this.videoList = this.videoList.concat(res.data.data)
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.RecVideo {
		color: rgba(255, 255, 255, 0.9);
		cursor: default;
		user-select: none;
		scroll-behavior: smooth;
		padding: 20px 20px 20px 18px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
		transform: translate3d(0, 0, 0);

		span,
		p {
			color: #fff;
			opacity: 0.9;
		}

		p {
			margin: 0;
			padding: 0;
		}
	}

	.taghover {
		cursor: pointer;
		transition: 0.1s ease;

		i {
			cursor: pointer;
		}

		&:hover {
			background-color: #fff;
			color: #121212;

			i {
				color: #121212;
			}
		}
	}

	.tagRow {
		border-radius: 5px;
		transition: 0.2s ease;
		height: 0;
		overflow: hidden;
	}


	.videoTag {
		display: inline-block;
		padding: 2px 3px 3px 2px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.defaultTag {
		display: inline-block;
		padding: 2px 3px 3px 2px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 15px;
	}

	.selectTag {
		display: inline-block;
		padding: 2px 3px 3px 8px;
		border: 1px solid #fff;
		border-radius: 2px;
		margin-right: 10px;
		margin-bottom: 10px;
	}


	.personalized-image {
		/deep/.el-image {
			overflow: visible;
		}

		/deep/.el-image__inner {
			opacity: 0.9;
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}

		.main-p {
			font-size: 16px !important;
			width: 100%;
			margin-top: 7px;
			font-size: 20px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			span {
				margin-right: 10px;

				&:hover {
					color: aquamarine;
				}
			}
		}
	}

	.el-card {
		position: relative;
		background-color: #121212;
		opacity: 0.9;
		border: none;
		border-radius: 10px;
	}
</style>
