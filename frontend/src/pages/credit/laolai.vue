<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">😈</view>
        <text class="header-title">老赖查询</text>
        <text class="header-desc">失信老赖 · 限高人员</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名/身份证" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="stats">
      <view class="stat-card">
        <text class="stat-num">86.5w</text>
        <text class="stat-lbl">失信被执行人</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">12.3w</text>
        <text class="stat-lbl">限高消费</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-status">未发现老赖记录</view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">查询对象</text>
          <text class="grid-value">{{ keyword || '张*明' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">失信记录</text>
          <text class="grid-value success">0 条</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">限高记录</text>
          <text class="grid-value success">0 条</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">查询来源</text>
          <text class="grid-value">最高人民法院</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">查询时间</text>
          <text class="grid-value">{{ queryTime }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">⚖️</text>
      <text class="ph-text">输入信息开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const queryTime = ref('');

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  searched.value = true;
  queryTime.value = new Date().toLocaleString('zh-CN');
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #E91E63, #F06292); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.stats { display: flex; padding: 30rpx 24rpx 0; gap: 20rpx; }
.stat-card { flex: 1; background: #fff; border-radius: 20rpx; padding: 30rpx 0; text-align: center; }
.stat-num { font-size: 36rpx; color: $danger; font-weight: 700; display: block; }
.stat-lbl { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-status { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx; text-align: center; color: #fff; font-size: 32rpx; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.success { color: $primary; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
