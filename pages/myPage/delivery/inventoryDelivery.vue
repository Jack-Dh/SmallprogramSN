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
				<van-cell title="库存总量" :value="disData.totalSendGoodsQuantity" size="large" />
				<van-cell title="选择商品" is-link @click="popShow=true" />
			</view>
		</van-panel>

		<!-- 弹出层 -->
		<van-popup :show="popShow" position="top" :close-on-click-overlay="true" @click-overlay="popShow=false">

			<!-- 商品信息列表 -->
			<van-card :title="item.name" v-for="(item,index) in disData.goodsList">
				<view slot="desc">
					<view>颜色：{{item.color}}</view>
					<view>sku：{{item.sku}}</view>
					<view>库存数量：{{item.inventoryQuantity}}</view>
					<van-tag type="danger" size="medium">{{item.brand}}</van-tag>
					<view style="display: flex;justify-content: space-between;align-items: center;">
						<!-- <input v-model="item.actualSendGoodsQuantity" placeholder="发货数量" type="number" @blur="changeStepper"/> -->
						<van-stepper :value="item.actualSendGoodsQuantity" min='0' :max="item.inventoryQuantity"
						 @change="changeStepper" @blur="blurStepper(index)"  @plus="blurStepper(index)" @minus="blurStepper(index)"/>
				
						<text>X{{item.actualSendGoodsQuantity}}</text>
					</view>
				</view>
			</van-card>



<!-- plus -->




			<van-goods-action>
				<van-goods-action-icon icon="cart-o" text="数量" :info="totalNumber" />
				<van-goods-action-icon icon="arrow-up" text="返回" @click="popShow=false" />
				<van-goods-action-button text="发货" @click="delivery" />
			</van-goods-action>

		</van-popup>


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

				restNumber: '', //剩余生产总量
				totalNumber: 0, //总数量
				actualSendGoodsNumber:'',//当前选择商品的数量

			}
		},

		onLoad: function(option) {
			const date = new Date();
			console.log(date)
			this.uuid = option.id
			this.dispatchDetailsQuery()
		},
		methods: {
			changeStepper(event) {
				//数量选择
				console.log(event)
				this.actualSendGoodsNumber=event.detail
			},
			blurStepper(index){
				/**
				 * 通过传递下标，来获取当前商品的发货值
				 * */
				this.disData.goodsList[index].actualSendGoodsQuantity=this.actualSendGoodsNumber
				
				this.totalNumber=0
				this.disData.goodsList.forEach(item=>{
					console.log(item)
					this.totalNumber+=item.actualSendGoodsQuantity
				})
			},
			delivery(){
				/**
				 *半成品 发货
				 * */
			
			if(this.totalNumber!==0){
				
			
				 this.$http.post(this.$store.state.deliverySendgoods,this.disData).then(res=>{
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
				 }else{
					 	uni.showModal({
					 	title: '提示',
					 	content: '发货数量不能为空',
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

		width: 100%;
		height: 100%;

	}
</style>
