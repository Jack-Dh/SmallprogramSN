<template>
	<view>
		<van-tabs :active="active">
			<van-tab title="发货管理">

				<view style="flex: 1;" class="Distributeleaflets">
					<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @confirm="doSearch(false)"
					 v-model="dispatchCode"></mSearch>
					<view v-for="item in newsList" class="newslist">
						<view @click="Jump(item.uuid)">
							<van-card :title="item.factoryName">
								<view slot="desc">
									<view>派工单号：{{item.dispatchCode}}</view>
									<view>款式编号：{{item.styleCode}}</view>
								</view>
								<view slot="footer" class="vanTag">
									<van-tag plain type="danger" v-for="j in item.processNodeList">
										{{j=='weave'?'织造':j=='seamHead'?'缝头':j=='stereoType'?'定型':'包装'}}</van-tag>

									<van-tag style="margin-left: 20upx;" plain type="danger">
										{{item.receiveState=='3'?'已完结':'未完结'}}</van-tag>
								</view>
							</van-card>
						</view>
					</view>

					<!--3使用组件 -->
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
				</view>





			</van-tab>
			<van-tab title="历史发货">
				<view style="flex: 1;" class="Distributeleaflets">
					<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="sendCodeSearch(false)" @confirm="sendCodeSearch(false)"
					 v-model="sendCode"></mSearch>
					<view v-for="item in historyList" class="newslist">
						<view @click="historyJump(item.sendCode)">
							<van-card :title="item.factoryName">
								<view slot="desc">
									<view>发货编号：{{item.sendCode}}</view>
									<view>派工编号：{{item.dispatchCode}}</view>
									<view>发货总数：{{item.sendsGoodsTotalQuantity}}</view>
									<view>发货时间：{{item.createTime}}</view>
								</view>
							</van-card>
						</view>
					</view>

					<!--3使用组件 -->
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
				</view>


			</van-tab>

		</van-tabs>
	</view>



</template>

<script>
	//1引入组件 uni-load-more.vue
	import uniLoadMore from '../../../components/uni-load-more.vue';
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	var _self,
		page = 1,
		timer = null;
	//定义全局参数,控制数据加载


	export default {
		components: { //2注册组件
			uniLoadMore,
			mSearch
		},
		data() {
			return {
				active: 0,
				dispatchCode: '', //派工单编号
				sendCode: '', //发货单编号
				newsList: [], //派工单数据
				historyList: [], //历史发货数据
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}


			}

		},
		onLoad: function() {
			_self = this;
			//页面一加载时请求一次数据
			_self.getnewsList() //派单信息
			_self.historysendgoods() //历史发货数据
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			_self.getnewsList() //派工单
			_self.historysendgoods() //历史发货数据
		},
		onReachBottom: function() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_self.getmorenews(); //派工单
				_self.historymorenews(); //历史发货数据
			}, 1000);

			// 正常应为:
			// _self.getmorenews();
		},

		methods: {
			Jump(uuid) {
				//点击派工单查看详情
				console.log(uuid)
				uni.navigateTo({
					url: `inventoryDelivery?id=${uuid}`
				})
			},
			historyJump(code){
				//查看历史发货详情
					uni.navigateTo({
					url: `deliveDetails?id=${code}`
				})
			},
			doSearch(key) {
				//执行搜索（派工单）
				this.getnewsList()
				console.log(this.dispatchCode)

			},
			sendCodeSearch(key) {
				//执行搜索（历史发货单）
				this.historysendgoods()
			},
			getmorenews: function() {
				// 派工单信息下拉刷新查询
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.dispatchlist, {
					pageNum: page,
					pageSize: 10,
					receiveState: 1,
				}).then(res => {

					page++; //得到数据之后page+1

					let num = _self.newsList.length //判断数据数组长度是否超过数据的总条目数
					if (num < res.data.totalRecord) {
						res.data.list.forEach(item => {
							_self.newsList.push(item);
						})
						_self.loadingType = 0; //将loadingType归0重置
					} else {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}


					uni.hideNavigationBarLoading(); //关闭加载动画
					console.log(res)
				})

			},

			getnewsList: function() {
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.dispatchlist, {
					pageNum: page,
					pageSize: 10,
					receiveState: 1,
					dispatchCode: this.dispatchCode
				}).then(res => {
					page++; //得到数据之后page+1
					_self.newsList = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.newsList.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}



				})
			},

			historymorenews() {
				// 历史发货单信息下拉刷新查询
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.sendgoodsList, {
					pageNum: page,
					pageSize: 10,
					receiveState: 1,
				}).then(res => {

					page++; //得到数据之后page+1

					let num = _self.historyList.length //判断数据数组长度是否超过数据的总条目数
					if (num < res.data.totalRecord) {
						res.data.list.forEach(item => {
							_self.historyList.push(item);
						})
						_self.loadingType = 0; //将loadingType归0重置
					} else {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}


					uni.hideNavigationBarLoading(); //关闭加载动画
					console.log(res)
				})

			},
			historysendgoods() {
				//发货历史查询
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.$http.get(this.$store.state.sendgoodsList, {
					pageNum: page,
					pageSize: 10,
					sendCode: this.sendCode
				}).then(res => {
					page++; //得到数据之后page+1
					_self.historyList = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.newsList.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})

			},

		},
		created: function() {
			// this.dispatchlistQuery()
		}
	}
</script>

<style>
	.Distributeleaflets {
		background-color: #f2f3f5;
		height: 100%;
	}

	.van-card {
		margin-bottom: 20upx;
		background: #FFFFFF;

	}

	.vanTag {
		margin-top: 20upx;
		display: flex;
	}
</style>
