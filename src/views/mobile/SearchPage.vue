<template>
	<div class="SearchPage">
		<!-- 顶部搜索栏 -->
		<div class="top">
			<!-- 返回按钮 -->
			<div class="backBox">
				<van-icon name="arrow-left" @click="$router.go(-1)" />
			</div>
			<!-- 搜索框 -->
			<div class="searchBox">
				<van-search v-model="searchWord" placeholder="请输入搜索关键词" shape="round" background="transparent" autofocus
					@input="wordChange" @search="turnSearch"/>
			</div>
		</div>
		<!-- 热搜列表 -->
		<div class="hotList" v-show="!searchWord">
			<div class="title">
				<p>热搜榜单</p>
			</div>
			<div class="listArea">
				<div class="listItem" v-for="item,index in hotList" :key="index" @click="turnSearchPage(item.searchWord)">
					<div class="index">
						<p>{{index+1}}</p>
					</div>
					<div class="item">
						<p>{{item.searchWord}}</p>
						<p>{{item.content}}</p>
					</div>
				</div>
			</div>
		</div>
		<!-- 关联搜索 -->
		<div class="recList" v-show="searchWord">
			<div class="title">
				<p>猜你想搜</p>
			</div>
			<div class="recArea" v-for="item,index in searchSuggest" :key="index" @click="selectWords(item)">
				<div class="recItem">
					<p>
						<span class="name">{{item.name}}</span>
						<span v-if="item.tag=='单曲'">-</span>
						<span class="artist" v-if="item.tag!='歌手'">{{item.artists}}</span>
						<span class="tag">{{item.tag}}</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchWord: '',
				searchSuggest: [], //搜索建议
				hotList: [],
			}
		},
		mounted() {
			this.getHotList()
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.$store.state.localTop = 'SearchPage'
				vc.$store.state.localPage = '搜索'
				vc.getHotList()
			})
		},
		methods: {
			selectWords(item){
				if (item.tag!='歌手'){
					let searchWord = item.name+' '+item.artists
					this.turnSearchPage(searchWord)
				}else{
					this.turnSearchPage(item.name)
				}
			},
			//跳转搜索界面
			turnSearch(val){
				this.turnSearchPage(this.searchWord)
			},
			//跳转搜索界面.真
			turnSearchPage(searchWord){
				this.$router.push({
					path:'main/search',
					query: {
						keyword: searchWord
					}
				}),
				setTimeout(() => {
					this.$store.state.searchSignal += 1
				}, 50)
			},
			//获取热搜列表
			getHotList() {
				this.$http.get('/search/hot/detail').then(res => {
					this.hotList = res.data.data
				})
			},
			//监听输入变化
			wordChange(val) {
				this.getSearchSuggest()
			},
			//获取搜索匹配
			async getSearchSuggest() {
				if(!this.searchWord){
					this.searchSuggest = []
					return
				}
				let res = await this.$http.get('/search/suggest', {
					params: {
						keywords: this.searchWord
					}
				})
				let searchSuggest = res.data.result
				if (!searchSuggest['songs']) return
				this.searchSuggest = []
				if (searchSuggest['songs']) {
					searchSuggest['songs'].forEach(item => {
						let name = item.name
						let artists = ''
						item.artists.forEach(it => {
							artists += (it.name + '/')
						})
						artists = artists.slice(0, -1)
						this.searchSuggest.push({
							name,
							artists,
							tag: '单曲'
						})
					})
				}
				if (searchSuggest['albums']) {
					searchSuggest['albums'].forEach(item => {
						let name = item.name
						let artists = item.artist.name
						this.searchSuggest.push({
							name,
							artists,
							tag: '专辑'
						})
					})
				}
				if (searchSuggest['artists']) {
					searchSuggest['artists'].forEach(item => {
						let name = item.name
						let artists = item.name
						this.searchSuggest.push({
							name,
							artists,
							tag: '歌手'
						})
					})
				}
			},
		},
	}
</script>

<style scoped lang="less">
	.SearchPage {
		height: 100%;
		width: 100%;

		.top {
			display: flex;
			padding-top: 1vh;
			padding-right: 2vw;
			height: 6vh;

			.backBox {
				height: 100%;
				flex: 0.8;

				i {
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 3.8vh;
				}
			}

			.searchBox {
				height: 100%;
				flex: 9.2
			}
		}

		.hotList {
			height: 90vh;
			overflow-y: auto;

			.title {
				padding: 2vw 0 2vw 4vw;
				font-size: 18px;
			}

			.listArea {
				padding: 2vw;

				.listItem {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					height: 56px;

					&:active {
						background-color: rgba(0, 0, 0, 0.3);
					}

					.index {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;

						p {
							font-size: 16px;
						}
					}

					.item {
						flex: 9;

						p {
							padding-left: 5px;
							font-size: 14px;
							line-height: 28px;

							&:first-child {
								font-size: 16px;
							}
						}
					}
				}
			}
		}

		.recList {
			height: 90vh;
			overflow-y: auto;

			.title {
				padding: 2vw 0 2vw 4vw;
				font-size: 18px;
			}

			.recArea {
				padding-left: 4vw;
				padding-right: 4vw;

				.recItem {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					padding: 5px 0;

					&:active {
						background-color: rgba(0, 0, 0, 0.3);
					}

					p {
						display: flex;
						width: 100%;
						
						.artist{
							min-width: 50px;
						}
						.tag {
							flex: 1;
							display: flex;
							justify-content: flex-end;
							min-width: 50px;
							padding-right: 8px;
						}
					}


				}
			}
		}
	}

	// 修改默认样式
	.van-search {
		padding: 0;
		height: 100%;
		background-color: transparent;
	}
</style>
