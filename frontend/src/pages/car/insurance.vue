<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚙</view>
        <text class="header-title">车险查询</text>
        <text class="header-desc">交强险 · 商业险 · 出险</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入车牌号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="plate-display">
        <text class="plate-num">{{ keyword || '京A·12345' }}</text>
        <text class="plate-status">保险有效</text>
      </view>
      <view class="info-grid">
        <view class="info-row">
          <text class="info-label">车主</text>
          <text class="info-value">张*明</text>
        </view>
        <view class="info-row">
          <text class="info-label">品牌型号</text>
          <text class="info-value">大众 帕萨特 2022款</text>
        </view>
        <view class="info-row">
          <text class="info-label">交强险</text>
          <text class="info-value success">有效至 2026-12-31</text>
        </view>
        <view class="info-row">
          <text class="info-label">商业险</text>
          <text class="info-value success">有效至 2026-12-31</text>
        </view>
        <view class="info-row">
          <text class="info-label">车船税</text>
          <text class="info-value success">已缴</text>
        </view>
        <view class="info-row">
          <text class="info-label">保险公司</text>
          <text class="info-value">平安保险</text>
        </view>
        <view class="info-row">
          <text class="info-label">保单号</text>
          <text class="info-value">PA2024********1234</text>
        </view>
        <view class="info-row">
          <text class="info-label">出险次数</text>
          <text class="info-value highlight">2 次</text>
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

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入车牌号', icon: 'none' });
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
.plate-display { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 40rpx 30rpx; display: flex; justify-content: space-between; align-items: center; }
.plate-num { font-size: 50rpx; color: #fff; font-weight: 700; font-family: monospace; }
.plate-status { font-size: 24rpx; background: #fff; color: $primary; padding: 6rpx 20rpx; border-radius: 20rpx; }
.info-grid { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-value.success { color: $primary; }
.info-value.highlight { color: $warning; }
</style>
