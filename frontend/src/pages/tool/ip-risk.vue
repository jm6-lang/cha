<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📍</view>
        <text class="header-title">IP 风险</text>
        <text class="header-desc">IP 地址风险画像</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入 IP 地址" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <text class="result-status" :class="{ safe: result.score > 70, warn: result.score <= 70 && result.score > 40, danger: result.score <= 40 }">
          {{ result.score > 70 ? '安全' : result.score > 40 ? '一般' : '高风险' }}
        </text>
        <text class="result-score">{{ result.score }}分</text>
      </view>
      <view class="result-info">
        <view class="info-row">
          <text class="info-label">IP 地址</text>
          <text class="info-value">{{ keyword || '123.45.67.89' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">国家</text>
          <text class="info-value">中国</text>
        </view>
        <view class="info-row">
          <text class="info-label">省份</text>
          <text class="info-value">北京市</text>
        </view>
        <view class="info-row">
          <text class="info-label">城市</text>
          <text class="info-value">北京</text>
        </view>
        <view class="info-row">
          <text class="info-label">运营商</text>
          <text class="info-value">中国电信</text>
        </view>
        <view class="info-row">
          <text class="info-label">代理类型</text>
          <text class="info-value">无</text>
        </view>
        <view class="info-row">
          <text class="info-label">是否机房</text>
          <text class="info-value">否</text>
        </view>
        <view class="info-row">
          <text class="info-label">风险标签</text>
          <text class="info-value">{{ result.tags }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="info-block">
      <view class="info-card">
        <text class="info-emoji">🛡️</text>
        <text class="info-title">风险评估</text>
        <text class="info-desc">检测代理/VPN/肉鸡/扫描器等风险</text>
      </view>
      <view class="info-card">
        <text class="info-emoji">🌐</text>
        <text class="info-title">精准定位</text>
        <text class="info-desc">精确到国家/省份/城市/运营商</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const result = ref({ score: 85, tags: '正常用户' });

const onSearch = () => {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(keyword.value)) {
    uni.showToast({ title: '请输入正确 IP', icon: 'none' });
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
.result-top { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx; display: flex; justify-content: space-between; align-items: center; }
.result-top.warn { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.result-top.danger { background: linear-gradient(135deg, #FF5252, #FF7676); }
.result-status { font-size: 32rpx; color: #fff; font-weight: 700; }
.result-score { font-size: 40rpx; color: #fff; font-weight: 700; }
.result-info { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-block { padding: 30rpx 24rpx; }
.info-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; display: flex; align-items: center; }
.info-emoji { font-size: 50rpx; margin-right: 20rpx; }
.info-title { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.info-desc { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
</style>
