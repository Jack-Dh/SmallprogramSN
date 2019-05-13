<template>
	<view class="factoryInformation">
		<van-panel title="工厂详情">
			<view>

				<!-- name: '',//名称
				code: '',//编码
				company: '',//所属公司
				address: '',//地址
				detailedAddress: '',//详细地址信息
				contact: '',//联系人
				phoneNumber: '',//手机号码
				technologys: [],//工艺职能
				remark: '',//备注信息 -->

				<van-cell title="工厂名称" size="large" :value="factorydData.name" />
				<van-cell title="所属公司" size="large" :value="factorydData.company" />
				<van-cell title="联系人" size="large" :value="factorydData.contact" />
				<van-cell title="手机号码" size="large" :value="factorydData.phoneNumber" />
				<van-cell title="地址" size="large" :value="factorydData.address"  />
				<van-cell title="详细地址" size="large" :value="factorydData.detailedAddress"  />
		

			</view>

		</van-panel>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				factorydData: [], //工厂信息
			}
		},
		methods: {
			factoryInformationQuery() {
				//当前用户工厂信息查询
				let userUUID = uni.getStorageSync('wx_uuid')
				this.$http.get(this.$store.state.factoryqueryPage).then(res => {
					this.factorydData = res.data.data
					console.log(res)
				})
			}
		},
		created: function() {
			this.factoryInformationQuery()
		}
	}
</script>

<style>

</style>
