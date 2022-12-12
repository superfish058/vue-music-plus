import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import actions from './actions.js'
import mutations from './mutations.js'

const store = new Vuex.Store({
  state: {
	musicInfo:[{
		name:'黑暗',
		artist:'黑暗皇子',
		url: "", // 音频文件url
		cover: require('@/assets/logoImg.png'), // 演唱者封面
		lrc: '[00:00.00] (,,•́ . •̀,,) 还没有加载任意音频喵', // 歌词或者歌词文件
		theme:'rgb(0,0,0)',
		singerIds:[0],
		alName:'黑暗降临'
	}],
	currentTime:0,//当前播放时间
	duration:0,//总播放时间
	reloadNum:0,//重新加载播放器
	switchIndex:0,//跳转歌曲下标
	listIndex:0,//当前音乐下标
	searchSignal:0,//搜索发起信号
	id:'',//当前音乐id
	playFM:false,//是否播放FM
	userId:'',//用户id
	deleteMusic:false,//删除歌曲标识
	deleteIndex:0,//删除歌曲下标
	localTop:'',//回到顶部标识
	listChange :false,//歌单列表改变标识符
	localPage:'发现',
	seek:false,
	seekTime:0,
	isPlay:false,//正在播放歌曲标识
	mobileMode:false,//手机模式
  },
  actions,
  mutations
  
})

export default store