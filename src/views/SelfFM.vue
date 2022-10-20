<template>
	<div>
		<el-row style="overflow: hidden;">
			<el-col :span="12">
				<!-- 专辑图片 -->
				<el-row style="display: flex;justify-content: center;margin-top: 60px;">
					<el-image style="width: 320px; height: 320px;border-radius: 10px;" :src="currentMusicInfo.cover"
						fit="cover"></el-image>
				</el-row>
				<el-row style="display: flex;justify-content: center;">
					<!-- 功能区 -->
					<div class="funcIco">
						<!-- 添加/删除音乐到歌单 -->
						<div class="outbox">
							<i class="el-icon-folder-add hover" style="cursor: pointer;" @click="addSong()" v-if="!currentIn"> </i>
							<i class="el-icon-folder-remove hover" style="cursor: pointer;" @click="removeSong()" v-else> </i>
						</div>
						<!-- 从列表删除音乐 -->
						<div class="outbox">
							<span class="iconfont icon-lajitong hover" style="cursor: pointer;" @click="deleteMusic()"></span>
						</div>
						<!-- 下一首 -->
						<div class="outbox">
							<span class="iconfont icon-xiayigexiayishou hover" style="cursor: pointer;" @click="nextSong()"></span>
						</div>
						<div class="outbox">
							<span class="iconfont icon-gengduo"></span>
						</div>
					</div>
				</el-row>
			</el-col>
			<!-- 歌曲信息区 -->
			<el-col :span="12" style="color: rgba(255,255,255,.85);transform: translateX(-60px);" :key="currentId">
				<span :style="{background:themeColor}" class="colorTheme" @click="setColor=!setColor">&nbsp;</span>
				<el-row style="margin-top: 16px; font-size: 22px;letter-spacing: 0.1em;display: flex;
					height: 48px; justify-content: center;">
					<p class="onlyOne">
						<span style="margin-right: 5px;">{{currentMusicInfo.name}}</span>
						<span class="iconfont icon-shipin"
							style="color:aquamarine;opacity: 0.9;font-size: 24px;cursor: pointer;display: inline-block;transform: translateY(1px);"
							v-if="currentMusicInfo.mv" @click="turnMvPage(currentMusicInfo.mv)"></span>
					</p>
				</el-row>
				<el-row style="font-size: 18px;display: flex;justify-content: center;">
					<p class="onlyOne">
						<!-- 歌手 -->
						<span v-for="(item,index) in currentMusicInfo.artist.split('/')" :key="index"
							style="margin-right: 5px;cursor: pointer;" class="hover" @click="turnSingerPage(currentMusicInfo.singerIds[index])">
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
	export default {
		data() {
			return {
				timeArr: [], //歌词时间
				lrcArr: [], //歌词内容
				offsetTop: [], //歌词卷积高度
				setColor: true, //设置主题色
				themeColor: 'rgba(255,255,255,0.9)',
				currentIn:false
			}
		},
		computed: {
			currentMusicInfo() {
				return this.$store.state.musicInfo[this.$store.state.listIndex]
			},
			currentId() {
				return this.$store.state.id
			},
			currentTime() {
				return this.$store.state.currentTime
			},
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.setLyric()
			})
		},
		watch: {
			currentMusicInfo() {
				this.setLyric()
			},
			currentTime() {
				this.timeup()
			}
		},
		methods: {
			//下一首
			nextSong(){
				if(this.$store.state.musicInfo.length <= 1){
					this.$message.warning('切不了歌呢')
					return
				}
				if(this.$store.state.listIndex != this.$store.state.musicInfo.length-1){
					this.$store.commit('SwitchUrl',(this.$store.state.listIndex +1)) 

				}else{
					this.$store.commit('SwitchUrl',0) 
				}
				
			},
			//删除音乐
			deleteMusic(){
				if(!this.$store.state.hzId){
					this.$message.error('请先登录哦')
					return
				}
				if(this.$store.state.musicInfo.length <= 1){
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
				}).catch(()=>{
					return
				})
				
			},
			//判断是否在当前页
			judgeCurrentIn(){
				if(this.$route.path != '/main/selfFM') return
				this.currentIn = this.inIds(this.currentMusicInfo.songId)
			},
			//判断是否被收藏
			inIds(id){
				let inids = false
				let ids =  this.$store.state.hzPLayListIds
				ids.forEach(item =>{
					if(id == item){
						inids = true
					}
				})
				return inids
			},
			//添加歌曲至歌单
			addSong() {
				if(!this.$store.state.hzId){
					
					this.$message.error('请先登录哦')
					return
				}
				if(!this.$store.state.id){
					this.$message.warning('这首歌曲不能添加哦')
					return
				}
				this.$message.success('添加成功')
				this.$store.dispatch('addSong',this.currentMusicInfo.songId)
				this.judgeCurrentIn()
			},
			removeSong() {
				this.$confirm('确定要取消收藏本首歌曲?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$store.dispatch('removeSong',this.currentMusicInfo.songId)
					this.judgeCurrentIn()
					this.$message({
						type: 'success',
						message: '取消成功!'
					});
				}).catch(()=>{
					return
				})
			},
			//跳转MV页面
			turnMvPage(id) {
				this.$router.push({
					path: '/main/video',
					query: {
						mvId: id
					}
				})
			},
			//跳转歌手页面
			turnSingerPage(id) {
				if(!id) return
				this.$router.push({
					path: '/main/singer',
					query: {
						singerId: id
					}
				})
			},
			//跳转专辑界面
			turnAlbumPage(id) {
				if(!id) return
				this.$router.push({
					path: '/main/album',
					query: {
						albumId: id
					}
				})
			},
			//重新加载界面
			timeup() {
				if (this.lrcArr != '') {
					let index = this.timeArr.findIndex(item => item >= ('0' + this.lytime(this.currentTime + 0.1)))
					index -= 1
					if (index >= -2) {
						if (index == -1) {
							index = 0
						} else if (index == -2) {
							index = this.timeArr.length - 1
						}
						if (this.offsetTop.length != this.lrcArr.length && this.$refs.lyli[0].innerHTML) {
							let length = this.lrcArr.length
							let offsetTop = 156
							for (let index = 0; index < length; index++) {
								offsetTop = offsetTop - this.$refs.lyul.children[index].getBoundingClientRect().height
								this.offsetTop.push(offsetTop)
							}
						}
						this.$refs.lyul.style.top = this.offsetTop[index] + 'px'
						let ind = 0
						if (!this.currentMusicInfo.theme)return
						this.themeColor = this.currentMusicInfo.theme
						let numArr = this.currentMusicInfo.theme.match(/\d+/g)
						let addFilter = numArr.every(item => {
							return item < 125
						})
						for (let item of this.$refs.lyul.children) {
							if (ind == index) {
								if (this.setColor == false) {
									this.themeColor = 'rgba(114, 229, 191,0.9)'
								}
								item.style = `color:${this.themeColor};`
								if (addFilter && this.setColor) {
									item.className = 'filter'
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
				this.judgeCurrentIn()
				this.timeArr = timeArr
				this.lrcArr = lrcArr
				this.offsetTop = []
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
	.onlyOne {
		height: 100%;
		padding: 0 12px;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
	}

	.colorTheme {
		position: absolute;
		display: flex;
		cursor: pointer;
		z-index: 99;
		top: 20px;
		right: 30px;
		height: 20px;
		width: 40px;
		border-radius: 5px;
		user-select: none;
		filter: brightness(0.9) drop-shadow(0.7px 0.7px 0.7px rgba(255, 255, 255, 0.8));
	}

	.lyarea {
		position: relative;
		top: 20px;
		height: 385px;
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
				line-height: 28px;
				letter-spacing: 0.5px;
				text-align: center;
			}

			li.active {
				font-size: 20px;
				line-height: 30px;
				// letter-spacing: 1px;
				// filter: brightness(1.2);
			}

			li.filter {
				font-size: 20px;
				font-weight: bold;
				line-height: 30px;
				filter: brightness(0.9) drop-shadow(0.7px 0.7px 0.7px rgba(255, 255, 255, 0.8));
			}
		}

	}

	.funcIco {
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

			}
		}
	}
</style>
