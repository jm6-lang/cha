<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚗</view>
        <text class="header-title">驾照查询</text>
        <text class="header-desc">驾照信息 · 扣分 · 年审</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证+档案号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <text class="result-status">✓ 驾照有效</text>
        <text class="result-num">C1</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">姓名</text>
          <text class="grid-value">{{ keyword || '刘*明' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">准驾车型</text>
          <text class="grid-value">C1（小型汽车）</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">初次领证</text>
          <text class="grid-value">2018-06-15</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">有效期至</text>
          <text class="grid-value">2028-06-15</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">当前记分</text>
          <text class="grid-value highlight">2 分</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">下次年审</text>
          <text class="grid-value">2026-06-15</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">档案编号</text>
          <text class="grid-value">11010**********1234</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">发证机关</text>
          <text class="grid-value">北京市公安局公安交通管理局</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">🚗</text>
      <text class="ph-text">输入信息开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx; display: flex; justify-content: space-between; align-items: center; }
.result-status { font-size: 32rpx; color: #fff; font-weight: 700; }
.result-num { font-size: 50rpx; color: #fff; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $warning; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
