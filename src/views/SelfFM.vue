<template>
	<div class="MyMusic">
		<el-row style="overflow: hidden;">
			<!-- 左侧 -->
			<el-col :span="!showMobileLyric ? 12 :24">
				<!-- 歌曲信息区 -->
				<el-row class="mobile">
					<!-- 歌名 -->
					<el-row class="songName">
						<p style="max-width: 80vw;" class="noWrop">{{currentMusicInfo.name}}</p>
						<span class="iconfont icon-shipin mvIco" v-if="currentMusicInfo.mv"
							@click="turnMvPage(currentMusicInfo.mv)"></span>
					</el-row>
					<el-row class="songInfo">
						<span v-for="(item,index) in currentMusicInfo.artist.split('/')||currentMusicInfo.artist" :key="index"
							style="margin-right: 5px;cursor: pointer;max-width: 45vw;" class="hover noWrop"
							@click="turnSingerPage(currentMusicInfo.singerIds[index])">
							{{item}}
						</span>
						<span style="cursor: default;"> - </span>
						<span @click="turnAlbumPage(currentMusicInfo.alId)" style="cursor: pointer;max-width: 45vw;" class="hover noWrop">
							{{currentMusicInfo.alName}}
						</span>
					</el-row>
				</el-row>
				<!-- 图片区 -->
				<el-row class="imgArea"   v-swipeup="nextSong"  v-swipedown="lastSong">
					<el-image class="imgStyle" :src="currentMusicInfo.cover" fit="cover"></el-image>
				</el-row>
				<!-- 功能区 PC-->
				<el-row class="funcArea PC">
					<div class="funcIcos">
						<!-- 添加/删除音乐到歌单 -->
						<div class="outbox">
							<i class="el-icon-folder-add hover" @click="addSong()" v-if="!currentIn"> </i>
							<i class="el-icon-folder-remove hover" @click="removeSong()" v-else> </i>
						</div>
						<!-- 从列表删除音乐 -->
						<div class="outbox">
							<span class="iconfont icon-lajitong hover" @click="deleteMusic()"></span>
						</div>
						<!-- 下一首 -->
						<div class="outbox">
							<span class="iconfont icon-xiayigexiayishou hover" @click="nextSong()"></span>
						</div>
						<div class="outbox">
							<span class="iconfont icon-gengduo"></span>
						</div>
					</div>
				</el-row>
				<!-- 功能区Plus mobile -->
				<el-row class="mobile mobileBottom">
					<!-- 歌词区域 -->
					<div class="lyarea">
						<ul ref="lyulp">
							<li v-for="(item,index) in lrcArr" :key="index" ref="lylip">
								{{item}}
							</li>
						</ul>
					</div>
					<!-- 具体功能区 -->
					<div class="center">
						<div class="funcMobile">
							<div class="left">
								<span class="iconfont icon-shixin" style="font-size: 30px;" @click="addSong()" v-if="!currentIn"></span>
								<span class="iconfont icon-shixin" style="font-size: 30px;color:#fea7a7" @click="removeSong()" v-else></span>
								<span class="iconfont icon-pinglun" style="transform: translateY(3px);"></span>
								<span class="iconfont icon-a-ziyuan567" style="font-size: 24px;"></span>
							</div>
							<div class="right">
								<span class="iconfont icon-liebiao"></span>
								<span class="iconfont icon-androidgengduo"></span>
							</div>
							<!-- 时间线 -->
							<div class="timeLine">
								<span>{{setDuration(this.currentTime)}}</span>
								<span>{{setDuration(this.$store.state.duration)}}</span>
								
							</div>
							<!-- 滑动条 -->
							<div class="slider" v-if="screenWidth<850">
								<el-slider v-model="slideCtime" @change="changeCtime" :show-tooltip="false"
									@input="inputCtime" :max="$store.state.duration ? $store.state.duration :100">
								</el-slider>
							</div>
						</div>

					</div>
				</el-row>
			</el-col>
			<!-- 歌曲信息区 -->
			<el-col :span="!showMobileLyric ? 12 : 24" class="lyricArea" :key="currentId" v-show="!showMobileLyric">
				<!-- 歌词颜色切换 -->
				<span :style="{background:themeColor}" class="colorTheme" @click="setColor=!setColor">&nbsp;</span>
				<!-- 歌名 -->
				<el-row class="songNameArea">
					<p class="onlyOne">
						<span style="margin-right: 5px;">{{currentMusicInfo.name}}</span>
						<span class="iconfont icon-shipin mvIco" v-if="currentMusicInfo.mv"
							@click="turnMvPage(currentMusicInfo.mv)"></span>
					</p>
				</el-row>
				<!-- 创作信息 -->
				<el-row class="songInfoArea">
					<p class="onlyOne">
						<!-- 歌手 -->
						<span v-for="(item,index) in currentMusicInfo.artist.split('/')||currentMusicInfo.artist" :key="index"
							style="margin-right: 5px;cursor: pointer;" class="hover"
							@click="turnSingerPage(currentMusicInfo.singerIds[index])">
							{{item}}
						</span>
						<span style="cursor: default;"> - </span>
						<span @click="turnAlbumPage(currentMusicInfo.alId)" style="cursor: pointer;" class="hover">
							{{currentMusicInfo.alName}}
						</span>
					</p>
				</el-row>
				<el-row>
					<div class="lyarea">
						<ul ref="lyul">
							<li v-for="(item,index) in lrcArr" :key="index" ref="lyli">
								{{item}}
							</li>
						</ul>
					</div>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		turnAlbumPage,
		turnMvPage,
		turnSingerPage,
		setDuration
	} from '@/utils'
	export default {
		data() {
			return {
				timeArr: [], //歌词时间
				lrcArr: [], //歌词内容
				offsetTop: [], //歌词卷积高度
				setColor: true, //设置主题色
				themeColor: 'rgba(255,255,255,0.9)',
				currentIn: false,
				showMobileLyric: false, //显示手机歌词
				screenWidth: null,//屏幕宽度
				slideCtime: 0, //滑动条时间
				lastVal: 0,//滑动时间标识1
				newVal: 0,//滑动时间标识2
				seek: false,//改变时间标识
				addSeek: 0,//初次改变时间
				addFilter: false,//添加亮度滤镜
				setStronger:false,//设置更强亮度
				judgeFilter:false,//判断滤镜
				filterClass:'filter',//默认滤镜
			}
		},
		computed: {
			currentMusicInfo() {
				return this.$store.state.musicInfo[this.currentIndex]
			},
			currentId() {
				return this.$store.state.id
			},
			currentTime() {
				return this.$store.state.currentTime
			},
			currentIndex(){
				return this.$store.state.listIndex
			},
		},
		mounted() {
			this.screenWidth = document.body.clientWidth
			window.onresize = () => {
				return (() => {
					this.screenWidth = document.body.clientWidth
				})()

			}
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.judgeModel()
				vc.setLyric()
				vc.inHzIds(vc.currentId)
				vc.$store.state.localTop = 'MyMusic'
				vc.$store.state.localPage = '音乐'
			})
		},
		watch: {
			currentMusicInfo() {
				this.setLyric()
				this.inHzIds(this.currentId)
			},
			currentTime() {
				this.timeup()
			},
			screenWidth() {
				this.judgeModel()
				this.setLyric()
			}
		},
		methods: {
			// 格式化时间
			setDuration(dt){
				return setDuration(dt)
			},
			// 设置滑动条颜色
			setSliderColor() {
				if(this.screenWidth>850) return
				let slider = document.getElementsByClassName('el-slider__bar')[0]
				let sliderButton = document.getElementsByClassName('el-slider__button')[0]
				slider.style.filter = ''
				sliderButton.style.filter = ''
				slider.style.background = this.themeColor
				sliderButton.style.background = this.themeColor
				sliderButton.style.border = this.themeColor
				if(this.addFilter) {
					if(this.setStronger){
						slider.style.filter = 'brightness(10)'
						sliderButton.style.filter = 'brightness(10)'	
						return
					}
					slider.style.filter = 'brightness(3)'
					sliderButton.style.filter = 'brightness(3)'	
				}
			},
			//清楚滑动抖动
			inputCtime(val) {
				this.lastVal = this.newVal
				this.newVal = val
				if (this.lastVal == this.newVal) return
				if ((this.newVal - this.lastVal) % 1 == 0) {
					this.seek = true
					this.addSeek = 0
				}

			},
			//改变实际播放时间
			changeCtime(val) {
				this.$store.state.seekTime = val
				this.$store.state.seek = true
				this.seek = false
				this.slideCtime = val
			},
			//判断屏幕状态
			judgeModel() {
				if (this.screenWidth < 850) {
					this.showMobileLyric = true
					return
				}
				this.showMobileLyric = false
			},
			//下一首
			lastSong() {
				if (this.$store.state.musicInfo.length <= 1) {
					this.$message.warning('切不了歌呢')
					return
				}
				if (this.$store.state.listIndex != 0) {
					this.$store.commit('SwitchUrl', (this.$store.state.listIndex - 1))
				} else {
					this.$store.commit('SwitchUrl',( this.$store.state.musicInfo.length - 1))
				}
			
			},
			//下一首
			nextSong() {
				if (this.$store.state.musicInfo.length <= 1) {
					this.$message.warning('切不了歌呢')
					return
				}
				if (this.$store.state.listIndex != this.$store.state.musicInfo.length - 1) {
					this.$store.commit('SwitchUrl', (this.$store.state.listIndex + 1))

				} else {
					this.$store.commit('SwitchUrl', 0)
				}

			},
			//删除音乐
			deleteMusic() {
				if (this.$store.state.musicInfo.length <= 1) {
					this.$message.warning('删除不了啦')
					return
				}
				this.$confirm('确定要从播放列表中删除歌曲?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$store.state.deleteIndex = this.$store.state.listIndex
					this.$store.state.deleteMusic = !this.$store.state.deleteMusic
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					return
				})

			},
			//判断是否在当前页
			judgeCurrentIn() {
				if (this.$route.path != '/main/selfFM'){
					return false
				}
				return true
			},
			//判断是否被收藏
			inHzIds(id) {
				if(this.$store.state.hzIds.split(',').includes(id+'')){
					this.currentIn = true
				}else{
					this.currentIn = false
				}
			},
			//添加歌曲至歌单
			addSong() {
				if(!this.currentId){
					this.$message.warning('真调皮')
					return
				}
				this.$store.state.listChange = true
				if(this.$store.state.hzIds!=''){
					this.$store.state.hzIds += (','+this.currentId )
				}else{
					this.$store.state.hzIds += this.currentId
				}
				localStorage.setItem('hzIds',this.$store.state.hzIds)
				this.inHzIds(this.currentId)
				this.$message.success('添加成功')
			},
			//取消收藏
			removeSong() {
				if(this.$store.state.mobileMode){
					this.$store.state.listChange = true
					let hzIds = localStorage.getItem('hzIds')
					hzIds = hzIds.split(',')
					let index = hzIds.findIndex((item)=> item==this.currentId)
					hzIds.splice(index,1)
					this.$store.state.hzIds = hzIds.join(',')
					localStorage.setItem('hzIds',this.$store.state.hzIds)
					this.inHzIds(this.currentId)
					return
				}
				this.$confirm('确定要取消收藏本首歌曲?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$store.state.listChange = true
					let hzIds = localStorage.getItem('hzIds')
					hzIds = hzIds.split(',')
					let index = hzIds.findIndex((item)=> item==this.currentId)
					hzIds.splice(index,1)
					this.$store.state.hzIds = hzIds.join(',')
					localStorage.setItem('hzIds',this.$store.state.hzIds)
					this.inHzIds(this.currentId)
					this.$message({
						type: 'success',
						message: '取消成功!'
					});
				}).catch(() => {
					return
				})
			},
			//跳转MV页面
			turnMvPage(id) {
				turnMvPage.call(this, id)
			},
			//跳转歌手页面
			turnSingerPage(id) {
				if (this.currentMusicInfo.artist == '黑暗皇子') {
					this.$message('黑暗皇子')
					return
				}
				if (!id) return
				turnSingerPage.call(this, id)
			},
			//跳转专辑界面
			turnAlbumPage(id) {
				if (this.currentMusicInfo.alName == '黑暗降临') {
					this.$message('黑暗降临')
					return
				}
				if (!id) return
				turnAlbumPage.call(this, id)
			},
			//歌词更新
			timeup() {
				if(!this.judgeCurrentIn()){
					return
				}
				if (!this.seek) {
					if (this.addSeek == 1) {
						this.slideCtime = this.currentTime
					} else {
						this.addSeek = 1
					}
				}
				let lyul = this.$refs.lyul
				let lyli = this.$refs.lyli
				let mobileTop = 0
				if (this.screenWidth < 850) {
					lyul = this.$refs.lyulp
					lyli = this.$refs.lylip
					mobileTop = -120
				}
				if (this.lrcArr != '') {
					let index = this.timeArr.findIndex(item => item >= ('0' + this.lytime(this.currentTime + 0.1)))
					index -= 1
					if (index >= -2) {
						if (index == -1) {
							index = 0
						} else if (index == -2) {
							index = this.timeArr.length - 1
						}
						if (this.offsetTop.length != this.lrcArr.length && lyli[0].innerHTML) {
							let length = this.lrcArr.length
							let offsetTop = 166
							for (let index = 0; index < length; index++) {
								offsetTop = offsetTop - lyul.children[index].getBoundingClientRect().height
								this.offsetTop.push(offsetTop)
							}
						}
						lyul.style.top = this.offsetTop[index] + mobileTop + 'px'
						// 设置歌词颜色
						let ind = 0
						if (!this.currentMusicInfo.theme) return
						this.themeColor = this.currentMusicInfo.theme
						if (!this.judgeFilter) {
							let numArr = this.currentMusicInfo.theme.match(/\d+/g)
							let addFilter = numArr.every(item => {
								return item < 125
							})
							let setStronger = numArr.every(item => {
								return item < 30
							})
							if (addFilter) {
								if(setStronger){
									this.setStronger = true
									this.filterClass = 'filterPlus'
								}else{
									this.filterClass = 'filter'
								}
								this.addFilter = true
							}
							this.setSliderColor()
							this.judgeFilter = true
						}
						for (let item of lyul.children) {
							if (ind == index) {
								if (this.setColor == false) {
									this.themeColor = 'rgba(114, 229, 191,0.9)'
								}
								item.style = `color:${this.themeColor};`
								if (this.addFilter && this.setColor) {
									item.className = this.filterClass
								} else {
									item.className = 'active'
								}
							} else {
								item.style = ''
								item.className = ''
							}
							ind++
						}
					}
				}
			}, //时间改变时触发,匹配歌词
			setLyric() {
				if (this.currentMusicInfo.url == '') return
				let orlyric = this.currentMusicInfo.lrc
				let aflyric = orlyric.split('\n')
				let timeArr = []
				let lrcArr = []
				const reg = /\[(.+:.+\.\d{1}).+\](.+)/
				for (let item of aflyric) {
					let tmp = reg.exec(item)
					if (tmp) {
						timeArr.push(tmp[1])
						lrcArr.push(tmp[2])
					}
				}
				if(!this.judgeCurrentIn()){
					return
				}
				this.timeArr = timeArr
				this.lrcArr = lrcArr
				this.offsetTop = []
				this.seek = false
				this.addFilter = false
				this.setStronger = false
				this.judgeFilter = false
				
			}, //设置歌词
			lytime(value) {
				let time, sec, min, timePro;
				time = parseFloat(value);
				sec = parseFloat(time % 60).toFixed(1);
				min = parseInt(time / 60);
				timePro = sec < 10 ? min + ':' + '0' + sec : min + ':' + sec
				let newtime = timePro.split('.')
				if (newtime.length == 1) {
					timePro += '.0'
				}
				return timePro
			}, //调整歌词时间精度
		}
	}
</script>

<style scoped lang="less">
	.noWrop{
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	@media screen and (max-width:850px) {
		.PC {
			display: none !important;
		}

		.mobile {
			display: block !important;
			position: relative;

			.songName {
				display: flex;
				justify-content: center;
				font-size: 20px;

				.mvIco {
					color: aquamarine;
					opacity: 0.9;
					font-size: 20px;
					cursor: pointer;
					display: inline-block;
					transform: translate(5px, 3px);
				}
			}

			.songInfo {
				margin-top: 5px;
				display: flex;
				justify-content: center;
				font-size: 16px;
			}
		}

		.mobileBottom {
			height: 30vh;
			width: 100%;
			position: relative;

			.lyarea {
				top: 6px !important;
				height: 73px !important;

				li {
					font-size: 16px !important;
					line-height: 24px !important;
				}

				li.active {
					font-size: 18px !important;
					line-height: 26px !important;
				}

				li.filter {
					font-size: 18px !important;
					line-height: 26px !important;
				}

			}

			.center {
				display: flex;
				justify-content: center;

				.funcMobile {
					width: 100%;
					position: absolute;
					bottom: 10%;
					display: flex;
					width: 40vh;
					min-width: 70vw;
					align-items: center;
					flex-wrap: wrap;

					span {
						font-size: 26px;
						display: flex;
					}

					.left {
						flex: 6;
						display: flex;
						transform: translateY(10px);

						span {
							flex: 1
						}
					}

					.right {
						flex: 4;
						display: flex;
						transform: translateY(10px);
						span {
							flex: 2;
							justify-content: flex-end;

							&:nth-child(1) {
								flex: 3;
							}
						}
					}
					
					.timeLine{
						width: 100%;
						display: flex;
						justify-content: space-between;
						transform: translateY(14px);
						span{
							font-size: 14px;
						}
					}
					
					.slider {
						margin-top: 10px;
						width: 100%;

						/deep/.el-slider__button {
							height: 12px;
							width: 12px;
							background-color: aquamarine;
							border: aquamarine;
						}

						/deep/.el-slider__bar {
							background-color: aquamarine;
						}

						/deep/.el-slider__runway {
							opacity: 0.9;
						}
					}
				}
			}


		}



		.imgArea {
			margin: 0 auto;
			margin-top: 20px !important;
			width: 45vh !important;
			height:  45vh !important;;
			max-width: 85vw !important;
			min-width: 70vw !important;
			.imgStyle {
				width: 45vh !important;
				max-width: 85vw !important;
				min-width: 70vw !important;
			}
		}

	}

	.mobile {
		display: none;
	}

	.imgArea {
		display: flex;
		justify-content: center;
		margin-top: 60px;

		.imgStyle {
			width: 65%;
			min-width: 280px;
			aspect-ratio: 1;
			border-radius: 2%;
		}
	}

	.funcArea {
		display: flex;
		justify-content: center;

		.funcIcos {
			margin-top: 30px;
			display: flex;
			justify-content: space-between;
			width: 320px;

			.outbox {
				display: flex;

				span,
				i {
					border: 2px solid rgba(255, 255, 255, 0.8);
					font-size: 20px;
					padding: 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					cursor: pointer;
				}
			}
		}

	}

	.lyricArea {
		color: rgba(255, 255, 255, .85);
		transform: translateX(-40px);

		.songNameArea {
			margin-top: 16px;
			font-size: 22px;
			letter-spacing: 0.1em;
			display: flex;
			height: 48px;
			justify-content: center;
		}

		.mvIco {
			color: aquamarine;
			opacity: 0.9;
			font-size: 24px;
			cursor: pointer;
			display: inline-block;
			transform: translateY(1px);
		}

		.songInfoArea {
			font-size: 18px;
			display: flex;
			justify-content: center;
		}

		.onlyOne {
			height: 100%;
			padding: 0 12px;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;


		}
	}



	.colorTheme {
		position: absolute;
		display: flex;
		cursor: pointer;
		z-index: 99;
		top: 20px;
		right: 0;
		height: 20px;
		width: 40px;
		border-radius: 5px;
		user-select: none;
		filter: brightness(0.9) drop-shadow(0px 0px 0.7px rgba(255, 255, 255, 0.8));
	}

	.lyarea {
		position: relative;
		top: 29px;
		height: 302px;
		overflow-y: hidden;

		ul {
			padding: 0;
			width: 100%;
			list-style: none;
			position: absolute;
			left: 0;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			transition: top 0.3s linear;

			li {
				color: rgba(255, 255, 255, 0.9);
				width: 100%;
				font-size: 18px;
				font-weight: normal;
				line-height: 27px;
				letter-spacing: 0.6px;
				text-align: center;
			}

			li.active {
				font-size: 20px;
				line-height: 30px;
			}

			li.filter {
				font-size: 20px;
				line-height: 30px;
				filter: brightness(3);
			}
			li.filterPlus {
				font-size: 20px;
				line-height: 30px;
				filter: brightness(10);
			}
		}

	}
</style>
