import axios from 'axios'
axios.defaults.baseURL = 'https://www.hzmusic.top/'
axios.defaults.withCredentials = true


const actions = {
	//添加歌曲至歌单
	addSong({
		commit,
		state
	}, id) {
		if(!id) return
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
	getMusicUrl({
		commit,
		state
	}, id) {
		let theIds = state.ids.split(',')
		let index = theIds.indexOf(id.toString())
		if (index === state.listIndex) return
		if (index != -1) {
			commit('SwitchUrl', index)
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
		axios.get('/song/url', {
			params: {
				id
			}
		}).then(res => {
			url = res.data.data[0].url
			commit('SetUrl', url)
		})
		axios.get('/song/detail', {
			params: {
				ids: id
			}
		}).then(res => {
			name = res.data.songs[0].name
			artists = res.data.songs[0].ar
			picUrl = res.data.songs[0].al.picUrl
			alName = res.data.songs[0].al.name
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
				songId:songId
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
	},
	//添加播放列表
	sendList({
		commit,
		state
	}, ids) {
		console.log(ids);
		state.id = ''
		axios.get('/song/url', {
			params: {
				id: ids
			}
		}).then(res => {
			let urls = []
			let idsArray = ids.split(',')
			idsArray.forEach(it => {
				res.data.data.forEach(item => {
					if (item.id == it) {
						urls.push(item.url)
					}
				})
			})

			commit('SetUrls', urls)
		})

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
					songId:songIds[index]

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


	}

}

export default actions
