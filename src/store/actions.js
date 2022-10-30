import axios from 'axios'
import Vue from 'vue'

let getMusic = false
let getMusics = false
const actions = {
	//添加歌曲至歌单
	addSong({
		commit,
		state
	}, id) {
		axios.get('/playlist/tracks', {
			params: {
				op: 'add',
				pid: state.hzId,
				tracks: id,
				time:new Date().valueOf()
			}
		})
		commit('AddSong',id)
	},
	//移除歌曲出歌单
	removeSong({commit,state},id){
		if(!id) return
		axios.get('/playlist/tracks', {
			params: {
				op: 'remove',
				pid: state.hzId,
				tracks: id,
				time:new Date().valueOf()
			}
		})
		commit('RemoveSong',id)
	},
	//添加单曲
	
	async getMusicUrl({
		commit,
		state
	}, id) {
		if(getMusic){
			Vue.prototype.$message('获取歌曲中，请稍后')
			return
		}
		let switchIndex = -1
		state.musicInfo.forEach((item,index) =>{
			if(item.songId == id){
				switchIndex = index
			}
		})
		if (switchIndex === state.listIndex)return
		if (switchIndex != -1) {
			commit('SwitchUrl', switchIndex)
			return
		}
		let url = ''
		let name = ''
		let artists = []
		let lyc = ''
		let singers = ''
		let picUrl = ''
		let alName = ''
		let singerIds = []
		let songId = id
		let mv = ''
		let alId = ''
		getMusic = true
		const {data:res} = await axios.get('/song/url/v1', {
			params: {
				id,
				level:'exhigh'
			}
		})
		if(res.code != 200){
			Vue.prototype.$message.error('获取歌曲失败')
			getMusic = false
			return
		}else{
			url = res.data[0].url
			if(url == null){
				Vue.prototype.$message('音源不可用')
				getMusic = false
				return
			}
			commit('SetUrl', url)
		}
		axios.get('/song/detail', {
			params: {
				ids: id
			}
		}).then(res => {
			name = res.data.songs[0].name
			artists = res.data.songs[0].ar
			picUrl = res.data.songs[0].al.picUrl
			alName = res.data.songs[0].al.name
			mv = res.data.songs[0].mv
			alId = res.data.songs[0].al.id
			artists.forEach((item) => {
				singers += (item.name + '/')
				singerIds.push(item.id)
			})
			singers = singers.slice(0, -1)
			let info = {
				name,
				singers,
				picUrl,
				alName,
				singerIds,
				songId,
				mv,
				alId
			}
			commit('SetDetail', info)
		})
		axios.get('/lyric', {
			params: {
				id
			}
		}).then(res => {
			lyc = res.data.lrc.lyric
			commit('SetLyric', lyc)
		})
		getMusic = false
	},
	//添加播放列表
	async sendList({
		commit,
		state
	}, ids) {
		state.id = ''
		if(getMusics){
			Vue.prototype.$message('获取歌曲列表中,请稍后')
			return
		}
		getMusics = true
		const {data:res} = await axios.get('/song/url/v1', {
			params: {
				id: ids,
				level:'exhigh'
			}
		})
		let urls = []
		let idsArray = ids.split(',')
		if(res.code != 200){
			Vue.prototype.$message.error('获取播放列表失败')
			getMusics = false
			return
		}else{	
			idsArray.forEach(it => {
				res.data.forEach(item => {
					if (item.id == it) {
						urls.push(item.url)
					}
				})
			})
			commit('SetUrls', urls)
		}
		axios.get('/song/detail', {
			params: {
				ids: ids
			}
		}).then(res => {
			let infos = []
			res.data.songs.forEach((item,index) => {
				let name = item.name
				let artists = item.ar
				let alName = item.al.name
				let picUrl = item.al.picUrl
				let singerIds = []
				let singers = ''
				let songIds = []
				let mv = item.mv
				let alId = item.al.id
				artists.forEach((it) => {
					singers += (it.name + '/')
					singerIds.push(it.id)
				})
				songIds = ids.split(',')
				singers = singers.slice(0, -1)
				infos.push({
					name: name,
					artist: singers,
					cover: picUrl,
					alName: alName,
					singerIds:singerIds,
					songId:songIds[index],
					mv,
					alId

				})
			})
			commit('SetDetails', infos)
		})

		//并发请求(假)
		let theIds = ids.split(',')
		let lycs = []
		let counts = 0
		let indexs = []
		theIds.forEach((item, index) => {
			axios.get('/lyric', {
				params: {
					id: item
				}
			}).then(res => {
				lycs.push(res.data.lrc.lyric)
				indexs.push(index)
				counts++
				if (counts == theIds.length) {
					let trueLycs = []
					indexs.forEach((it0, id0) => {
						let trueindex = indexs.findIndex((theitem, theindex) => {
							return theitem == id0
						})
						let lyc = lycs.find((it, ind) => {
							return ind === trueindex
						})
						trueLycs.push(lyc)
					})
					commit('SetLyrics', trueLycs)
				}
			})
		})
		Vue.prototype.$message.success('获取列表成功')
		getMusics = false
	}

}

export default actions
