<template>
	<div id="main">
		<el-container style="height: 100%;">
			<el-header class="border" style="border-bottom: none;">Header</el-header>
			<el-container>
				<el-aside width="200px" class="border" style="border-right: none;">
					<el-row>
						<el-col :span="24">
							<el-menu background-color="transparent" text-color="#fff" active-text-color="none">
								<el-menu-item index="1">
									<i class="el-icon-discover"></i>
									<span slot="title">发现音乐</span>
								</el-menu-item>
								<el-menu-item index="2">
									<i class="el-icon-s-promotion"></i>
									<span slot="title">私人FM</span>
								</el-menu-item>
								<el-menu-item index="3">
									<i class="el-icon-video-camera"></i>
									<span slot="title">推荐视频</span>
								</el-menu-item>
								<el-menu-item index="4">
									<i class="el-icon-star-off"></i>
									<span slot="title">收藏音乐</span>
								</el-menu-item>

							</el-menu>
						</el-col>
					</el-row>
				</el-aside>
				<el-main class="border">Main</el-main>
			</el-container>
		</el-container>

	</div>
</template>

<script>
	export default {

	}
</script>

<style scoped lang="less">
	#main {
		height: 100%;
		width: 100%;
		background-color: transparent;
		color: #fff;
	}
	
	.el-menu-item i{
		color: #fff;
	}
	
	.border {
		border: 1px solid #fff;
	}
	
	.el-menu-item:hover{
		background-color: rgba(255,255,255,0.1)!important;
	}
</style>
