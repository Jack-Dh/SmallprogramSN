<template>
	<view class="deliveDetails.vue">
		<van-panel>
			<view>
				<van-cell title="发货编号" :value="historydetailsList.sendCode" size="large" />
				<van-cell title="派工编号" :value="historydetailsList.dispatchCode" size="large" />

				<van-cell title="发货总数" :value="historydetailsList.sendsGoodsTotalQuantity" size="large" />

				<van-cell title="状态" :value="historydetailsList.auditStatus=='sh02'?'审核中':disData.auditStatus=='sh01'?'审核通过':'审核驳回'"
				 size="large" />
				<van-cell title="发货时间" :value="historydetailsList.createTime" size="large" />
				<!-- <van-cell title="填报人" :value="historydetailsList.createName" size="large" /> -->

				<van-collapse :border="false" :value="activeNames" @change="onChange" accordion>
					<van-collapse-item title="商品详情" name="1">
						<view class="goodsdetails" v-for="item in historydetailsList.goodsList">
							<view>商品名称:{{item.name}}</view>
							<view>商家编码:{{item.merchantCode}}</view>
							<view>货品编号:{{item.itemCode}}</view>
							<view>颜色:{{item.colour}}</view>

							<view>品牌:{{item.brand}}</view>
							<view>包装材料:{{item.packag}}</view>
							<view>克重:{{item.weight}}</view>
							<view>面料成分:{{item.ingredients}}</view>
							<view>发货数量:{{item.actualSendGoodsQuantity}}</view>
						</view>

					</van-collapse-item>
				</van-collapse>
			</view>

		</van-panel>


	</view>
</template>

<script>
	export default {
		onLoad: function(option) {

			console.log(option)
			this.sendCode = option.id
			this.historydetails()
		},
		data() {
			return {
				activeNames: '1',
				sendCode: '', //发货编号
				historydetailsList: [], //历史发货明细数据
			}
		},
		methods: {
			onChange(event) {
				console.log(event)
				this.activeNames = event.detail
			},
			historydetails() {
				//发货单详情查询
				this.$http.get(this.$store.state.sendgoodsSelect, {
					sendCode: this.sendCode
				}).then(res => {
					this.historydetailsList = res.data.data
				})
			}
		}
	}
</script>

<style>
</style>
