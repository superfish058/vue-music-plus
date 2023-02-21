<template>
	<div  class="NewMusicRec">
		<!-- 模式选择 -->
		<div class="modeSelect">
			<p ref="modeSelect">
				<span class="selected" @click="changeMode(0)">新歌速递</span>
				<span @click="changeMode(1)">新碟上架</span>
			</p>
		</div>
		<!-- 标签选择 -->
		<div class="tagSelect" ref="typeSelect">
			<span v-for="item,index in tagName" :key="index" @click="selectType(item)">
				{{item[0]}}	
			</span>
		</div>
		<!-- 歌曲板块 -->
		<div class="songMode" v-if="!mode">
			<songListNew :songList="newMusic"></songListNew> 
		</div>
		<!-- 专辑模块 -->
		<div class="songMode" v-if="mode">
			<div style="margin-top: 20px;" class="hotResult">
				<el-col :span="$store.state.mobileMode?8:4" v-for="item,index in newAlbum" :key="index" class="recommend">
					<el-image style="width: 80%; aspect-ratio: 1;" :src="item.blurPicUrl+'?param=300y300'" lazy
						@click="turnAlbumPage(item.id)"></el-image>
					<div style="width: 100%;">
						<p class="main-p">{{item.name}}</p>
					</div>
					<div style="width: 100%;">
						<p class="main-p">{{item.artist.name}}</p>
					</div>
				</el-col>
			</div>
		</div>
	</div>
</template>

<script>
	import songListNew from '@/components/songListNew'
	import {
		turnAlbumPage
	} from '@/utils/index'
	export default {
		data(){
			return{
				tagName:[['全部',0,'ALL'],['华语',7,'ZH'],['欧美',96,'EA'],['日本',8,'JP'],['韩国',16,'KR']],//标签名字
				type:0,//语种类型
				newMusic:[],//音乐列表
				area:'ALL',//地区类型
				newAlbum:[],//专辑列表
				mode:0,//模式
			}
		},
		components:{
			songListNew
		},
		mounted() {
			this.getNewSongList()
			this.selectType(['全部',0,'ALL'])
			this.getNewAlbum()
		},
		beforeRouteEnter(to, from, next) {
			next(vc => {
				vc.$nextTick(() => {
					vc.$store.state.localPage = '最新音乐'
					vc.$store.state.localTop = 'NewMusicRec'
				})
		
			})
		},
		watch:{
			type(){
				if(this.mode==0){
					this.getNewSongList()
				}else{
					this.getNewAlbum()
				}
			},
			mode(){
				if(this.mode==0){
					this.getNewSongList()
				}else{
					this.getNewAlbum()
				}
			}
		},
		methods:{
			//跳转专辑
			turnAlbumPage(id){
				turnAlbumPage.call(this,id)
			},
			//改变模式
			changeMode(num){
				this.$refs.modeSelect.childNodes[num].className = 'selected'
				this.$refs.modeSelect.childNodes[1-num].className = ''
				this.mode = num
			},
			//获取最新专辑
			getNewAlbum(){
				this.$http.get('/album/new',{
					params:{
						area:this.area,
						limit:48
					}
				}).then(res=>{
					this.newAlbum = res.data.albums
				})
			},
			//选择语言类型
			selectType(item){
				let index = 0
				this.tagName.forEach((it,ind) =>{
					if(it[0]==item[0]){
						index = ind
					}
					this.$refs.typeSelect.childNodes[ind].className = ''
				})
				this.$refs.typeSelect.childNodes[index].className = 'selected'
				this.type = item[1]
				this.area = item[2]
			},
			//获取最新音乐
			getNewSongList(){
				this.$http.get('/top/song',{
					params:{
						type:this.type,
						limit:50
					}
				}).then(res=>{
					this.newMusic = res.data.data.slice(0,50)
				})
			}
		}
	}
</script>

<style scoped lang="less">
	
	.hotResult {
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		background-color: #121212;
		opacity: 0.9;
		border: none;
		border-radius: 10px;
		padding: 15px 20px;
		/deep/.el-image {
			box-sizing: border-box;
			overflow: visible;
		}
	
		.img-hidden {
			/deep/img {
				border-radius: 50%;
			}
		}
	
		/deep/.el-image__inner:hover {
			cursor: pointer;
			box-shadow: 1px 1px 3px 1px rgba(55, 55, 55, 0.8), -1px -1px 2px 1px rgba(55, 55, 55, 0.7);
			transition: 0.2s ease;
			opacity: 1;
		}
	}
	
	.recommend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding: 15px 0;
		border-radius: 7px;
	
		p {
			display: flex;
			justify-content: center;
			margin: 3px 0;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: rgba(255,255,255,0.9);
		}
	
		.main-p {
			padding: 0 12px;
			width: auto;
			display: block;
			margin-top: 10px;
			font-weight: 500;
			text-align: center;
		}
	
		transition: 0.2s ease;
	
		&:hover {
			background-color: #2a2a2a;
		}
	}
	
	
	.NewMusicRec{
		height: 100%;
		overflow-y: scroll;
	}
	.modeSelect{
		display: flex;
		margin: 20px auto 40px;
		width: 100%;
		p{
			display: flex;
			justify-content: center;
			width: 100%;
			cursor: default;
			span{
				display: flex;
				border-radius: 5px;
				padding: 5px 7px;
				border: 1.5px solid rgba(255,255,255,0.9);
				margin-right: 20px;
				cursor: pointer;
			}
			.selected,span:hover{
				background-color: #d3d2d2;
				color: #1c1c1b;
				border: 1.5px solid transparent;
			}
		}
		
	}
	
	.tagSelect{
		transform: translateY(-50%);
		padding-left: 10px;
		span{
			margin-right: 10px;
			padding: 2px 2px 3px 3px;
			border: 1.5px solid transparent;
			border-radius: 5px;
			cursor: pointer;
		}
		.selected,span:hover{
			background-color: #d3d2d2;
			color: #1c1c1b;
			border: 1.5px solid transparent;
		}
	}
</style>