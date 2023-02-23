<template>
	<div class="playListBox">
		<div class="areaSize">
			<el-row class="imgSize" v-if="item.coverImgUrl">
				<div class="recImg">
					<img  :src="item.coverImgUrl+'?param=450y450'"  @click="turnPlayListPage(item.id)"/>
				</div>
			</el-row>
			<el-row class="textArea">
				<p v-if="item">{{item.name}}</p>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		turnPlayListPage
	} from '@/utils/index'
	export default {
		data() {
			return {
				
			}
		},
		props: {
			item: {
				type: Object,
				default:()=>{
					return {
						coverImgUrl:''
					}
				}
			},
		},
		methods:{
			turnPlayListPage(id){
				turnPlayListPage.call(this,id)
			}
		}
	}
</script>

<style scoped lang="less">
	p,span{
		opacity: 0.9;
		cursor: default;
	}
	.playListBox{
		transform: translate3d(0, 0, 0);
	}
	.areaSize{
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.imgSize{
			width: 100%;
			aspect-ratio: 1;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.recImg{
				width: 85%;
				aspect-ratio: 1;
				opacity: 0.9;
				border-radius: 5px;
				overflow: hidden;
				img{
					width: 100%;
					object-fit: cover;
				}
				&:hover{
					cursor: pointer;
					box-shadow: 0px 1px 2px 2px rgba(55, 55, 55, 0.8), -1px -1px 2px 2px rgba(55, 55, 55, 0.8);
					transition: 0.2s ease;
					opacity: 1;
				}
			}
		}
		.textArea{
			transform: translateY(-10%);
			width: 85%;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}
	
</style>
