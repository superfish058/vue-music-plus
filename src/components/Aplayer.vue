<template>
	<div>
		<div id="aplayer" style="width: 400px;">
		</div>
	</div>
</template>
<script src="node_modules/colorthief/dist/color-thief.umd.js"></script>
<script>
	import 'aplayer/dist/APlayer.min.css';
	import APlayer from 'aplayer';
	// import ColorThief from 'colorthief'
	import Vue from 'vue';
	export default {
		data() {
			return {
				isPlay: 0,
				recordState:0,//标识初次记录播放状态
				ap:null,
			}
		},
		computed: {
			//删除音乐标识
			deleteMusic() {
				return this.$store.state.deleteMusic
			},
			deleteIndex() {
				return this.$store.state.deleteIndex
			},
			reloadNum() {
				return this.$store.state.reloadNum
			},
			currentMusic() {
				return this.$store.state.musicInfo
			},
			switchIndex() {
				return this.$store.state.switchIndex
			},
			isPlaying() {
				return this.$store.state.isPlay
			}
		},
		mounted() {
			this.ap = this.loadAplayer()
		},
		watch: {
			reloadNum: function() {
				if (this.reloadNum % 3 == 0) {
					if(!this.$store.state.id){
						this.ap.list.clear()
					}
					this.ap.list.add(this.currentMusic)
					if(this.ap.audio.paused){
						this.ap.play()
					}
				}
			},
			switchIndex: function() {
				if (this.switchIndex == -1) return
				this.ap.list.switch(this.switchIndex)
			},
			deleteMusic() {
				if (this.deleteMusic == false) return
				this.ap.list.remove(this.deleteIndex)
				if (this.deleteIndex == this.$store.state.musicInfo.length - 1) {
					this.ap.list.switch(0)
				} else {
					this.ap.list.switch(this.deleteIndex)
				}
				this.$store.state.deleteMusic = false
			},
			isPlaying() {
				if (!this.isPlaying) {
					this.ap.pause()
				}
				if (this.isPlaying) {
					this.ap.play()
				}
			}
		},
		methods: {
			//加载Aplayer
			loadAplayer() {
				const that = this
				const ap = new APlayer({
					container: document.getElementById('aplayer'),
					audio: this.currentMusic,
					fixed: true,
					narrow: false,
					autoplay: true,
					lrcType: 1,
					mutex: true
				});
				ap.on('timeupdate', function() {
					if(!that.recordState){
						that.$store.state.isPlay = true
						that.recordState = 1
					}
					that.$store.state.currentTime = ap.audio.currentTime
					that.$store.state.duration = ap.audio.duration
					if (that.$store.state.seek) {
						that.$store.state.seek = false
						ap.seek(that.$store.state.seekTime);
					}
					//歌词展示
					if (that.$route.path == '/main/selfFM') {
						ap.lrc.hide()
					}
					if (that.$route.path != '/main/selfFM') {
						ap.lrc.show()
					}
					//视频暂停歌曲播放
					if (that.$route.path == '/main/video' && that.isPlay == 1) {
						ap.pause()
						that.isPlay = 0
					}
					if (that.$route.path != '/main/video' && that.isPlay == 0) {
						that.isPlay = 1
					}
				})
				//主题自定义
				const colorThief = new ColorThief();
				const image = new Image();
				const xhr = new XMLHttpRequest();
				const setTheme = (index) => {
					if (ap.list.audios.length == 0) {
						return
					}
					if (index != 0) {
						index = index.index
					}
					this.$store.state.listIndex = index
					this.$store.state.id = this.$store.state.musicInfo[index].songId
					if (!ap.list.audios[index].theme) {
						xhr.onload = function() {
							let coverUrl = URL.createObjectURL(this.response);
							image.onload = function() {
								let color = colorThief.getColor(image);
								ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
								URL.revokeObjectURL(coverUrl)
							};
							image.src = coverUrl;
						}
						xhr.open('GET', ap.list.audios[index].cover, true);
						xhr.responseType = 'blob';
						xhr.send();
					}
				};
				setTheme(ap.list.index);
				ap.on('listswitch', (index) => {
					setTheme(index);
				});
				return ap
			},
		}
	}
</script>

<style lang="less">
	.aplayer-body {
		width: 400px !important;
	}

	.aplayer .aplayer-lrc p {
		color: aliceblue !important;
	}

	.aplayer-lrc {
		text-shadow: none !important;
	}
</style>
