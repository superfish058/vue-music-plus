const mutations = {
	//添加单首歌曲Plus
	SetSingleInfo(state,info){
		let finalInfo = {}
		finalInfo['name'] = info.name
		finalInfo['lrc'] = info.lrc
		finalInfo['artist'] = info.singers
		finalInfo['cover'] = info.picUrl+'?param=600y600'
		finalInfo['url'] = info.url
		finalInfo['alName'] = info.alName
		finalInfo['songId'] = info.songId
		finalInfo['singerIds'] = info.singerIds
		finalInfo['mv'] = info.mv
		finalInfo['alId'] = info.alId
		if(!state.musicInfo[0].url){
			state.musicInfo = []
		}
		state.musicInfo.unshift(finalInfo)
		state.reloadNum += 3
	},
	// 添加歌曲列表Plus
	SetListInfo(state,infos){
		state.musicInfo = infos
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
