<template>
	<view>
	<!-- 	<van-tabbar :active="active"  @change="onChange">
			<van-tabbar-item icon="home-o">标签</van-tabbar-item>
			<van-tabbar-item icon="search" dot>标签</van-tabbar-item>
			<van-tabbar-item icon="friends-o" info="5">标签</van-tabbar-item>
		</van-tabbar> -->
		home
		</tabBar>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				active:0
			};
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
