<template>
	<view class="productionLog">
		<van-panel>
			<view>
				<van-cell title="派单编号" :value="disData.dispatchCode" size="large" />
				<van-cell title="款式编号" :value="item.styleCode" size="large" />
				</van-cell>
				<van-cell title="派工工艺" :value="disData.processNode=='weave'?'织造':disData.processNode=='seamHead'?'缝头':disData.processNode=='stereoType'?'定型':'包装'"
				 size="large" />
				<van-cell title="预加工时间" :value="disData.expectProcessTime" size="large" />
				<van-cell title="预完工时间" :value="disData.expectCompleteTime" size="large" />
				<van-cell title="剩余生产总量" :value="disData.restNumber" size="large" />
			</view>
		</van-panel>


		<view class="timebox">

			<van-field label="实际生产数量" required :error-message="errorMessage" type="number" :value="actualProduceQuantity"
			 @change="actualOnChange" />
		</view>



		<view class="timebox" @click='$refs.picker.show'>
		

			<van-field label="实际生产时间"  readonly :value="actualProduceTime" />

		</view>

		<view class="btnstyle">
			<!-- 时间 选择控件，配合弹起控件一起 -->
			<w-picker :mode="mode" startYear="2019" endYear="2030" step="1" :defaultVal="defaultVal" @confirm="onConfirm" ref="picker"
			 themeColor="#f00"></w-picker>

			<van-button type="info" @click="saveProLog" size="normal">提交</van-button>
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
			wPicker
		},
		data() {
			return {
				currentDate: new Date().getTime(),
				minDate: new Date().getTime(),




				errorMessage: '',
				uuid: '', //UUID
				disData: [], //派单详情数据
				value: '', //实际加工时间
				actualProduceTime: '', //实际生产时间

				actualProduceQuantity: '', //实际生产数量



				title: 'Hello',
				tabList: [{
					mode: "date",
					name: "日期选择",
					value: [0, 1, 0]
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
			}
		},
		onLoad: function(option) {
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {

			onConfirm(event) {
				//选择时间确认按钮
				this.actualProduceTime = event.result
				console.log(event.result)

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
					// actualProduceTime: this.actualProduceTime,
					expectProduceQuantity: this.expectProduceQuantity,
					actualProduceQuantity:parseInt(this.actualProduceQuantity)
				}
				this.$http.post(this.$store.state.saveProducelog, data).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						uni.showModal({
							title: '提示',
							content: '提交成功',
							showCancel: false
						});
					} else {
						uni.showModal({
							title: res.data.msg,
							showCancel: false
						});
					}
				})

				console.log(data)
			},
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
</style>
