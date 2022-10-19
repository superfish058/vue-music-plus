<template>
	<div style="padding: 20px 20px 20px 15px;" v-infinite-scroll="load" infinite-scroll-delay="300"
		infinite-scroll-distance="50" ref="searchRef" infinite-scroll-immediate="0">
		<!-- 标签导航 -->
		<el-row>
			<div class="tags" ref="tags">
				<span v-for="item,index in tags" :key="index" @click="changeTag(item)" :tabindex="index">{{item}}</span>
			</div>
		</el-row>
		<!-- 导航展示界面 -->
		<el-row v-show="tagsActive=='全部'">
			<!-- 全部 -->
			<el-row :gutter="20">
				<el-col :span="10" class="hotResult">
					<el-card style="height: 270px;">
						<p style="font-size: 22px;font-weight: 700;margin-bottom:10px;margin-left: 2px;">热门结果</p>
						<!-- 歌曲展示（保底） -->
						<el-row v-if="orderNone">
							<el-col :span="11" class="recommend" v-if="songLists.length>0">
								<el-image style="width: 80%; aspect-ratio: 1;;border-radius: 10px;"
									:src="songLists[0].al.picUrl" fit="cover">
								</el-image>
								<p class="main-p">{{songLists[0].name}}</p>
								<p>单曲</p>
							</el-col>
							<el-col :span="2" style="opacity: 0;" v-if="JSON.stringify(recommendArtist)!='{}'">1
							</el-col>
						</el-row>
						<!-- 歌手展示信息 -->
						<el-row>
							<el-col :span="11" class="recommend" v-if="JSON.stringify(recommendArtist)!='{}'">
								<el-image style="width: 80%; aspect-ratio: 1;;border-radius: 50%;" class="img-hidden"
									:src="recommendArtist.img1v1Url" fit="cover"
									@click="turnSingerPage(recommendArtist.id)">
								</el-image>
								<p class="main-p">{{recommendArtist.name}}</p>
								<p>歌手</p>
							</el-col>
							<el-col :span="2" style="opacity: 0;" v-if="JSON.stringify(recommendArtist)!='{}'">1
							</el-col>
							<!-- 专辑展示 -->
							<el-col :span="11" class="recommend" v-if="JSON.stringify(recommendAlbum)!='{}'">
								<el-image style="width: 80%; aspect-ratio: 1;" :src="recommendAlbum.blurPicUrl"
									class="hover" @click="turnAlbumPage(recommendAlbum.id)"></el-image>
								<p class="main-p">{{recommendAlbum.name}}</p>
								<p>专辑</p>
							</el-col>
							<!-- 歌单展示 -->
							<el-col :span="2" style="opacity: 0;" v-if="JSON.stringify(recommendAlbum)!='{}'">1</el-col>
							<el-col :span="11" class="recommend" v-if="JSON.stringify(recommendPlaylist)!='{}'">
								<el-image style="width: 80%; aspect-ratio: 1;" :src="recommendPlaylist.coverImgUrl"
									@click="turnPlayListPage(recommendPlaylist.id)">
								</el-image>
								<p class="main-p">{{recommendPlaylist.name}}</p>
								<p>歌单</p>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<!-- 匹配歌曲展示 -->
				<el-col :span="14" class="relativeSongs">
					<el-card style="height: 270px;">
						<p style="font-size: 22px;font-weight: 700;margin-bottom:10px;margin-left: 3px;">歌曲</p>
						<el-row v-for="item,index in songLists.slice(0,4)" :key="index" class="song-row"
							style="padding: 4px;height: 58px;" @dblclick.native="playMusic(item.id)">
							<el-col :span="3">
								<el-image style="width:50px; aspect-ratio: 1;border-radius: 3px;" :src="item.al.picUrl"
									fit="cover" @click="playMusic(item.id)"></el-image>
							</el-col>
							<el-col :span="18" style="position: relative;height: 50px;">
								<p style="position: absolute;top: 3px;">
									<el-row style="display: flex;align-items: center;">
										{{item.name}}
										<span class="iconfont icon-shipin" style="color:aquamarine;opacity: 0.9;font-size: 20px;
											margin-left: 5px;cursor: pointer;display: inline-block;transform: translateY(1px);" v-if="item.mv"
											@click="turnMvPage(item.mv)"></span>
									</el-row>
								</p>
								<p style="position: absolute;bottom: 3px;font-size: 14px;">
									<span v-for="it,ind in item.ar" :key="ind" style="cursor: pointer;" class="hover"
										@click="turnSingerPage(it.id)">
										{{it.name}}
									</span>
								</p>
							</el-col>
							<el-col :span="3">
								<span style="display: flex;align-items: center;height: 50px;padding-left: 10px;">
									{{setDtime(item.dt)}}
								</span>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
			<!-- 匹配专辑展示 -->
			<el-row>
				<el-card style="margin-top: 20px;" class="hotResult">
					<p style="font-size: 22px;font-weight: 700;margin-left: 15px;margin-bottom: 10px;">专辑</p>
					<el-col :span="4" v-for="item,index in albumLists.slice(0,6)" :key="index" class="recommend">
						<el-image style="width: 80%; aspect-ratio: 1;" :src="item.blurPicUrl"
							@click="turnAlbumPage(item.id)"></el-image>
						<div style="width: 100%;">
							<p class="main-p">{{item.name}}</p>
						</div>
						<div style="width: 100%;">
							<p class="main-p">{{item.artist.name}}</p>
						</div>
					</el-col>
				</el-card>
			</el-row>
			<!-- 匹配歌单展示 -->
			<el-row>
				<el-card style="margin-top: 20px;">
					<p style="font-size: 22px;font-weight: 700;margin-bottom: 10px;">歌单</p>
					<el-row style="padding: 0;" :gutter="30">
						<el-col :span="6" v-for="item,index in playlists.slice(0,8)" :key="index"
							class="personalized-image">
							<el-image style="width: 100%; aspect-ratio: 1;" :src="item.coverImgUrl" fit="cover"
								@click="turnPlayListPage(item.id)">
							</el-image>
							<div style="padding-top: 10px;height: 58px;">
								<p class="main-p" style="font-size: 18px;white-space: normal;-webkit-line-clamp: 2;display: -webkit-box;
									line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{{item.name}}</p>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</el-row>
			<!-- 匹配视频展示 -->
			<el-row>
				<el-card style="margin-top: 20px;">
					<p style="font-size: 22px;font-weight: 700;margin-bottom: 10px;">视频</p>
					<el-row :gutter="30">
						<el-col :span="8" v-for="item,index in videoLists.slice(0,9)" :key="index"
							class="personalized-image">
							<div v-if="item">
								<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.coverUrl" fit="cover"
									@click="turnVideoPage(item)">
								</el-image>
							</div>
							<div style="height: 64px;font-size: 16px;" v-if="item">
								<p style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
									font-size: 18px; width: 100%;margin-bottom: 5px;margin-top: 5px;">
									{{item.title}}
								</p>
								<p v-if="item.type==0" class="main-p">
									<span v-for="it,ind in item.creator" :key="ind">
										{{it.userName}}
									</span>
								</p>
								<p v-if="item.type==1" style="text-align: justify;word-break: break-all;"
									class="main-p">
									by&nbsp;{{item.creator[0].userName}}
								</p>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</el-row>
		</el-row>
		<!-- 歌曲界面 -->
		<el-row v-if="tagsActive=='歌曲'" class="songRow">
			<span class="iconfont icon-24gf-playCircle playIcon" @click="sendList()"></span>
			<el-table :data="songLists" style="width: 100%;border-radius: 10px;">
				<el-table-column label="#" type="index" width="50">
				</el-table-column>
				<el-table-column label="标题" width="70">
					<template slot-scope="scope">
						<div v-if="scope.row.al">
							<el-image :src="scope.row.al.picUrl" style="width:100%;aspect-ratio: 1;cursor: pointer;"
								fit="cover" @click="playMusic(scope.row.id)">
							</el-image>
						</div>		
					</template>
				</el-table-column>
				<el-table-column width="460">
					<template slot-scope="scope">
						<el-row style="display: flex;align-items: center;">
							{{scope.row.name}}
							<span class="iconfont icon-shipin"
								style="color:aquamarine;opacity: 0.9;font-size: 20px;margin-left: 5px;cursor: pointer;"
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
						<el-row v-if="scope.row.al">
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
		<!-- 歌单界面 -->
		<el-row v-if="tagsActive=='歌单'">
			<el-card style="margin-top: 20px;">
				<p style="font-size: 22px;font-weight: 700;margin-bottom: 10px;">歌单</p>
				<el-row style="padding: 0;" :gutter="30">
					<el-col :span="6" v-for="item,index in playlists" :key="index" class="personalized-image">
						<el-image style="width: 100%; aspect-ratio: 1;" :src="item.coverImgUrl" fit="cover"
							@click="turnPlayListPage(item.id)">
						</el-image>
						<div style="padding-top: 10px;height: 58px;">
							<p class="main-p" style="font-size: 18px;white-space: normal;-webkit-line-clamp: 2;display: -webkit-box;
								line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{{item.name}}</p>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
		<!-- 专辑界面 -->
		<el-row v-if="tagsActive=='专辑'">
			<el-card style="margin-top: 20px;" class="hotResult">
				<p style="font-size: 22px;font-weight: 700;margin-left: 15px;margin-bottom: 10px;">专辑</p>
				<el-col :span="4" v-for="item,index in albumLists" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" :src="item.blurPicUrl"
						@click="turnAlbumPage(item.id)"></el-image>
					<div style="width: 100%;height: 27px;">
						<p class="main-p">{{item.name}}</p>
					</div>
					<div style="width: 100%;height: 27px;">
						<p class="main-p">{{item.artist.name}}</p>
					</div>
				</el-col>
			</el-card>
		</el-row>
		<!-- 歌手界面 -->
		<el-row v-if="tagsActive=='歌手'">
			<el-card style="margin-top: 20px;" class="hotResult">
				<p style="font-size: 22px;font-weight: 700;margin-left: 15px;margin-bottom: 10px;">歌手</p>
				<el-col :span="4" v-for="item,index in singerLists" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" :src="item.img1v1Url" class="img-hidden hover"
						fit="cover" @click="turnSingerPage(item.id)">
					</el-image>
					<div style="width: 100%;height: 30px;">
						<p class="main-p">{{item.name}}</p>
					</div>
				</el-col>
			</el-card>
		</el-row>
		<!-- 视频界面 -->
		<el-row v-if="tagsActive=='视频'">
			<el-card style="margin-top: 20px;">
				<p style="font-size: 22px;font-weight: 700;margin-bottom: 10px;">视频</p>
				<el-row :gutter="30">
					<el-col :span="8" v-for="item,index in videoLists" :key="index" class="personalized-image">
						<div v-if="item">
							<el-image style="width: 100%; aspect-ratio: 16/9;" :src="item.coverUrl" fit="cover"
								@click="turnVideoPage(item)">
							</el-image>
						</div>
						<div style="height: 64px;font-size: 16px;" v-if="item">
							<p style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
								font-size: 18px; width: 100%;margin-bottom: 5px;margin-top: 5px;">
								{{item.title}}
							</p>
							<p v-if="item.type==0" class="main-p">
								<span v-for="it,ind in item.creator" :key="ind">
									{{it.userName}}
								</span>
							</p>
							<p v-if="item.type==1" style="text-align: justify;word-break: break-all;" class="main-p">
								by&nbsp;{{item.creator[0].userName}}
							</p>
						</div>
					</el-col>
				</el-row>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				songLists: [],
				albumLists: [],
				playlists: [],
				videoLists: [],
				singerLists: [],
				tagsActive: '全部',
				recommendArtist: {}, //推荐歌手
				recommendPlaylist: {}, //推荐歌单
				recommendAlbum: {}, //推荐专辑
				searchOffset: 0,
				lastSearch: '', //上一次搜索词
				newSearch: '', //本次搜索词
				tags: ['全部', '歌曲', '歌单', '歌手', '专辑', '视频'],
				orderNone: 0,

			}
		},
		computed: {
			searchWords() {
				return this.$route.query.keyword
			},
			searchSignal() {
				return this.getSearchSignal()
			},
		},
		mounted() {
			this.getRecommend()
			this.searchSongs()
			this.searchAlbums()
			this.searchPlaylists()
			this.searchvideoLists()
			this.searchSingers()
		},
		beforeRouteEnter(to,from,next){
			next(vc =>{
				vc.$nextTick(()=>{
					vc.$refs.searchRef.parentNode.scrollTop = 0
				})
			})
		},
		beforeRouteUpdate(to,from,next){
			this.$refs.searchRef.parentNode.scrollTop = 0
			next()
		},
		watch: {
			searchSignal: function() {
				if (this.searchSignal != 0) {
					this.lastSearch = this.newSearch
					this.newSearch = this.searchWords
					if (this.newSearch == this.lastSearch) return
					this.getRecommend()
					this.searchSongs()
					this.searchAlbums()
					this.searchPlaylists()
					this.searchvideoLists()
					this.searchSingers()
					this.resetAll()
				}
			},
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
			//跳转视频页面
			turnVideoPage(data) {
				if (!isNaN(parseFloat(data.vid)) && isFinite(data.vid)) {
					this.$router.push({
						path: '/main/video',
						query: {
							mvId: data.vid
						}
					})
				} else {
					this.$router.push({
						path: '/main/video',
						query: {
							videoId: data.vid
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
			//跳转歌单页面
			turnPlayListPage(id) {
				this.$router.push({
					path: '/main/playlist',
					query: {
						listId: id
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
			load() {
				if(this.$route.path != '/main/search') return
				if (this.tagsActive === '歌曲') {
					if (this.songLists.length % 15) return
					this.searchOffset = this.songLists.length
					this.searchSongs()
					return
				}
				if (this.tagsActive === '歌单') {
					if (this.playlists.length % 16) return
					this.searchOffset = this.playlists.length
					this.searchPlaylists()
					return
				}
				if (this.tagsActive === '专辑') {
					if (this.albumLists.length % 24) return
					this.searchOffset = this.albumLists.length
					this.searchAlbums()
					return
				}
				if (this.tagsActive === '视频') {
					if (this.videoLists.length % 15) return
					this.searchOffset = this.videoLists.length
					this.searchvideoLists()
					return
				}
			},
			//初始化数据
			resetAll() {
				this.songLists = []
				this.albumLists = []
				this.playlists = []
				this.videoLists = []
				this.singerLists = []
				this.tagsActive = '全部'
				this.searchOffset = 0
				this.$nextTick(() => {
					this.tags.forEach((item, ind) => {
						this.$refs.tags.childNodes[ind].style = 'none'
						
					})
					this.$refs.tags.childNodes[0].style = 'background:#ffffff;color:#121212'
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
				this.searchOffset = 0
			},
			//搜索歌曲
			searchSongs() {
				this.$http.get('/cloudsearch', {
					params: {
						keywords: this.searchWords,
						limit: 15,
						offset: 0 + this.searchOffset
					}
				}).then(res => {
					this.songLists = this.songLists.concat(res.data.result.songs)
				})
			},
			//搜索专辑
			searchAlbums() {
				this.$http.get('/cloudsearch', {
					params: {
						keywords: this.searchWords,
						limit: 24,
						type: 10,
						offset: 0 + this.searchOffset
					}
				}).then(res => {
					this.albumLists = this.albumLists.concat(res.data.result.albums)
				})
			},
			//搜索歌单
			searchPlaylists() {
				this.$http.get('/cloudsearch', {
					params: {
						keywords: this.searchWords,
						limit: 16,
						type: 1000,
						offset: 0 + this.searchOffset
					}
				}).then(res => {
					this.playlists = this.playlists.concat(res.data.result.playlists)
				})
			},
			//搜索视频
			searchvideoLists() {
				this.$http.get('/cloudsearch', {
					params: {
						keywords: this.searchWords,
						limit: 15,
						type: 1014,
						offset: 0 + this.searchOffset
					}
				}).then(res => {
					this.videoLists = this.videoLists.concat(res.data.result.videos)
				})
			},
			//搜索歌手
			searchSingers() {
				this.$http.get('/cloudsearch', {
					params: {
						keywords: this.searchWords,
						limit: 12,
						type: 100
					}
				}).then(res => {
					this.singerLists = this.singerLists.concat(res.data.result.artists)
				})
			},
			//获取搜索信号
			getSearchSignal() {
				setTimeout(() => {
					this.$store.state.searchSignal = 0
				}, 20)
				return this.$store.state.searchSignal
			},
			//获取搜索推荐
			getRecommend() {
				this.$http.get('/search/multimatch', {
					params: {
						keywords: this.searchWords
					}
				}).then(res => {
					let orders = res.data.result.orders
					let flag = 0
					this.orderNone = 0
					if (orders.includes('artist')) {
						this.recommendArtist = res.data.result.artist[0]
					} else {
						this.recommendArtist = {}
						flag++
					}
					if (orders.includes('playlist')) {
						this.recommendPlaylist = res.data.result.playlist[0]
					} else {
						this.recommendPlaylist = {}
						flag++
					}
					if (orders.includes('album')) {
						this.recommendAlbum = res.data.result.album[0]
					} else {
						this.recommendAlbum = {}
						flag++
					}
					if (flag == 3) {
						this.orderNone = 1
					}

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
				this.songLists.forEach(item => {
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
		color: rgba(255, 255, 255, 0.9);
		cursor: default;
		user-select: none;
		transform: translate3d(0, 0, 0);
	}

	p {
		margin: 0;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.playIcon {
		position: fixed;
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

	.songRow {
		.el-table {
			background-color: transparent;

		}

		.el-image {
			transform: translateY(3px);
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



	/deep/.el-image__inner {
		opacity: 0.9;
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




	.song-row:hover {
		background-color: #2a2a2a !important;
		border-radius: 5px;
		transition: 0.2s ease;

		/deep/.el-image {
			box-sizing: border-box;
			overflow: visible;
		}

		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 0px 1px 2px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.8);
			transition: 0.2s ease;
			opacity: 1;

		}
	}

	.recommend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding: 15px 0;
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


	.tags {
		margin: 7px 0 13px 0;
		margin-bottom: 20px;

		span {
			margin-right: 10px;
			background-color: #232323;
			padding: 8px 12px;
			border-radius: 20px;
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
