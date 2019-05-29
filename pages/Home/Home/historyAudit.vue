<template>
	<view class="historyAudit">
		<van-panel>
			<view>
				<van-cell title="发货编号" :value="historydetailsList.sendCode" size="large" />
				<van-cell title="派工编号" :value="historydetailsList.dispatchCode" size="large" />

				<van-cell title="发货总数（盒）" :value="historydetailsList.sendsGoodsTotalQuantity" size="large" />

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
							<view>发货数量（双）:{{item.dispatchQuantity}}</view>
						</view>

					</van-collapse-item>
				</van-collapse>



			</view>
			<view slot="footer">
			</view>
		</van-panel>


		<prompt :visible.sync="promptVisible" title="拒绝原因" @confirm="clickPromptConfirm" @confirms="cancel"></prompt>

		<van-tabbar active-color="#7d7e80">
			<van-tabbar-item icon="close" @click="Refused">审核驳回</van-tabbar-item>
			<van-tabbar-item icon="passed" @click="accept">审核通过</van-tabbar-item>

		</van-tabbar>


	</view>
</template>

<script>
	import Prompt from '../../../components/zz-prompt/index.vue'
	export default {
		components: {
			Prompt
		},
		data() {

			return {
				activeNames: '1',
				sendCode: '', //发货编号
				historydetailsList: [], //历史发货明细数据
				refuseReason: '', //拒绝原因
				promptVisible: true, //弹出层
				butState: false, //操作按钮
			}
		},
		onLoad: function(option) {
			this.sendCode = option.id
			this.historydetails()
			console.log(this.uuid)
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
					console.log(this.historydetailsList)
					console.log(res)
				})
			},
			cancel() {
				//弹出框取消按钮
				this.promptVisible = true
			},
			clickPromptConfirm(val) {
				//审核驳回

				let data = {
					sendCode: this.historydetailsList.sendCode,
					auditStatus: 'sh03',
					refuseReason: val
				}
				let that = this
				if (val != '') {
					this.$http.post(this.$store.state.saveState, data).then(res => {
						if (res.data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success(res) {
									that.promptVisible = true
									// that.dispatchDetailsQuery()
									if (res.confirm) {
										console.log('用户点击确定');
										uni.reLaunch({
											url: 'Home'
										});
									}
								}

							});
							this.butState = true
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请输入拒绝原因',
						showCancel: false
					});
				}


				console.log(data)
			},
			Refused() {
				//拒绝按钮
				this.promptVisible = false

			},
			accept() {
				let that = this
				//审核通过
				let data = {
					sendCode: this.historydetailsList.sendCode,
					auditStatus: 'sh01'
				}

				uni.showModal({
					title: '操作',
					content: '是否确认该操作？',
					showCancel: true,
					success(res) {
						if (res.confirm) {

							that.$http.post(that.$store.state.saveState, data).then(res => {
								if (res.data.code == 200) {
									that.butState = true
									that.historydetails()
									uni.showModal({
										title: '提示',
										content: '操作成功',
										showCancel: false,
										success(res) {

											if (res.confirm) {
												console.log('用户点击确定');
												uni.reLaunch({
													url: 'Home'
												});
											}
										}

									});
								}
							})
						}
					}

				});



			},

		}
	}
</script>

<style>
	.boxButon {
		display: flex;
		justify-content: space-around;
		margin-top: 20upx;

	}

	.boxButon .van-button {
		width: 200upx;
	}
</style>
