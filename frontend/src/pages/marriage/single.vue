<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💍</view>
        <text class="header-title">婚姻状况</text>
        <text class="header-desc">婚姻登记 · 配偶信息</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-icon">⚠️</text>
      <text class="notice-text">本服务需本人授权，仅供合法用途</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="header-title">查询结果</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">查询对象</text>
          <text class="grid-value">{{ keyword || '刘*伟' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">婚姻状态</text>
          <text class="grid-value highlight">未婚</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">配偶姓名</text>
          <text class="grid-value">-</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">登记时间</text>
          <text class="grid-value">-</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">数据来源</text>
          <text class="grid-value">民政部</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">查询时间</text>
          <text class="grid-value">{{ queryTime }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">💍</text>
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
.notice { margin: 30rpx 24rpx; padding: 20rpx 24rpx; background: #FFF7E6; border-radius: 16rpx; display: flex; align-items: center; }
.notice-icon { font-size: 28rpx; margin-right: 12rpx; }
.notice-text { font-size: 24rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; border-bottom: 1rpx solid $border-color; }
.header-title { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $primary; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
