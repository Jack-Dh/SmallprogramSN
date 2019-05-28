<template>
	<view class="inventory">
		<view v-for="item in storeList" class="newslist">
			<view @click="Jump(item.uuid)">
				<van-card :title="item.factoryName">

					<view slot="desc">
						<view>商品名称:{{item.goodsName}}</view>
						<view>商品编号:{{item.goodsCode}}</view>
						<view>派工编号:{{item.dispatchCode}}</view>
						<view>工序:{{item.processNode=='weave'?'织造':item.processNode=='seamHead'?'缝头':item.processNode=='stereoType'?'定型':'包装'}}</view>
						<view>库存数量:{{item.inventoryQuantity}}</view>
						<view>已加工数量:{{item.processedQuantity}}</view>
					</view>

				</van-card>
			</view>




		</view>


		<!--3使用组件 -->
		<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '../../../components/uni-load-more.vue';
	var _self,
		page = 1,
		timer = null;
	//定义全局参数,控制数据加载
	export default {
		components: { //2注册组件
			uniLoadMore
		},
		data() {
			return {
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				storeList: [], //库存列表数据
			}
		},
		onLoad() {
			_self = this;
			_self.getinventorylistFun()
		},
		onPullDownRefresh() {
			//下拉刷新的时候请求一次数据
			_self.getinventorylistFun()
		},
		onReachBottom() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_self.inventorylistFun()
			}, 1000);

			// 正常应为:
			// _self.getmorenews();
		},
		methods: {
			getinventorylistFun() {
				//库存列表信息
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.$http.get(this.$store.state.inventorylistData, {
					pageNum: page,
					pageSize: 10
				}).then(res => {
					page++; //得到数据之后page+1
					_self.storeList = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.storeList.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			},



			inventorylistFun() {
				//库存列表信息
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				this.$http.get(this.$store.state.inventorylistData, {
					pageNum: page,
					pageSize: 10
				}).then(res => {
					console.log(res)
					page++; //得到数据之后page+1

					let num = _self.storeList.length //判断数据数组长度是否超过数据的总条目数
					if (num < res.data.totalRecord) {
						res.data.list.forEach(item => {
							_self.storeList.push(item);
						})
						_self.loadingType = 0; //将loadingType归0重置
					} else {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}


					uni.hideNavigationBarLoading(); //关闭加载动画
				})
			},
		},

	}
</script>

<style>
	.van-card {
		margin-bottom: 20upx;
		background: #FFFFFF;
	
	}
	
</style>
