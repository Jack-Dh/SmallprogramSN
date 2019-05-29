<template>
	<view class="productionLog">

		<van-panel>
			<view>
				<van-cell title="派单编号" :value="disData.dispatchCode" size="large" />
				<van-cell title="款式编号" :value="disData.styleCode" size="large" />
				</van-cell>
				<van-cell title="派工工艺" :value="disData.processNode=='weave'?'织造':disData.processNode=='seamHead'?'缝头':disData.processNode=='stereoType'?'定型':'包装'"
				 size="large" />
				<van-cell title="完结状态" :value="disData.receiveState==1?'未完结':'已完结'" size="large" />
				<van-cell title="剩余发货数量（盒）" :value="disData.totalSendGoodsQuantity" size="large" />
				<van-cell required title="选择商品"  is-link @click="popShow=true" />
			</view>

			<view class="timebox">

				<van-field label="实际发货数量" required :error-message="errorMessage" type="number" :value="actualSendGoodsQuantity"
				 @change="actualOnChange" />
			</view>
		</van-panel>

		<!-- 弹出层 -->
		<van-popup :show="popShow" position="top" :close-on-click-overlay="true" @click-overlay="popShow=false">

			<!-- 商品信息列表 -->
			

			<van-checkbox-group :value="resultList" @change="onChangeSelect">
				<van-cell-group>
					<van-cell v-for="(item,index) in disData.goodsList" :key="index" :data-name="item.name">
						<view slot="title">
							<view>{{item.name}}</view>
							<view style="color: #999999;">
								<view>SKU:{{item.sku}}</view>
								<view>库存数量(双):{{item.dispatchQuantity}}</view>
								<view>规格(双):{{item.specifications }}</view>
							</view>
						</view>
						<van-checkbox :name="item.goodsUuid" />
					</van-cell>
				</van-cell-group>
			</van-checkbox-group>


		</van-popup>

		<view class="btnstyle">
			<van-button type="info" @click="delivery" :disabled="numberState" size="normal">确认发货</van-button>
		</view>
	</view>
</template>

<script>
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	import cmdInput from "@/components/cmd-input/cmd-input.vue";
	import wPicker from "@/components/w-picker/w-picker.vue";

	// Vue.use(Stepper);
	export default {
		components: {
			ruiDatePicker,
			cmdInput,
			wPicker,
		},
		data() {

			return {

				resultList: [], //选择商品数据
				popShow: false, //弹出层

				uuid: '', //UUID
				disData: [], //派单详情数据
				actualSendGoodsQuantity: '', //实际发货数量
				totalSendGoodsQuantity: '', //剩余发货总量
				errorMessage: '', //表单验证报错提示信息


				restNumber: '', //剩余生产总量
				totalNumber: 0, //总数量
				actualSendGoodsNumber: '', //当前选择商品的数量

			}
		},

		onLoad: function(option) {
			const date = new Date();
			console.log(date)
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			onChangeSelect(event) {
				console.log(event)
				this.resultList = event.detail

			},

			actualOnChange(event) {
				// event.detail 为当前输入实际生产总量的值


				// actualSendGoodsQuantity:'',//实际发货数量
				// totalSendGoodsQuantity:'',//剩余发货总量


				this.actualSendGoodsQuantity = event.detail
				if (this.actualSendGoodsQuantity > this.totalSendGoodsQuantity) {
					this.errorMessage = '输入有误，实际发货数量无法大于剩余发货总量'
					this.actualSendGoodsQuantity = ''
				} else {
					this.errorMessage = ''
				}
				console.log(event.detail);
			},


			delivery() {
				/**
				 *半成品 发货
				 * */

				// actualSendGoodsQuantity:'',//实际发货数量
				// totalSendGoodsQuantity:'',//剩余发货总量

				let data = {
					dispatchSheetList: this.disData,
					actualSendGoodsQuantity: Number(this.actualSendGoodsQuantity),
					goodsUuidList: this.resultList,
				}

				if (this.actualSendGoodsQuantity !== '' && this.resultList.length !== 0) {
					this.$http.post(this.$store.state.deliverySendgoods, data).then(res => {
						if (res.data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.reLaunch({
											url: '../myPage/myPage'
										});
									}
								}
							});
						} else {
							uni.showModal({
								title: res.data.msg,
								showCancel: false
							});
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '数据填写不完全',
						showCancel: false,

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
					this.totalSendGoodsQuantity = res.data.data.totalSendGoodsQuantity //剩余发货总量
					this.restNumber = res.data.data.restNumber
					if (this.restNumber == 0) {
						this.numberState = true
					}
				})
			}
		}


	}
</script>

<style>
	.timebox {
		margin-top: 20upx;
		background-color: #FFFFFF;
	}

	.btnstyle {
		text-align: center;


	}

	.van-cell {
		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap;
	}

	.popupView {
		position: relative;
		display: flex;
		top: 0;
		justify-content: space-between;
		margin-bottom: 20upx;
		padding: 10upx;
	}

	.popupView text {
		color: #2d93fa
	}

	.timebox {
		margin-top: 20upx;
		background-color: #FFFFFF;
	}

	.productionLog {
		background-color: #f2f3f5;
		height: 100%;
	}

	.van-card {
		margin-bottom: 20upx;
		background: #FFFFFF;

	}

	.vanTag {
		display: flex;
	}

	.btnstyle {
		text-align: center;
		margin-top: 20upx;


	}



	.van-button {
		width: 600upx;
		margin-bottom: 20upx;
	}




	.van-popup {

		width: 100%;
		height: 60%;

	}
</style>
