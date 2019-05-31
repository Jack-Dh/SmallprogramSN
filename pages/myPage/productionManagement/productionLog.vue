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
				<van-cell title="预加工时间" :value="disData.expectProcessTime" size="large" />
				<van-cell title="预完工时间" :value="disData.expectCompleteTime" size="large" />
				<van-cell title="生产总量(盒)" :value="disData.totalNumber" size="large" />
				<van-cell title="剩余生产总量(盒)" :value="disData.restNumber" size="large" />
				<van-cell title="选择商品" is-link @click="popShow=true" />
			</view>
		</van-panel>


		<!-- 弹出层 -->
		<van-popup :show="popShow" position="top" close-on-click-overlay @close="onClose" @click-overlay="popShow=false">

		<!-- 	<view class="popupView">
				<text type="text" @click="popShow=false">取消</text>
				<text type="text" @click="popShow=false">确定</text>
			</view> -->
			<van-checkbox-group :value="resultList" @change="onChangeSelect">
				<van-cell-group>
					<van-cell v-for="(item,index) in disData.goodsList" :key="index"  clickable :data-name="item.name"
					 @click="toggle">
					 	<view slot="title">
					 	<view>{{item.name}}</view>
					 	<view style="color: #999999;">
					 		<view>SKU:{{item.sku}}</view>
					 		<!-- <view>库存数量(双):{{item.dispatchQuantity}}</view> -->
					 		<view>规格(双):{{item.specifications }}</view>
					 	</view>
					 </view>
						<van-checkbox :name="item.goodsUuid" />
					</van-cell>


				








				</van-cell-group>
			</van-checkbox-group>








		</van-popup>


		<view class="timebox">

			<van-field label="实际生产数量" required :error-message="errorMessage" type="number" :value="actualProduceQuantity"
			 @change="actualOnChange" />
		</view>



		<view class="timebox" @click='$refs.picker.show'>


			<van-field label="实际生产时间" readonly required :error-message="errorMessageTime" :value="actualProduceTime" />

		</view>
		<!-- :startYear="startYear" -->
		<view class="btnstyle">
			<!-- 时间 选择控件，配合弹起控件一起 -->
			<w-picker :mode="mode" :endYear="endYear" :defaultVal="defaultVals" @confirm="onConfirm" ref="picker" themeColor="#f00"></w-picker>

			<van-button type="info" @click="saveProLog" :disabled="numberState" size="normal">提交</van-button>
			<van-button type="primary" @click="history" size="normal">历史提交</van-button>
		</view>
	</view>
</template>

<script>
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	import cmdInput from "@/components/cmd-input/cmd-input.vue";
	import wPicker from "@/components/w-picker/w-picker.vue";


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
				currentDate: new Date().getTime(),
				minDate: new Date().getTime(),
				errorMessage: '', //实际生产数量错误信息
				errorMessageTime: '', //实际生产时间错误信息
				uuid: '', //UUID
				disData: [], //派单详情数据
				value: '', //实际加工时间
				actualProduceTime: '', //实际生产时间

				actualProduceQuantity: '', //实际生产数量
				restNumber: '', //剩余生产总量
				numberState: false, //根据剩余生产总量判断是否还能再提交

				endYear: 2049,

				title: 'Hello',
				tabList: [{
					mode: "date",
					name: "日期选择",
					value: [0, 2, 30]
				}],
				tabIndex: 0
			}
		},
		computed: {

			mode() {
				return this.tabList[this.tabIndex].mode
			},
			defaultVal() {
				return this.tabList[this.tabIndex].value
			},
			defaultVals() {
				// const date = new Date();

				const date = new Date();
				let yearXb = this.endYear - 2000
				let yearArr = [2000]
				let year = date.getFullYear();
				let month = date.getMonth();
				let day = date.getDate() - 1;


				return [yearXb, month, day]

			},
		},
		onLoad: function(option) {
			const date = new Date();
			console.log(date)
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			toggle(event) {
				console.log(event)
				// const {
				// 	name
				// } = event.currentTarget.dataset;
				// const checkbox = this.selectComponent(`.checkboxes-${name}`);
				// this.toggle();
			},
			onClose(event) {
				console.log(event)

			},
			onChangeSelect(event) {
				console.log(event)
				this.resultList = event.detail

			},



			onConfirm(event) {
				//选择时间确认按钮
				this.actualProduceTime = event.result
				this.errorMessageTime = ''
				console.log(event.result)
				console.log(event)
			},




			history() {
				//历史按钮
				//点击查看详情

				uni.navigateTo({
					url: `historyLog?id=${this.disData.uuid}`
				})

			},
			actualOnChange(event) {
				// event.detail 为当前输入实际生产总量的值
				this.actualProduceQuantity = event.detail
				if (this.actualProduceQuantity > this.restNumber) {
					this.errorMessage = '输入有误，实际生产数量无法大于剩余生产总量'
					this.actualProduceQuantity = ''
				} else {
					this.errorMessage = ''
				}
				console.log(event.detail);
			},

			saveTime(picker) {
				//保存时间数据
				this.actualProduceTime = picker
			},
			saveProLog() {
				//保存生产日志
				let data = {
					dispatchSheetList: [this.disData],
					actualProduceTime: `${this.actualProduceTime} 00:00:00`,
					expectProduceQuantity: this.expectProduceQuantity,
					actualProduceQuantity: parseInt(this.actualProduceQuantity),
			
					goodsUuidList: this.resultList
				}

				// 	errorMessage: '',//实际生产数量错误信息
				// errorMessageTime:'',//实际生产时间错误信息





				if (this.actualProduceQuantity !== '' && this.actualProduceTime !== '') {
					this.$http.post(this.$store.state.saveProducelog, data).then(res => {
						console.log(res)
						if (res.data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '提交成功',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定');
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
				} else if (this.actualProduceQuantity === '' && this.actualProduceTime === '') {
					this.errorMessage = '实际生产数量不能为空'
					this.errorMessageTime = '实际生产时间不能为空'
				} else if (this.actualProduceQuantity === '') {
					this.errorMessage = '实际生产数量不能为空'
				} else if (this.actualProduceTime === '') {
					this.errorMessageTime = '实际生产时间不能为空'
				}



				console.log(data)
			},
			dispatchDetailsQuery() {
				//查询派工单详情

				this.$http.get(this.$store.state.dispatchDetailsbyID, {
					uuid: this.uuid
				}).then(res => {
					console.log(res)
					this.disData = res.data.data
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
		box-sizing: border-box;

		width: 100%;
		height: 60%;

	}
</style>
