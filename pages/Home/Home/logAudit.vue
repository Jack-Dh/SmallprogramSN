<template>
	<view class="logAudit">
		<van-panel title="派单详情">
			<view>
				<van-cell title="生产日志编号" :value="disData.logCode" size="large" />
				<van-cell title="实际生产数量" :value="disData.actualProduceQuantity" size="large" />
				<van-cell title="实际生产时间" :value="disData.actualCompleteTime" size="large" />
				<van-cell title="填报时间" :value="disData.createTime" size="large" />
				<van-cell title="商家编号" :value="disData.itemCode" size="large" />
				<van-cell title="货品编号" :value="disData.processNode" size="large" />
				<van-cell title="商品名称" :value="disData.goodsName" size="large" />
				<van-cell title="填报人" :value="disData.createName" size="large" />
				<van-cell title="款式编号" :value="disData.styleCode" size="large" />
			</view>
			<view slot="footer">
			</view>
		</van-panel>
		<view class="boxButon">
			<van-button type="danger" :disabled="butState" @click="Refused">审核驳回</van-button>
			<van-button type="primary" :disabled="butState" @click="accept">审核通过</van-button>
		</view>

		<!-- <prompt :visible.sync="promptVisible" title="拒绝原因" @confirm="clickPromptConfirm" @confirms="cancel"> -->
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
				uuid: '',
				disData: [],
				refuseReason: '', //拒绝原因
				promptVisible: true, //弹出层
				butState: false, //操作按钮
			}
		},
		onLoad: function(option) {
			this.uuid = option.id
			this.dispatchDetailsQuery()
			console.log(this.uuid)
		},
		methods: {
			dispatchDetailsQuery() {
				//查询派工单详情
				this.$http.get(this.$store.state.producelogdetail, {
					uuid: this.uuid
				}).then(res => {
					console.log(res)
					this.disData = res.data.data
					console.log(res)
					if (res.data.data.receiveState !== 0) {
						this.butState = true
					}
				})
			},
			cancel() {
				//弹出框取消按钮
				this.promptVisible = true
			},
			clickPromptConfirm(val) {
				//审核驳回
					let data = {
					produceLogBeanList: [this.disData],
					auditStatus: 'sh03'
				}
				let that = this
				if (val != '') {
					this.$http.post(this.$store.state.saveState, data).then(res => {
						if (res.data.code == 200) {
							uni.showModal({
								title: '操作成功！',
								showCancel: false,
								success() {
									that.promptVisible = true
								}
							});
							this.butState = true
						}
					})
				} else {
					uni.showModal({
						title: '请输入拒绝原因！',
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
					produceLogBeanList: [this.disData],
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
