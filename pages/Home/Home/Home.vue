<template>
	<view>
		<!-- 	<van-tabbar :active="active"  @change="onChange">
			<van-tabbar-item icon="home-o">标签</van-tabbar-item>
			<van-tabbar-item icon="search" dot>标签</van-tabbar-item>
			<van-tabbar-item icon="friends-o" info="5">标签</van-tabbar-item>
		</van-tabbar> -->

		</tabBar>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				active: 0
			};
		},
		onLoad: function() {
			uni.startPullDownRefresh({
				success() {
					uni.showToast({
						title: "刷新成功"
					})
				}
			}); //下拉刷新


								uni.request({
									url: 'http://192.168.2.241:8099/supplychain/api/operator/select',
									data:{uuid:'bbe26852f9dc4030b01637ac7b538e7f'},
									success(res) {
										console.log(res)
									}
								})


		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() { //一秒后自动关闭
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			onChange(event) {
				console.log(event)
				console.log(event.detail);
			}
		},

	}
</script>

<style>

</style>
