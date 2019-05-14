<template>
	<view class="logAudit">
		<van-panel>
			<view>
				<van-cell title="生产日志编号" :value="disData.logCode" size="large" />
				<van-cell title="实际生产数量" :value="disData.actualProduceQuantity" size="large" />
				<van-cell title="实际生产时间" :value="disData.actualCompleteTime" size="large" />
				<van-cell title="填报时间" :value="disData.createTime" size="large" />
				<van-cell title="款式编号" :value="disData.styleCode" size="large" />
				<van-cell title="商家编号" :value="disData.itemCode" size="large" />
				<van-cell title="货品编号" :value="disData.itemCode" size="large" />
				<van-cell title="状态" :value="disData.auditStatus=='sh02'?'审核中':disData.auditStatus=='sh01'?'审核通过':'审核驳回'" size="large" />
				<van-cell title="商品名称" :value="disData.goodsName" size="large" />
				<van-cell title="填报人" :value="disData.createName" size="large" />

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
				//查询生产日志单详情
				this.$http.get(this.$store.state.producelogdetail, {
					uuid: this.uuid
				}).then(res => {
					console.log(res)
					this.disData = res.data.data

					if (res.data.data.auditStatus !== 'sh02') {
						that.butState = true
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
					auditStatus: 'sh03',
					refuseReason: val
				}
				let that = this
				if (val != '') {
					this.$http.post(this.$store.state.saveStateProducelog, data).then(res => {
						if (res.data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success() {
									that.promptVisible = true
									that.dispatchDetailsQuery()
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
							that.$http.post(that.$store.state.saveStateProducelog, data).then(res => {
								if (res.data.code == 200) {
									that.butState = true
									that.dispatchDetailsQuery()
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
