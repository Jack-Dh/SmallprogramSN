<template>
	<view class="Home">
		<van-tabs :active="active">
			<van-tab title="派单">
				<view>
					<view style="flex: 1;" class="Distributeleaflets">

						<!-- 	<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @confirm="doSearch(false)"
						 v-model="dispatchCode"></mSearch> -->
						<van-search :value="dispatchCode" use-action-slot :search="getnewsList" @change="valCopy">
							<view slot="action" @click="getnewsList()">搜索</view>
						</van-search>
						<view v-for="item in newsList" class="newslist">
							<view @click="Jump(item.uuid)" class="box">
								<van-card>

									<view slot="desc">
										<view>派工单号:{{item.dispatchCode}}</view>
										<view style="margin-top: 20upx;">款式编号:{{item.styleCode}}</view>
									</view>
									<view slot="tags" class="vanTag">
										<van-tag plain type="danger" v-for="j in item.processNodeList">
											{{j=='weave'?'织造':j=='seamHead'?'缝头':j=='stereoType'?'定型':'包装'}}</van-tag>
										<van-tag style="margin-left: 20upx;" plain type="danger">
											{{item.receiveState==0?'待处理':item.receiveState==1?'已接单':'已拒绝'}}</van-tag>
									</view>

								</van-card>
							</view>

						</view>


					</view>
					<!--3使用组件 -->
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
					<!-- </tabBar> -->

				</view>

			</van-tab>
			<van-tab title="生产日志">

				<view>
					<!-- logCode:this.logCode -->
					<view style="flex: 1;" class="Distributeleaflets">
						<!-- 	<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @confirm="doSearch(false)"
						 v-model="dispatchCode"></mSearch> -->
						<van-search :value="logCode" use-action-slot :search="getnewsListLog" @change="valCopyLog">
							<view slot="action" @click="getnewsListLog()">搜索</view>
						</van-search>
					</view>
					<view v-for="item in newsListLog" class="newslist">
						<view @click="Jumplog(item.uuid)" class="box">
							<van-card :title="'生产日志编号:'+item.logCode">
								<view slot="desc">
									<view>实际生产数量（盒）:{{item.actualProduceQuantity}}</view>
									<view>填报时间:{{item.createTime}}</view>
									<view>派单编号:{{item.dispatchCode}}</view>
									<view>填报人:{{item.applicant}}</view>
								</view>
								<view slot="tags">

									<van-tag :type="item.submitStatus=='tj02'?'':item.auditStatus=='sh02'?'primary':item.auditStatus=='sh01'?'success':'danger'">
										{{item.submitStatus=='tj02'?'未提交':item.auditStatus=='sh02'?'审核中':item.auditStatus=='sh01'?'审核通过':'审核驳回'}}
									</van-tag>

								</view>
							</van-card>
						</view>
					</view>
					<!--3使用组件 -->
					<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
				</view>

			</van-tab>
			<van-tab title="发货管理">
				<view>
					<!-- logCode:this.logCode -->
					<view style="flex: 1;" class="Distributeleaflets">
						<!-- 	<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @confirm="doSearch(false)"
						 v-model="dispatchCode"></mSearch> -->
						<van-search :value="sendCode" use-action-slot :search="gethistoryList" @change="valCopyhistory">
							<view slot="action" @click="gethistoryList()">搜索</view>
						</van-search>
					</view>
					<view v-for="item in historyList" class="newslist">
						<view @click="historyJump(item.sendCode)">
							<van-card :title="item.factoryName">
								<view slot="desc">
									<view>发货编号：{{item.sendCode}}</view>
									<view>派工编号：{{item.dispatchCode}}</view>
									<view>发货总数（双）：{{item.sendsGoodsTotalQuantity}}</view>
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
				newsList: [], //派单数据
				newsListLog: [], //生产日志
				historyList: [], //发货管理
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				logCode: '', //生产日志编号查询
				dispatchCode: '', //派工单单号查询
				sendCode: '', //发货编号
			};
		},
		onLoad: function() {
			_self = this;
			//页面一加载时请求一次数据
			_self.getnewsList()
			_self.getnewsListLog()
			_self.gethistoryList()
			/***
			 * 默认给定未处理数量
			 * */
			// uni.setTabBarBadge({
			// 	index: 0,
			// 	text: '31'
			// });


		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			_self.getnewsList()
			_self.getnewsListLog()
			_self.gethistoryList()
		},
		onReachBottom: function() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_self.getmorenews();
				_self.getmorenewsLog()
				_self.historyLists()
			}, 1000);

			// 正常应为:
			// _self.getmorenews();
		},

		methods: {
			valCopy(val) {
				//派单信息查询数据赋值
				console.log(val)
				this.dispatchCode = val
			},
			valCopyLog(val) {
				//生产日志信息查询数据赋值
				console.log(val)
				this.logCode = val //生产日志编号查询
			},
			valCopyhistory(val) {
				//发货单查询数据赋值
				this.sendCode = val //生产日志编号查询
			},
			Jump(uuid) {
				//点击查看详情
				console.log(uuid)
				uni.navigateTo({
					url: `../../myPage/Distributeleaflets/dispatchDetails?id=${uuid}`
				})
			},
			Jumplog(uuid) {
				//点击跳转生产日志审核
				console.log(uuid)
				uni.navigateTo({
					url: `logAudit?id=${uuid}`
				})
			},
			historyJump(uuid) {
				//点击跳转生产日志审核
				console.log(uuid)
				uni.navigateTo({
					url: `historyAudit?id=${uuid}`
				})
			},
			getmorenews: function() {
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.dispatchlist, {
					pageNum: page,
					pageSize: 10,
					receiveState: 0
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
			getmorenewsLog: function() {
				//生产日志
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.producelogQuery, {
					pageNum: page,
					pageSize: 10,
					submitState: 'tj01',
					auditState: 'sh02',

				}).then(res => {

					page++; //得到数据之后page+1

					let num = _self.newsListLog.length //判断数据数组长度是否超过数据的总条目数
					if (num < res.data.totalRecord) {
						res.data.list.forEach(item => {
							_self.newsListLog.push(item);
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
					receiveState: 0,
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


			getnewsListLog: function() {
				//生产日志
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.producelogQuery, {
					pageNum: page,
					pageSize: 10,
					submitState: 'tj01',
					auditState: 'sh02',
					logCode: this.logCode
				}).then(res => {
					page++; //得到数据之后page+1
					_self.newsListLog = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.newsListLog.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}



				})
			},

			gethistoryList() {
				//发货管理分页查询
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.sendgoodsList, {
					pageNum: page,
					pageSize: 10,
					submitStatus: 'tj01',
					auditStatus: 'sh02',
					sendCode: this.sendCode
				}).then(res => {
					page++; //得到数据之后page+1
					_self.historyList = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.newsListLog.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}



				})
			},
			historyLists() {
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				//我的派工单信息分页查询
				this.$http.get(this.$store.state.sendgoodsList, {
					pageNum: page,
					pageSize: 10,
					submitStatus: 'tj01',
					auditStatus: 'sh02',
					sendCode: this.sendCode
				}).then(res => {
					page++; //得到数据之后page+1
					_self.historyList = res.data.list;
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据
					console.log(res)

					let num = _self.historyList.length //判断数据数组长度是否超过数据的总条目数
					if (num == res.data.totalRecord) {
						_self.loadingType = 2; //没有数据
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				})
			},
			onChange(event) {
				console.log(event)
				console.log(event.detail);
			}
		},

	}
</script>

<style>
	.box {
		background: #FFFFFF;
		margin-bottom: 10upx;
	}

	.Home {
		background-color: #f2f3f5;
	}

	.vanTag {
		margin-top: 20upx;
	}
</style>
