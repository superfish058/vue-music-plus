<template>
	<div>
		<div id="aplayer" style="width: 400px;">
		</div>
	</div>
</template>

<script>
	import 'aplayer/dist/APlayer.min.css';
	import APlayer from 'aplayer';
	import ColorThief from 'colorthief'
	import Vue from 'vue';
	export default {
		data() {
			return {
				isHide: 0, //关闭歌词标识
				isPlay: 1, //歌曲播放标识
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
		},
		mounted() {
			this.loadAplayer()
		},
		watch: {
			reloadNum: function() {
				if (this.reloadNum % 3 == 0) {
					this.loadAplayer()
				}
			},
			switchIndex: function() {
				if (this.switchIndex == -1) return
				let ap = this.loadAplayer()
				ap.list.switch(this.switchIndex)
			},
			deleteMusic() {
				if (this.deleteMusic == false) return
				let ap = this.loadAplayer()
				ap.list.remove(this.deleteIndex)
				if (this.deleteIndex == this.$store.state.musicInfo.length-1) {
					ap.list.switch(0)
				} else {
					ap.list.switch(this.deleteIndex)
				}
				this.$store.state.deleteMusic = false
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
					theme: '#',
					preload: true,
					mutex: true
				});
				ap.on('timeupdate', function() {
					that.$store.state.currentTime = ap.audio.currentTime
					if (that.$route.path == '/main/selfFM' && that.isHide == 0) {
						ap.lrc.hide()
						that.isHide = 1
					}
					if (that.$route.path != '/main/selfFM' && that.isHide == 1) {
						that.isHide = 0
						ap.lrc.show()
					}
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
