<template>
	<view class="dispatchDetails">
		<view class="box">
			<van-panel>
				<view>
					<van-cell title="派单编号" :value="disData.dispatchCode" size="large" />
					<van-cell title="派单工厂" :value="disData.factoryName" size="large" />
					<van-cell title="预加工时间" :value="disData.expectProcessTime" size="large" />
					<van-cell title="预完工时间" :value="disData.expectCompleteTime" size="large" />
					<van-cell title="款式编号" :value="disData.styleCode" size="large" />
					<van-cell title="派工工艺" :value="disData.processNode=='weave'?'织造':disData.processNode=='seamHead'?'缝头':disData.processNode=='stereoType'?'定型':'包装'"
					 size="large" />
					<!-- <van-cell title="加工数量" :value="disData.totalNumber" size="large" /> -->
					<van-cell title="接受状态" :value="disData.receiveState==0?'待处理':disData.receiveState==1?'已接单':'已拒绝'" size="large" />
					<van-cell title="派工人员" :value="disData.dispatchWorker" size="large" />
					<van-cell title="派工时间" :value="disData.createTime" size="large" />
					<van-collapse :border="false" :value="activeNames" @change="onChange" accordion>
						<van-collapse-item title="商品详情" name="1">
						
							<view class="goodsdetails" v-for="item in disData.goodsList">
								<!-- <view>
									<view>商品名称:</view>
									<view>商家编码:</view>
									<view>货品编号:</view>
									<view>颜色:</view>
								</view>
								
								<view>
									<view>品牌:</view>
									<view>包装材料:</view>
									<view>克重:</view>
									<view>面料成分:</view>
								</view> -->
								<view>
									<view>商品名称:{{item.name}}</view>
									<view>商家编码:{{item.merchantCode}}</view>
									<view>货品编号:{{item.itemCode}}</view>
									<view>颜色:{{item.colour}}</view>
								
									<view>品牌:{{item.brand}}</view>
									<view>包装材料:{{item.packag}}</view>
									<view>克重:{{item.weight}}</view>
									<view>面料成分:{{item.ingredients}}</view>
								</view>
								
							</view>
						
						</van-collapse-item>
					</van-collapse>
				</view>

			</van-panel>


		</view>
			<van-tabbar active-color="#7d7e80">
				<van-tabbar-item icon="cross" @click="Refused">拒绝</van-tabbar-item>
				<van-tabbar-item icon="success" @click="accept">接受</van-tabbar-item>
			
			</van-tabbar>
	
		<prompt :visible.sync="promptVisible" title="拒绝原因" @confirm="clickPromptConfirm" @confirms="cancel"></prompt>

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
				uuid: '', //UUID
				disData: [], //派单详情数据
				refuseReason: '', //拒绝原因
				promptVisible: true, //弹出层
				butState: false, //操作按钮
			}
		},
		onLoad: function(option) {
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			onChange(event) {
				console.log(event)
				this.activeNames = event.detail
			},
			cancel() {
				//弹出框取消按钮
				this.promptVisible = true
			},
			clickPromptConfirm(val) {
				//拒绝派工单
				let data = {
					dispatchDetailBeanList: [this.disData],
					receiveState: 2,
					refuseReason: val
				}

				if (val != '') {
					this.$http.post(this.$store.state.saveState, data).then(res => {
						if (res.data.code == 200) {
							uni.showModal({
								title: '操作成功！',
								showCancel: false,
								success(res) {
									that.promptVisible = true
									that.dispatchDetailsQuery()
									// that.dispatchDetailsQuery()
									if (res.confirm) {
										console.log('用户点击确定');
										uni.reLaunch({
											url: '../myPage/myPage'
										});
									}

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

				if (this.disData.receiveState !== 0) {
					uni.showModal({
						title: '提示',
						content: '已经操作过的订单，无法再次操作！',
						showCancel: false
					});

				} else {
					this.promptVisible = false
				}



			},
			accept() {
				if (this.disData.receiveState !== 0) {
					uni.showModal({
						title: '提示',
						content: '已经操作过的订单，无法再次操作！',
						showCancel: false
					});

				} else {
					let that = this
					//接受按钮
					let data = {
						dispatchDetailBeanList: [this.disData],
						receiveState: 1,

					}

					uni.showModal({
						title: '操作',
						content: '确认接受该条派工单？',
						showCancel: true,
						success(res) {
							if (res.confirm) {
								that.$http.post(that.$store.state.saveState, data).then(res => {
									// if (res.data.code == 200) {
									// 	that.butState = true
									// 	that.dispatchDetailsQuery()
									// }

									if (res.data.code == 200) {
										uni.showModal({
											title: '提示',
											content: '操作成功！',
											showCancel: false,
											success(res) {
												that.butState = true
												that.dispatchDetailsQuery()
												if (res.confirm) {
													console.log('用户点击确定');
													uni.reLaunch({
														url: '../myPage/myPage'
													});
												}
											}
										});
										// this.butState = true
									}
								})
							}
						}

					});
				}




			},

			dispatchDetailsQuery() {
				//查询派工单详情
				this.$http.get(this.$store.state.dispatchDetailsbyID, {
					uuid: this.uuid
				}).then(res => {
					console.log(res)
					this.disData = res.data.data
					if (res.data.data.receiveState !== 0) {
						this.butState = true
					}
				})
			}
		},

	}
</script>

<style>
	.goodsdetails{
		display: flex;
	/* 	justify-content: space-between; */
		/* justify-content: space-around; */
		margin-top: 20upx;
		background-color: #FFFFFF;
	}
	
	.box{
		 margin-bottom: 150upx;
	}
	.boxButon {
		display: flex;
		justify-content: space-around;
		margin-top: 20upx;

	}

	.boxButon .van-button {
		width: 200upx;
	}

	.dispatchDetails {
		background-color: #f2f3f5;
	}
</style>
