<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📦</view>
        <text class="header-title">快递查询</text>
        <text class="header-desc">100+ 快递公司 · 实时跟踪</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入快递单号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="companies">
      <text class="section-title">支持的快递</text>
      <view class="company-list">
        <view v-for="c in companies" :key="c" class="company-item">{{ c }}</view>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <text class="company-name">📦 顺丰快递</text>
        <text class="result-status">运输中</text>
      </view>
      <view class="track-list">
        <view v-for="(t, i) in tracks" :key="i" class="track-item" :class="{ current: i === 0 }">
          <view class="track-dot" />
          <view class="track-info">
            <text class="track-text">{{ t.text }}</text>
            <text class="track-time">{{ t.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const companies = ['顺丰', '圆通', '中通', '申通', '韵达', '邮政', '京东', '德邦', '极兔', '百世', '天天', '苏宁'];
const tracks = [
  { text: '快件已到达 【北京海淀分拣中心】', time: '2026-06-10 14:23' },
  { text: '快件离开 【北京朝阳转运中心】', time: '2026-06-10 08:15' },
  { text: '快件已揽收', time: '2026-06-09 16:42' },
  { text: '已下单', time: '2026-06-09 14:30' }
];

const onSearch = () => {
  if (keyword.value.length < 8) {
    uni.showToast({ title: '请输入正确单号', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF9800, #FFB74D); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.company-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: flex; flex-wrap: wrap; gap: 16rpx; }
.company-item { font-size: 24rpx; color: $text-secondary; background: $bg-page; padding: 12rpx 24rpx; border-radius: 10rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx; display: flex; justify-content: space-between; }
.company-name { font-size: 30rpx; color: #fff; font-weight: 700; }
.result-status { font-size: 24rpx; background: #fff; color: $warning; padding: 6rpx 20rpx; border-radius: 20rpx; }
.track-list { padding: 30rpx 30rpx 30rpx 60rpx; position: relative; }
.track-list::before { content: ''; position: absolute; left: 30rpx; top: 30rpx; bottom: 30rpx; width: 2rpx; background: $border-color; }
.track-item { position: relative; padding: 0 0 30rpx; }
.track-item:last-child { padding-bottom: 0; }
.track-item.current .track-dot { background: $primary; box-shadow: 0 0 0 6rpx rgba(7,193,96,0.2); }
.track-dot { position: absolute; left: -36rpx; top: 10rpx; width: 16rpx; height: 16rpx; border-radius: 50%; background: $text-tertiary; }
.track-text { font-size: 26rpx; color: $text-primary; display: block; }
.track-time { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
</style>
