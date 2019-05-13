<template>
	<view class="dispatchDetails">
		<van-panel title="派单详情">
			<view>

				<van-cell title="派单编号" :value="disData.dispatchCode" size="large" />
				<van-cell title="派单工厂" :value="disData.factoryName" size="large" />
				<van-cell title="预加工时间" :value="disData.expectProcessTime" size="large" />
				<van-cell title="预完工时间" :value="disData.expectCompleteTime" size="large" />
				<van-cell title="派工工艺" :value="disData.processNode=='weave'?'织造':disData.processNode=='seamHead'?'缝头':disData.processNode=='stereoType'?'定型':'包装'" size="large" />
				<van-cell title="创建时间" :value="disData.createTime" size="large" />
			
			</view>
			<view slot="footer">

			</view>
		</van-panel>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uuid: '', //UUID
				disData: [], //派单详情数据
			}
		},
		onLoad: function(option) {
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			dispatchDetailsQuery() {
				//查询派工单详情

				this.$http.get(this.$store.state.dispatchDetailsbyID, {
					uuid: this.uuid
				}).then(res => {
					console.log(res)
					this.disData = res.data.data
				})
			}
		},

	}
</script>

<style>
</style>
