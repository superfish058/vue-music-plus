import axios from 'axios'
import Vue from 'vue'

let getMusic = false
let getMusics = false
const actions = {	
	//添加单曲
	async getMusicUrl({
		commit,
		state
	}, id) {
		if(getMusic){
			Vue.prototype.$message('获取歌曲中，请稍后')
			return
		}
		//判断是否为列表中歌曲，是则跳转播放
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
		//不是列表中歌曲，获取新数据
		let url =''
		//标识正在获取歌曲
		getMusic = true
		//获取url
		const {data:res1} = await axios.get('/song/url/v1', {
			params: {
				id,
				level:'exhigh'
			}
		})
		if(res1.code != 200){
			Vue.prototype.$message.error('获取歌曲失败')
			getMusic = false
			return
		}else{
			url = res1.data[0].url
			if(url == null){
				Vue.prototype.$message('音源不可用')
				getMusic = false
				return
			}
		}
		//获取detail
		const res2 = await axios.get('/song/detail', {
			params: {
				ids: id
			}
		})
		let name = res2.data.songs[0].name
		let artists = res2.data.songs[0].ar
		let picUrl = res2.data.songs[0].al.picUrl
		let alName = res2.data.songs[0].al.name
		let mv = res2.data.songs[0].mv
		let alId = res2.data.songs[0].al.id
		let singers = ''
		let singerIds = []
		let songId = id
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
		//获取歌词
		const res3 = await axios.get('/lyric', {
			params: {
				id
			}
		})
		let lyc = res3.data.lrc.lyric
		info.lrc = lyc
		info.url = url
		commit('SetSingleInfo',info)
		// 标识获取音乐完成
		getMusic = false
	},
	
	//添加播放列表
	async sendList({
		commit,
		state
	}, ids) {
		if(getMusics){
			Vue.prototype.$message('获取歌曲列表中,请稍后')
			return
		}
		//开始获取歌曲列表
		getMusics = true
		const {data:res1} = await axios.get('/song/url/v1', {
			params: {
				id: ids,
				level:'exhigh'
			}
		})
		let urls = []
		let idsArray = ids.split(',')
		if(res1.code != 200){
			Vue.prototype.$message.error('获取播放列表失败')
			getMusics = false
			return
		}else{	
			idsArray.forEach(it => {
				res1.data.forEach(item => {
					if (item.id == it) {
						urls.push(item.url)
					}
				})
			})
		}
		
		const res2 = await axios.get('/song/detail', {
			params: {
				ids: ids
			}
		})
		let infos = []
		res2.data.songs.forEach((item,index) => {
			let name = item.name
			let artists = item.ar
			let alName = item.al.name
			let picUrl = item.al.picUrl+'?param=600y600'
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

		//发送歌词请求？？？
		let theIds = ids.split(',')
		let length = theIds.length
		let counts = 0
		theIds.forEach(async(item, index) => {
			let res = await axios.get('/lyric', {
				params: {
					id: item
				}
			})
			infos[index]['url'] = urls[index]
			infos[index]['lrc'] = res.data.lrc.lyric
			counts ++
			if(counts == length){
				commit('SetListInfo',infos)
			}
		})
		
		Vue.prototype.$message.success('获取列表成功')
		getMusics = false
	}

}

export default actions
