import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '@/views/Discovery'
import Main from '@/views/Main'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [{
			path: '',
			redirect: '/main'
		},
		{
			path: '/main',
			component: Main,
			children:[
				{
					path:'discovery',
					component:Discovery
				},
			]
		}
	]

})
