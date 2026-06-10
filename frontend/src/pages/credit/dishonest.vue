<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⚖️</view>
        <text class="header-title">失信被执行人</text>
        <text class="header-desc">最高法官方数据 · 实时同步</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名/身份证/企业名" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">立即查询</text>
      </view>
    </view>

    <view class="tip-card">
      <text class="tip-title">📌 查询说明</text>
      <text class="tip-desc">被列入失信名单将限制高消费、贷款、招投标等，请谨慎对待</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-status">
        <text class="status-icon">✓</text>
        <text class="status-text">未发现失信记录</text>
      </view>
      <view class="result-detail">
        <view class="detail-row">
          <text class="detail-label">查询对象</text>
          <text class="detail-value">{{ keyword || '张*三' }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">数据来源</text>
          <text class="detail-value">最高人民法院</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">查询时间</text>
          <text class="detail-value">{{ queryTime }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">匹配记录</text>
          <text class="detail-value">0 条</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="placeholder-icon">🛡️</text>
      <text class="placeholder-text">输入信息开始查询</text>
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
    uni.showToast({ title: '请输入查询信息', icon: 'none' });
    return;
  }
  searched.value = true;
  queryTime.value = new Date().toLocaleString('zh-CN');
  uni.showLoading({ title: '查询中...' });
  setTimeout(() => {
    uni.hideLoading();
  }, 800);
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #FF5252, #FF7676); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.tip-card { margin: 30rpx 24rpx; padding: 20rpx 24rpx; background: #FFF7E6; border-radius: 16rpx; }
.tip-title { font-size: 26rpx; color: $text-primary; font-weight: 600; display: block; }
.tip-desc { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 6rpx; line-height: 1.5; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-status { background: linear-gradient(135deg, #07C160, #4DD599); padding: 40rpx; display: flex; flex-direction: column; align-items: center; }
.status-icon { width: 80rpx; height: 80rpx; line-height: 80rpx; text-align: center; background: #fff; color: #07C160; border-radius: 50%; font-size: 50rpx; font-weight: 700; }
.status-text { font-size: 32rpx; color: #fff; font-weight: 700; margin-top: 16rpx; }
.result-detail { padding: 10rpx 30rpx; }
.detail-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.detail-row:last-child { border-bottom: none; }
.detail-label { font-size: 26rpx; color: $text-secondary; }
.detail-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.placeholder-icon { font-size: 100rpx; opacity: 0.4; }
.placeholder-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
