<template>
	<div id="app">
		<el-card class="main-card" style="height: 650px;">
			<router-view></router-view>
		</el-card>
		<Aplayer></Aplayer>
		<el-backtop target=".target" :visibility-height="400">
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
