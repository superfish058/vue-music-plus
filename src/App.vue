<template>
	<div id="app">
		<el-card class="main-card" style="height: 650px;">
			<router-view></router-view>
		</el-card>
		<Aplayer></Aplayer>
		<el-backtop :target="'.'+localTop" :visibility-height="400" :key="localTop">
			<div>
				TOP
			</div>
		</el-backtop>
	</div>
</template>

<script>
	import Aplayer from '@/components/Aplayer.vue'
	export default {
		components: {
			Aplayer
		},
		data() {
			return {
				find:false,
				created:false
			}
		},
		computed:{
			localTop(){
				return this.$store.state.localTop
			}
		},
		created() {
			this.getLoginStatus()
		},
		methods: {
			getLoginStatus() {
				this.$http.get('/login/status').then(res => {
					if (res.data.data.code != 200) return
					this.$store.state.userId = res.data.data.account.id
					this.getUserPlayList()
				})
			},
			//获取所有歌单并判断是否生成专用歌单，若生成，获取歌单ID
			getUserPlayList() {
				if(this.$store.state.userId==''){
					this.$message('请先登录哦')
					return
				}
				//检测到用户登录，获取用户歌单
				this.$http.get('/user/playlist', {
					params: {
						uid: this.$store.state.userId
					}
				}).then(res => {
					let userPlayList = res.data.playlist
					let hzId = ''
					//判断是否生成专属歌单
					userPlayList.forEach(item => {
						if (item.name == '皇子音乐') {
							hzId = item.id
							this.find = true
						}
					})
					if (this.find) {
						this.$message.success({message:'正在加载歌单',duration:1000})
						this.$store.state.hzId = hzId
					}else{
						//没发现专属歌单，进行歌单生成
						this.createPlayList()
					}
				})
			},
			//生成专用歌单
			createPlayList() {
				if(this.created) return
				this.$http.get('/playlist/create', {
					params: {
						name: '皇子音乐'
					}
				}).then(res =>{
					if(res.data.code == 302){
						this.$message('请先登录哦')
					}else{
						this.created = true
						this.getUserPlayList()
						this.$message.success('已为你生成专用歌单，快去添加歌曲吧')
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	#app {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('@/assets/bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 0;
		
		.el-backtop {
			position: absolute;
			right: 110px !important;
			bottom: 180px !important;
			background-color: transparent;
			color: rgba(255, 255, 255, 0.8);
			font-size: 18px;
			font-weight: 500;
			padding: 5px;
			scroll-behavior: auto;
			transition: 0.2s ease;
		
			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
		
			&:active {
				background-color: rgba(255, 255, 255, 0.2);
			}
		}
		
		.el-card__body {
			padding: 0;
			min-width: 1200px;
			height: 650px;
		}

		.el-card {
			position: relative;
			z-index: 1;
			transform: translateY(-15px);
			color: #fff;
			border: 1px solid rgba(0, 0, 0, 0.3);
			background-color: transparent;

			&::after {
				z-index: -1;
				position: absolute;
				content: '';
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #000;
				filter: blur(20px) opacity(50%);
			}

		}

		/deep/.el-card__body {
			padding: 0;
		}
	}
</style>
