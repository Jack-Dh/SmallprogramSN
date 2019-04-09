<template>
	<view class="contents">
		<image class="logos" src="../../static/logoImg/Logo.jpg"></image>
		<view class="content_box">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column">
					<input adjust-position='true' v-model="loginData.usernmae" placeholder="请输入账号" />
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
	export default {
		data() {
			return {
				title: 'Hello',
				loginData: {
					usernmae: '',
					password: ''
				}
			}
		},
		onLoad() {

		},
		methods: {
			login() {
				uni.showLoading({
					title: '加载中'
				});
				uni.request({
					url: 'HTTP://192.168.1.105:3000/login/query',
					success(res) {
						console.log(res);
						setTimeout(function() {
							uni.hideLoading();
						}, 2000);
					}

				})
				console.log(this.loginData)

				// 				Dialog.alert({
				// 					title: '标题',
				// 					message: '弹窗内容',
				// 				}).then(() => {
				// 					// on close
				// 				});
				

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
		height: 400upx;
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
