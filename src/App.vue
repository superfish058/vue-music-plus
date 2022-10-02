<template>
	<div id="app">
		<el-card class="main-card" >
			<router-view></router-view>
		</el-card>
	</div>
</template>

<script>
	export default {

	}
</script>

<style scoped lang="less">
	#app {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		background-image: url('@/assets/bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 0;
		
		/deep/.el-card__body{
			padding: 0;
			min-width: 1200px;
			height: 650px;
		}
		.el-card {
			position: relative;
			z-index: 1;
			margin-top: 20px;
			color: #fff;
			border: 1px solid rgba(0,0,0,0.3);
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
				filter: blur(20px) opacity(50%) ;
			}

		}
	}
</style>
