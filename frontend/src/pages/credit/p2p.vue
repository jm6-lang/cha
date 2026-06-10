<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚫</view>
        <text class="header-title">网贷黑名单</text>
        <text class="header-desc">200+ 平台黑名单数据</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="platforms">
      <text class="section-title">覆盖平台</text>
      <view class="platform-list">
        <view v-for="p in platforms" :key="p" class="platform-item">{{ p }}</view>
      </view>
    </view>

    <view class="stat-block">
      <text class="section-title">本月数据</text>
      <view class="stat-grid">
        <view class="stat-card">
          <text class="stat-num">1,256,830</text>
          <text class="stat-lbl">查询次数</text>
        </view>
        <view class="stat-card">
          <text class="stat-num">28.6%</text>
          <text class="stat-lbl">命中黑名单</text>
        </view>
        <view class="stat-card">
          <text class="stat-num">200+</text>
          <text class="stat-lbl">覆盖平台</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const platforms = ['蚂蚁借呗', '微粒贷', '京东金条', '美团生活费', '360借条', '度小满', '有钱花', '平安普惠', '招联金融', '马上消费', '中银消费', '兴业消费', '众安小贷', '信而富', '宜人贷', '你我贷', '玖富', '拍拍贷', '点融', '积木盒子'];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.platforms { }
.platform-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: flex; flex-wrap: wrap; gap: 16rpx; }
.platform-item { font-size: 24rpx; color: $text-secondary; background: $bg-page; padding: 12rpx 24rpx; border-radius: 10rpx; }
.stat-block { }
.stat-grid { display: flex; padding: 0 24rpx; gap: 20rpx; }
.stat-card { flex: 1; background: #fff; border-radius: 20rpx; padding: 30rpx 0; text-align: center; }
.stat-num { font-size: 32rpx; color: $danger; font-weight: 700; display: block; }
.stat-lbl { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
</style>
