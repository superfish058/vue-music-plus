export const turnSingerPage = function(id) {
	this.$router.push({
		path: '/main/singer',
		query: {
			singerId: id
		}
	})
}

export const turnPlayListPage = function(id) {
	this.$router.push({
		path: '/main/playlist',
		query: {
			listId: id
		}
	})
}

export const turnAlbumPage = function(id) {
	this.$router.push({
		path: '/main/album',
		query: {
			albumId: id
		}
	})
}

export const turnMvPage = function(id) {
	this.$router.push({
		path: '/main/video',
		query: {
			mvId: id
		}
	})
}

export const setDtime = function(dt) {
	let time = new Date(dt)
	let min = time.getMinutes()
	let sec = time.getSeconds()
	if (min == 0) {
		min = '00'
	}
	if (sec < 10) {
		sec = '0' + sec
	}
	return min + ':' + sec
}

export const setDuration = function(dt) {
	if (isNaN(dt)) {
		dt = 0
	}
	let min = Math.floor(dt / 60)
	let sec = Math.floor(dt % 60)
	if (min == 0) {
		min = '00'
	}
	if (sec < 10) {
		sec = '0' + sec
	}
	return min + ':' + sec
}

// export const downloadFile = function(url) {
// 	let domA = document.createElement('a'); // js创建a标签
// 	domA.setAttribute('download', ''); // 给a标签设置download属性
// 	domA.setAttribute('href', url); // 给a标签href属性赋值为要下载文件的路径
// 	domA.click(); // 点击下载
// }
