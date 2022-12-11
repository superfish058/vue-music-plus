<template>
	<div>
		<el-row class="songRow">
			<el-empty description="正在加载中" v-show="!songList.length" style="height: 70vh;"></el-empty>
			<span class="iconfont icon-24gf-playCircle playIcon" @click="sendList()" v-show="!$store.state.mobileMode"></span>
			<el-row class="title PC" v-show="songList.length">
				<el-col :span="2" class="index">#</el-col>
				<el-col :span="11" class="index_1">标题</el-col>
				<el-col :span="9">专辑</el-col>
				<el-col :span="2">时长</el-col>
			</el-row>
			<div class="mainArea">
				<el-row class="mobile playAll" v-show="songList.length">
					<span class="iconfont icon-24gf-playCircle " @click="sendList()" ></span>
					播放全部({{songList.length}})
				</el-row>
				<div v-for="item,index in songList" :key="item.id" class="songItem " @dblclick="playMusic(item.id)" v-tap="(e)=>playMusic(item.id)">
					<!-- 序号 -->
					<el-col :span="2" class="width10">
						<div class="index">{{index+1}}</div>
					</el-col>
					<!-- 专辑封面 歌名 歌手 -->
					<el-col :span="11" class="width90 mobileSize">
						<div class="songbox index_1">
							<div class="songImg">
								<el-image :src="item.al.picUrl+'?param=200y200'" fit="fill" @click="playMusic(item.id)"
									lazy>
								</el-image>
							</div>
							<div class="nameArtist">
								<div class="songNameInfo">
									{{item.name}}
									<span class="iconfont icon-shipin  mvico" v-if="item.mv"
										@click="turnMvPage(item.mv)"></span>
								</div>
								<div class="songArtistInfo ">
									<span v-for="it,ind in item.ar" :key="ind" >
										<span class="hover PC" @click="turnSingerPage(it.id)" style="display: inline-block;">{{it.name}}</span>
										<span class="mobile">{{it.name}}</span>
									</span>
									<span class="mobile">-&nbsp;{{item.al.name}}</span>
								</div>
							</div>
						</div>
					</el-col>
					<!-- 专辑名 -->
					<el-col :span="9" class="PC">
						<div class="flexBox">
							<span @click="turnAlbumPage(item.al.id)" style="cursor: pointer;" class="hover">
								{{item.al.name}}
							</span>
						</div>
					</el-col>
					<!-- 播放时长 -->
					<el-col :span="2" class="PC">
						<div class="flexBox ">
							<span>{{setDtime(item.dt)}}</span>
						</div>
					</el-col>
				</div>
			</div>
		</el-row>
	</div>
</template>

<script>
	import {
		turnAlbumPage,
		turnMvPage,
		turnSingerPage
	} from '@/utils'
	export default {
		data() {
			return {

			}
		},
		props: {
			songList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		methods: {
			//跳转MV页面
			turnMvPage(id) {
				turnMvPage.call(this, id)
			},
			//跳转歌手页面
			turnSingerPage(id) {
				turnSingerPage.call(this, id)
			},
			//跳转专辑页面
			turnAlbumPage(id) {
				turnAlbumPage.call(this, id)
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
				this.songList.forEach(item => {
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
	.songRow {
		height: 100%;
		width: 100%;
		border-radius: 10px;
		background-color: #121212;
		opacity: 0.9;
		padding-bottom: 15px;
		border-radius: 10px;

		.title {
			height: 38px;
			display: flex;
			align-items: center;
		}

		.index {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			transform: translateX(-8px);
		}

		.index_1 {
			transform: translateX(-8px);
		}

		.mainArea {
			@keyframes icotap {
				0%{
					color: #fff;
				}
				50%{
					color:  rgba(255, 255, 255, 0.6);
				}
				100%{
					color: #fff;
				}
			}
			
			.playAll{
				display: flex;
				align-items: center;
				margin-top: 5px;
				padding-left: 10px;
				margin-bottom: 10px;
				span{
					font-size: 21px; 
					margin-right: 8px;
					&:hover{
						animation: icotap 0.3s ease forwards;
					}
				}
			}
			.el-col {
				height: 100%;
			}

			.songItem {
				height: 62px;
				padding: 3px 0;

				&:hover {
					background-color: rgba(255, 255, 255, 0.1);
				}

				.songbox {
					display: flex;
					align-items: center;
					height: 100%;

					.songImg {
						display: flex;
						height: 90%;
						aspect-ratio: 1;
						border-radius: 5%;
						overflow: hidden;
						cursor: pointer;

						.el-image__inner {
							height: 100%;
							width: 100%;
						}
					}

					.nameArtist {
						height: 86%;
						width: 75%;
						display: flex;
						flex-wrap: wrap;
						flex-direction: column;
						justify-content: space-between;
						padding-left: 18px;

						.songNameInfo {
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;

							.mvico {
								color: aquamarine;
								opacity: 0.9;
								font-size: 20px;
								margin-left: 5px;
								cursor: pointer;
							}
						}

						.songArtistInfo {
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;

							span {
								margin-right: 5px;
								cursor: pointer;
							}
							span:last-child{
								margin-right: 0;
							}
							
						}
					}
				}

				.flexBox {
					height: 100%;
					display: flex;
					align-items: center;


					span {
						display: block;
					}
				}


			}


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

	}

	@media screen and (max-width:850px) {
		@keyframes tap {
			0%{
				background-color: transparent;
			}
			40%{
				background-color:rgba(255, 255, 255, 0.1);
			}
			100%{
				background-color: transparent;
			}
		}
		
		.songRow{
			padding-top: 8px;
		}
		
		.songItem {
			height: 54px !important;
			&:hover{
				animation: tap 0.3s forwards ease;
			}
		}

		.index_1,.index {
			transform: translateX(0) !important;
		}

		.width10 {
			width: 12% !important;
			transform: translateX(-2px);
		}

		.width90 {
			width: 88% !important;
		}
		
		.mvico {
			color: aliceblue!important;
			z-index: 2;
			position: relative;
			left: 0px;
			bottom: -2px;
			font-size: 18px;
		}
	}
</style>
