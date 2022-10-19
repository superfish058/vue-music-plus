let flag = 0
let pushUrl = ''
let pushName = ''
let pushArtist = ''
let pushCover = ''
let pushLrc = ''
let pushAlname = []
let pushSongId = ''
let pushSingerIds = []

let flags = 0
let pushUrls = []
let pushInfos = []
let pushLrcs = []
const mutations = {
	//添加专属歌单ID
	AddSong(state,id){
		state.hzPLayListIds.push(id)
	},
	//移除专属歌单ID
	RemoveSong(state,id){
		let ids = state.hzPLayListIds
		let index = ids.indexOf(ids)
		state.hzPLayListIds.splice(index,1)
	},
	//设置音乐地址
	SetUrl(state, url) {
		pushUrl = url
		flag++
		this.commit('setInfo')
	},
	//设置音乐信息
	SetDetail(state, info) {
		pushName = info.name
		pushArtist = info.singers
		pushCover = info.picUrl
		pushAlname = info.alName
		pushSongId = info.songId
		pushSingerIds = info.singerIds
		flag++
		this.commit('setInfo')
	},
	//设置歌词
	SetLyric(state, lyc) {
		pushLrc = lyc
		flag++
		this.commit('setInfo')
	},
	//添加音乐
	setInfo(state) {
		if (flag == 3) {
			flag = 0
			let info = {}
			info['name'] = pushName
			info['lrc'] = pushLrc
			info['artist'] = pushArtist
			info['cover'] = pushCover
			info['url'] = pushUrl
			info['alName'] = pushAlname
			info['songId'] = pushSongId
			info['singerIds'] = pushSingerIds
			
			if (state.musicInfo[0].artist == '黑暗皇子') {
				state.musicInfo = []
			}
			state.musicInfo.unshift(info)
			state.reloadNum += 3
		}
	},
	//设置音乐地址s
	SetUrls(state, urls) {
		pushUrls = []
		urls.forEach(item => {
			pushUrls.push(item)
		})
		flags++
		this.commit('setInfos')
	},
	//设置音乐信息s
	SetDetails(state, infos) {
		pushInfos = []
		infos.forEach(item => {
			pushInfos.push(item)
		})
		flags++
		this.commit('setInfos')
	},
	//设置歌词s
	SetLyrics(state, lycs) {
		pushLrcs = []
		lycs.forEach(item => {
			pushLrcs.push(item)
		})
		flags++
		this.commit('setInfos')
	},
	//合并播放列表数据
	setInfos(state) {
		if (flags != 3) return
		flags = 0
		let musicList = []
		let infos = pushInfos
		let urls = pushUrls
		let lrcs = pushLrcs
		infos.forEach((item, index) => {
			let obj = item
			item['url'] = urls[index]
			item['lrc'] = lrcs[index]
			musicList.push(obj)
		})
		state.musicInfo = musicList
		state.reloadNum += 3
	},
	//跳转播放单曲
	SwitchUrl(state,index){
		state.switchIndex = -1
		setTimeout(()=>{
			state.switchIndex = index
		},10)
		
	}


}

export default mutations
