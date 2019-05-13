<template>
	<!-- 页面跳转 -->
	<!-- <navigator url="../../login/login" open-type="navigate">
		<view class="struct">
			myPage
		</view>

	</navigator> -->
	<view class="mypage">
		<view class="people">
			<image src="../../../static/logo.png"></image>
			<view class="name">
				<view>{{nickName}}</view>
				<view class="userNamesty">
					<text style="margin-right: 10upx;margin-top: 10upx;">登录账号：</text>
					<text>{{userName}}</text>
				</view>
			</view>
		</view>

		<van-cell title="工厂信息" is-link url="../factoryInformation/factoryInformation" />
		<van-cell title="我的派单" is-link url="../Distributeleaflets/Distributeleaflets" />
		<van-cell title="生产管理" is-link url="../productionManagement/productionManagement" />
	</view>

</template>

<script>
	export default {
		data() {
			return {
				nickName: '', //用户姓名
				userName: '', //登录账号
			};
		},
		methods: {
			InformationQuery() {
				//个人信息查询
				let userUUID = uni.getStorageSync('wx_uuid')
				this.$http.get('http://192.168.2.241:8099/supplychain/api/operator/select', {
					uuid: userUUID
				}).then(res => {
					console.log(res)
					this.nickName = res.data.data.nickname
					this.userName = res.data.data.username
				})
			}

		},
		created: function() {
			this.InformationQuery()
			console.log(66)
		}

	}
</script>

<style>
	.userNamesty {
		font-size: 26upx;
		color: #717171;
	}

	.mypage {
		background-color: #f2f3f5;
		height: 100%;
	}

	.people {
		margin-bottom: 45upx;
		background-color: #FFFFFF;
		height: 200upx;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.people image {
		width: 130upx;
		height: 130upx;
		margin-left: 35upx;
	}

	.name {
		margin-left: 35upx;
	}
</style>
