<template>
	<view class="contents">
		<image class="logos" src="../../static/logoImg/Logo.jpg"></image>
		<view class="content_box">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column">
					<input adjust-position='true' v-model="loginData.username" placeholder="请输入账号" />
					<input adjust-position='true' v-model="loginData.password" placeholder="请输入密码" type="password" />
				</view>
				<view class="uni-btn-v">
					<van-button plain hairline type="danger" @click="login">登录</van-button>
				</view>
			</form>
			<!-- 消息提醒 -->
			<van-dialog id="van-dialog" />



		</view>
	</view>
</template>

<script>
	import Dialog from '../../wxcomponents/vant/dist/dialog/dialog';
	import md5 from '../../common/md5.js'
	export default {
		data() {
			return {
				loginData: {
					username: '',
					password: '',


				}
			}
		},
		onLoad() {
			/**
			 * 获取vuex全局变量
			 */
			// this.$store.state.nickname

		},
		methods: {

			login() {
				if (this.loginData.username !== '' && this.loginData.password !== '') {
					this.$http.post(this.$store.state.loginApi, this.loginData).then((res) => {
						console.log(res)
						if (res.data.code == 200) {

							uni.setStorageSync('wx_token', res.data.token)

							uni.setStorageSync('wx_sessionID', res.data.SESSIONID)

							uni.setStorageSync('wx_uuid', res.data.data.uuid)

							uni.reLaunch({
								url: '../Home/Home/Home'
							})
						}
					})
				} else {
					uni.showModal({
						title: '账号或密码不能为空',
						showCancel: false
					});
				}
			}
		}
	}
</script>

<style>
	.van-button {
		background: #ffffff;
		border: 1 upx solid #ffffff;
		color: orange;
		margin-top: 30upx;
		width: 260upx;
	}

	input {
		width: 400upx;
		border-bottom: 1upx solid #8F8F94;
		margin-top: 80upx;
	}

	.contents {
		text-align: center;
		height: 100%;
		background: #FFFFFF;

	}

	.logos {
		height: 250upx;
		width: 150upx;
		margin-top: 200upx;
	}

	.content_box {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 50upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
