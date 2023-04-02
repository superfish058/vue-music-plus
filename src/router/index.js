import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '@/views/Discovery'
import Main from '@/views/Main'
// import Search from '@/views/Search'
import SelfFM from '@/views/SelfFM'
import RecVideo from '@/views/RecVideo'
// import Album from '@/views/Items/AlbumPage'
// import PlayList from '@/views/Items/PlayList'
// import Singer from '@/views/Items/Singer'
// import Videos from '@/views/Items/Videos'
import UserPage from '@/views/Items/UserPage'
import PlaylistRec from '@/views/Items/PlaylistRec'
import NewMusicRec from '@/views/Items/NewMusicRec'
import Comment from '@/views/mobile/Comment'

// import SearchPage from '@/views/mobile/SearchPage'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
	routes: [{
		path: '',
		redirect: '/main/discovery'
	}, {
		path: '/main',
		redirect: '/main/discovery'
	},
	{
		path: '/searchPage',
		component: () => import('@/views/mobile/SearchPage')
	},
	{
		path: '/main',
		component: Main,
		children: [{
			path: 'discovery',
			component: Discovery
		},
		{
			path: 'search',
			component: () => import('@/views/Search')
		},
		{
			path: 'selfFM',
			component: SelfFM,
		},
		{
			path: 'comment',
			component: Comment,
		},
		{
			path: 'album',
			component: () => import('@/views/Items/AlbumPage')
		},
		{
			path: 'playlist',
			component: () => import('@/views/Items/PlayList')
		},
		{
			path: 'singer',
			component: () => import('@/views/Items/Singer')
		},
		{
			path: 'recvideo',
			component: RecVideo,
		},
		{
			path: 'video',
			component: () => import('@/views/Items/Videos')
		},
		{
			path: 'userpage',
			component: UserPage
		},
		{
			path: 'playlistRec',
			component: PlaylistRec
		},
		{
			path: 'newMusicRec',
			component: NewMusicRec
		},

		]
	}
	]

})
