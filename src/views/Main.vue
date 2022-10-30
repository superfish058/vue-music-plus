<template>
	<div id="main">
		<el-container style="height: 100%;">
			<!-- 头部 -->
			<el-header class="border" style="border-bottom: none;height: 60px;">
				<el-row>
					<!-- 历史记录导航 -->
					<el-col :span="4">
						<el-image style="height: 55px;transform: translateY(5px);cursor: pointer;"
							:src="require('@/assets/logo2.png')" fit="fill" @click="$router.push('discovery')">
						</el-image>
					</el-col>
					<el-col :span="4">
						<div class="history">
							<i class="el-icon-arrow-left" @click="$router.go(-1)"></i>
							<i class="el-icon-arrow-right" @click="$router.go(1)"></i>
						</div>
					</el-col>
					<!-- 搜索栏 -->
					<el-col :span="12" class="search">
						<el-autocomplete :placeholder="showkeyword" v-model="searchWords" @select="selectKeyword"
							:fetch-suggestions="querySearch" style="width: 70%;"
							@keyup.enter.native="turnSearch($event)" clearable ref="searchInput">
							<i slot="prefix" class="el-input__icon el-icon-search" @click="turnSearch($event)"></i>
							<template slot-scope="{item}">
								<el-row v-show="searchWords==''">
									<el-col :span="2" style="transform: translateX(-2px);">
										<span>{{hotList.indexOf(item)+1}}</span>
									</el-col>
									<el-col :span="22">
										<div>{{ item.searchWord }}</div>
										<div style="height: 30px;color:#919191;transform: translateY(-5px);">
											{{ item.content }}
										</div>
									</el-col>
								</el-row>
								<el-row v-show="searchWords!=''" style="display: flex;align-items: center;width: 100%;">
									<span>{{item.name}}</span>
									<span v-if="item.tag=='单曲'">&nbsp;-&nbsp;{{item.artists}}</span>
									<span style="margin-left: 10px;" v-if="item.tag=='专辑'">{{item.artists}}</span>
									<el-tag style="position: absolute; right: 0;" size="small" v-if="item.tag=='单曲'"
										type="success">{{item.tag}}</el-tag>
									<el-tag style="position: absolute; right: 0;" size="small"
										v-else-if="item.tag=='专辑'" type="warning">{{item.tag}}</el-tag>
									<el-tag style="position: absolute; right: 0;" size="small" v-else type="info">
										{{item.tag}}
									</el-tag>

								</el-row>
							</template>
						</el-autocomplete>
					</el-col>
					<!-- 登录功能 -->
					<el-col :span="4" style="height: 60px;display: flex;align-items: center;">
						<button class="mini-button" @click="loginVisible=true" v-if="userName==''">登录</button>
						<el-avatar shape="square" size="medium" :src="userImg" v-if="userName!=''"></el-avatar>
						<span class="username" v-if="userName!=''">{{userName}}</span>
						<button class="logout" @click="logout" v-if="userName!=''">退出</button>
					</el-col>
				</el-row>
			</el-header>
			<el-container>
				<!-- 侧边栏导航 -->
				<el-aside width="200px" class="border" style="border-right: none;">
					<el-row>
						<el-col :span="24" class="aside">
							<el-menu background-color="transparent" text-color="#fff" active-text-color="none"
								style="border: none;">
								<router-link to="discovery">
									<el-menu-item index="1">
										<i class="el-icon-discover"></i>
										<span slot="title">发现音乐</span>
									</el-menu-item>
								</router-link>
								<router-link to="selfFM">
									<el-menu-item index="2">
										<i class="el-icon-s-promotion"></i>
										<span slot="title">私人FM</span>
									</el-menu-item>
								</router-link>
								<router-link to="recvideo">
									<el-menu-item index="3">
										<i class="el-icon-video-camera"></i>
										<span slot="title">推荐视频</span>
									</el-menu-item>
								</router-link>
								<router-link to="userpage">
									<el-menu-item index="4">
										<i class="el-icon-star-off"></i>
										<span slot="title">收藏音乐</span>
									</el-menu-item>
								</router-link>
							</el-menu>
						</el-col>
					</el-row>
				</el-aside>
				<!-- 路由展示区 -->
				<el-main class="border" style="width: 1000px; height: 590px;padding: 0;overflow-y: hidden;">
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</el-main>
			</el-container>
		</el-container>
		<!-- 登录对话框 -->
		<el-dialog title="用户登录" :visible.sync="loginVisible" :modal-append-to-body='false'>
			<el-form :model="loginForm" label-position="top" label-width="60px" :rules="loginRules" ref="loginForm"
				hide-required-asterisk>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="loginForm.phone" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<button class="nomal-button" @click="loginVisible=false" style="margin-right: 15px;">取消</button>
				<button class="nomal-button" @click="submitLoginForm('loginForm')"
					style="margin-right: 3px;">确定</button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		Dialog
	} from 'element-ui';
	export default {
		data() {
			return {
				searchWords: '', //搜索关键字
				defaultKeyword: '', //默认搜索关键字
				showkeyword: '', //默认展示关键字
				searchOffset: 0, //搜索偏移量
				loginVisible: false, //登录对话框显示标识
				hotList: [], //热搜列表
				searchSuggest: [],
				loginForm: {
					phone: '',
					password: ''
				}, //用户登录信息
				userName: '', //用户名称
				userImg: '', //用户头像
				userId: '', //用户id
				//表单验证规则
				loginRules: {
					phone: [{
						validator: function(rule, value, callback) {
							if (/^1[34578]\d{9}$/.test(value) == false) {
								callback(new Error("请输入正确的手机号"));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}],
					password: [{
						min: 6,
						max: 15,
						required: true,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur'
					}],

				}
			}
		},
		mounted() {
			this.getLoginStatus()
			this.getHotList()
			this.getSearchDefault()
		},
		methods: {
			//退出登录
				logout() {
				this.$confirm('此操作将退出当前账号, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.get('/logout',{
						time:new Date().valueOf()
					})
					this.hzId = ''
					this.userId = ''
					this.userName = ''
					this.userImg = ''
					this.$store.state.userId = 0,
					this.$store.state.hzId = 0
					setTimeout(()=>{
						this.$http.get('/login/status',{
							time:new Date().valueOf()
						})
					},2000)				
					this.$message({
						type: 'success',
						message: '登出成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//搜索功能
			turnSearch(e) {
				if (e) {
					e.target.blur()
					this.$refs.searchInput.suggestions = []
				}
				if (this.searchWords == '') {
					this.searchWords = this.defaultKeyword
				}
				setTimeout(() => {
					this.$store.state.searchSignal += 1
				}, 50)
				this.$router.push({
					path: 'search',
					query: {
						keyword: this.searchWords
					}
				})

			},
			//提交注册
			submitLoginForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loginVisible = false
						this.login()
					} else {
						return false;
					}
				});
			},
			//登录功能
			login() {
				this.$http.get('/login/cellphone', {
					params: {
						phone: this.loginForm.phone,
						password: this.loginForm.password
					}
				}).then(res => {
					if (res.data.code != 200) {
						this.$message.error('登陆失败')
					} else {
						this.$message.success('登陆成功')
						setTimeout(() => {
							this.getLoginStatus()
						}, 200)

					}
					this.dialogVisible = false
				})
			},
			//获取登录状态
			getLoginStatus() {
				this.$http.get('/login/status').then(res => {
					if (res.data.data.account.type === 0) return
					this.userName = res.data.data.profile.nickname
					this.userImg = res.data.data.profile.avatarUrl
					this.userId = res.data.data.account.id
					this.$store.state.userId = this.userId
				})
				console.log(this.userName, this.userId);
			},
			//搜索建议
			querySearch(keyword, cb) {
				if (this.searchWords == '') {
					cb(this.hotList)
				} else {
					this.getSearchSuggest()
					cb(this.searchSuggest)
				}
			},
			//获取热搜列表
			getHotList() {
				this.$http.get('/search/hot/detail').then(res => {
					this.hotList = res.data.data
				})
			},
			//获取默认搜索
			getSearchDefault() {
				this.$http.get('/search/default').then(res => {
					this.defaultKeyword = res.data.data.realkeyword
					this.showkeyword = res.data.data.showKeyword
				})
			},
			//获取搜索匹配
			getSearchSuggest() {
				this.searchSuggest = []
				this.$http.get('/search/suggest', {
					params: {
						keywords: this.searchWords
					}
				}).then(res => {
					let searchSuggest = res.data.result
					if (searchSuggest['songs']) {
						searchSuggest['songs'].forEach(item => {
							let name = item.name
							let artists = ''
							item.artists.forEach(it => {
								artists += (it.name + '/')
							})
							artists = artists.slice(0, -1)
							this.searchSuggest.push({
								name,
								artists,
								tag: '单曲'
							})
						})
					}
					if (searchSuggest['albums']) {
						searchSuggest['albums'].forEach(item => {
							let name = item.name
							let artists = item.artist.name
							this.searchSuggest.push({
								name,
								artists,
								tag: '专辑'
							})
						})
					}
					if (searchSuggest['artists']) {
						searchSuggest['artists'].forEach(item => {
							let name = item.name
							let artists = item.name
							this.searchSuggest.push({
								name,
								artists,
								tag: '歌手'
							})
						})
					}

				})
			},
			//搜索建议选中
			selectKeyword(item) {
				if (item['name']) {
					if (item.tag != '歌手') {
						this.searchWords = item.name + ' ' + item.artists
						this.turnSearch()
					} else {
						this.searchWords = item.name
						this.turnSearch()
					}

					return
				}
				this.searchWords = item.searchWord
				this.turnSearch()
			}
		}
	}
</script>

<style scoped lang="less">
	#main {
		height: 100%;
		width: 100%;
		background-color: transparent;
		color: #fff;

		.router-link-active {
			text-decoration: none;
		}

		a {
			text-decoration: none;
		}
	}

	.el-menu-item {
		&:hover {

			span,
			i {
				color: aquamarine;
				opacity: 0.9;
			}
		}
	}

	.aside {
		span {
			font-size: 16px;
			letter-spacing: 0.2px;
		}
	}

	.hotIndex {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.username {
		font-size: 14px;
		letter-spacing: 0.1em;
		margin-left: 7px;
		color: rgba(255, 255, 255, 0.8);
	}

	/deep/.el-dialog {
		width: 500px;
		border-radius: 5px;
		letter-spacing: 0.1em;
		background-color: rgba(0, 0, 0, 0.7);
		box-shadow: 0 0 3px rgba(255, 255, 255, 0.8)
	}

	/deep/.el-dialog__title {
		color: rgba(255, 255, 255, 0.8);
	}

	/deep/.el-form-item__label {
		color: rgba(255, 255, 255, 0.8);
	}


	.logout {
		border-radius: 2px;
		margin-left: 8px;
		padding: 3px 5px;
		border: none;
		cursor: pointer;
		background-color: transparent;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.2px;
		transition: 0.2s ease;

		&:hover {
			color: rgba(255, 255, 255, 0.8);
			border: 1px solid rgba(255, 255, 255, 0.4);
			letter-spacing: 0.5px;
			transform: translateY(-0.8px);
		}
	}

	.mini-button {
		padding: 4px 7px;
		border-radius: 5px;
		cursor: pointer;
		background-color: transparent;
		color: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.8);

		&:hover {
			box-shadow: 1px 1px 1px 3px rgba(255, 255, 255, 0.1) inset, -1px -1px 1px 3px rgba(255, 255, 255, 0.1) inset;
			transition: 0.1s ease;
		}
	}

	.nomal-button {
		padding: 6px 12px;
		border-radius: 5px;
		cursor: pointer;
		background-color: transparent;
		color: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.8);

		&:hover {
			box-shadow: 1px 1px 1px 3px rgba(255, 255, 255, 0.1) inset, -1px -1px 1px 3px rgba(255, 255, 255, 0.1) inset;
			transition: 0.1s ease;
		}
	}



	.history {
		height: 60px;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		i {
			margin: 6px 2px;
			font-size: 20px;
			padding: 5px;

			&:hover {
				box-shadow: 1px 1px 10px 2px rgba(255, 255, 255, 0.1) inset;
				transition: 0.1s ease;
			}
		}
	}

	.el-menu-item i {
		color: #fff;
	}

	.border {
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.el-menu-item:hover {
		background-color: rgba(255, 255, 255, 0.1) !important;
	}

	.search {
		height: 60px;
		display: flex;
		align-items: center;
		padding-left: 40px;
	}

	/deep/.el-input__inner {
		background-color: transparent;
		border: 1px solid rgba(255, 255, 255, 0.5);
		color: #fff;
		letter-spacing: 0.2px;
		font-size: 13px;
	}

	/deep/input::-webkit-input-placeholder {
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.1em;
	}

	/deep/.el-input__inner:focus {
		border: 1px solid rgba(255, 255, 255, 0.8);
	}

	/deep/.el-input__inner:hover {
		border: 1px solid rgba(255, 255, 255, 0.8);
	}
</style>
