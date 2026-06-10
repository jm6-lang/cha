<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💍</view>
        <text class="header-title">离婚记录</text>
        <text class="header-desc">历史离婚记录查询</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="header-title">离婚记录</text>
        <text class="header-count">共 1 条</text>
      </view>
      <view class="record-card">
        <view class="record-top">
          <text class="record-no">协议编号：DC-2022-0325-***1</text>
        </view>
        <view class="record-grid">
          <view class="grid-row">
            <text class="grid-label">登记时间</text>
            <text class="grid-value">2022-03-25</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">登记机关</text>
            <text class="grid-value">北京市民政局</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">离婚方式</text>
            <text class="grid-value">协议离婚</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">对方姓名</text>
            <text class="grid-value">陈*丽</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="info-block">
      <text class="info-title">📋 查询说明</text>
      <text class="info-text">· 查询全国民政系统离婚登记记录</text>
      <text class="info-text">· 包含协议离婚与诉讼离婚</text>
      <text class="info-text">· 结果仅本人可见</text>
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
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; display: flex; justify-content: space-between; align-items: center; border-bottom: 1rpx solid $border-color; }
.header-title { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.header-count { font-size: 24rpx; color: $text-tertiary; }
.record-card { padding: 24rpx; }
.record-top { margin-bottom: 16rpx; }
.record-no { font-size: 22rpx; color: $text-tertiary; }
.record-grid { }
.grid-row { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-block { margin: 30rpx 24rpx; padding: 30rpx; background: #FFF7E6; border-radius: 20rpx; }
.info-title { font-size: 28rpx; color: $warning; font-weight: 700; display: block; margin-bottom: 16rpx; }
.info-text { font-size: 24rpx; color: $text-secondary; display: block; line-height: 1.8; }
</style>
