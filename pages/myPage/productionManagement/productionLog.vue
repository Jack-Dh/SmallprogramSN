<template>
	<view class="productionLog">
		<van-panel title="生产日志">
			<view>
				<van-cell title="派单编号" :value="disData.dispatchCode" size="large" />
				<van-cell title="派工工艺" :value="disData.processNode=='weave'?'织造':disData.processNode=='seamHead'?'缝头':disData.processNode=='stereoType'?'定型':'包装'"
				 size="large" />
				<van-cell title="预加工时间" :value="disData.expectProcessTime" size="large" />
				<van-cell title="预完工时间" :value="disData.expectCompleteTime" size="large" />
			</view>
		</van-panel>


		<view class="timebox">
			<van-field label="预计生产数量" type="number" :value="expectProduceQuantity" @change="expectOnChange" />
			<van-field label="实际生产数量" type="number" :value="actualProduceQuantity" @change="actualOnChange" />

		</view>



		<view class="timebox">
			<van-cell-group title="实际生产时间">
				<ruiDatePicker fields="second" start="2010-00-00 00:00:00" end="2030-12-30 23:59:59" :value="actualProduceTime"
				 @change="saveTime"></ruiDatePicker>
			</van-cell-group>
		</view>
		<view class="btnstyle">
			<van-button type="primary" @click="saveProLog" size="normal">保存</van-button>
		</view>
	</view>
</template>

<script>
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	import cmdInput from "@/components/cmd-input/cmd-input.vue"
	export default {
		components: {
			ruiDatePicker,
			cmdInput
		},
		data() {
			return {
				uuid: '', //UUID
				disData: [], //派单详情数据
				value: '', //实际加工时间
				actualProduceTime: '', //实际生产时间
				expectProduceQuantity: '', //预计生产总量
				actualProduceQuantity: '', //实际生产数量

			}
		},
		onLoad: function(option) {
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			actualOnChange(event) {
				// event.detail 为当前输入实际生产总量的值
				this.actualProduceQuantity = event.detail
				console.log(event.detail);
			},
			expectOnChange(event) {
				// event.detail 为当前输入预计生产总量的值
				this.expectProduceQuantity = event.detail
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
					actualProduceTime: this.actualProduceTime,
					expectProduceQuantity: this.expectProduceQuantity,
					actualProduceQuantity: this.actualProduceQuantity
				}
				this.$http.post(this.$store.state.saveProducelog, data).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						uni.showModal({
							title: '填写成功',
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

	.van-button {width: 300upx;}
</style>
