<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💬</view>
        <text class="header-title">微信查询</text>
        <text class="header-desc">微信账号 · 风险画像</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入微信号/手机号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-icon">🔒</text>
      <text class="notice-text">本服务基于公开数据，结果仅供参考</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <text class="result-status">账号正常</text>
        <text class="result-score">信用 92</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">微信昵称</text>
          <text class="grid-value">{{ keyword || 'wx_zhang***' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">注册时间</text>
          <text class="grid-value">2018-03-15</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">活跃地区</text>
          <text class="grid-value">北京市</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">好友数量</text>
          <text class="grid-value">386</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">群聊数量</text>
          <text class="grid-value">42</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">朋友圈活跃度</text>
          <text class="grid-value">中</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">支付分</text>
          <text class="info-value highlight">823</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">💬</text>
      <text class="ph-text">输入微信号开始查询</text>
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
.header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #07C160, #4DD599); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.notice { margin: 30rpx 24rpx; padding: 20rpx 24rpx; background: #E0F7E9; border-radius: 16rpx; display: flex; align-items: center; }
.notice-icon { font-size: 28rpx; margin-right: 12rpx; }
.notice-text { font-size: 24rpx; color: $primary; flex: 1; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx; display: flex; justify-content: space-between; align-items: center; }
.result-status { font-size: 32rpx; color: #fff; font-weight: 700; }
.result-score { font-size: 40rpx; color: #fff; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-value.highlight { color: $warning; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
