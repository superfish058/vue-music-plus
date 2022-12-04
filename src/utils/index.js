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
	let min = Math.floor(dt/60) 
	let sec = Math.floor(dt%60)
	if (min == 0) {
		min = '00'
	}
	if (sec < 10) {
		sec = '0' + sec
	}
	return min + ':' + sec
}


