<template>
  <view class="page">
    <!-- 代理等级卡片 -->
    <view class="level-card">
      <view class="level-header">
        <text class="level-icon">🤝</text>
        <view class="level-info">
          <text class="level-title">代理等级</text>
          <text class="level-name">普通用户</text>
        </view>
      </view>
      <text class="level-desc">成为代理，享受更多佣金权益</text>
    </view>

    <!-- 佣金统计 -->
    <view class="section">
      <text class="section-title">佣金统计</text>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">¥0.00</text>
          <text class="stat-label">今日佣金</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">¥0.00</text>
          <text class="stat-label">本月佣金</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">¥0.00</text>
          <text class="stat-label">累计佣金</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="section">
      <text class="section-title">功能入口</text>
      <view class="func-grid">
        <view v-for="(f, i) in funcList" :key="i" class="func-item" @tap="onFunc(f)">
          <view class="func-icon-wrap" :style="{ background: f.bgColor }">
            <text class="func-icon">{{ f.icon }}</text>
          </view>
          <text class="func-name">{{ f.name }}</text>
        </view>
      </view>
    </view>

    <!-- 成为代理按钮 -->
    <view class="bottom-section">
      <button class="btn-agent" @tap="onBecomeAgent">成为代理</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const funcList = [
  { name: '推广链接', icon: '🔗', bgColor: '#E3F2FD', action: 'link' },
  { name: '下级管理', icon: '👥', bgColor: '#E8F5E9', action: 'team' },
  { name: '佣金提现', icon: '💰', bgColor: '#FFF3E0', action: 'withdraw' },
  { name: '代理政策', icon: '📋', bgColor: '#F3E5F5', action: 'policy' },
];

function onFunc(f: any) {
  uni.showToast({ title: `${f.name} - 即将上线`, icon: 'none' });
}

function onBecomeAgent() {
  uni.showToast({ title: '成为代理 - 即将上线', icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

/* 代理等级卡片 */
.level-card {
  background: $primary;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 40rpx 32rpx;
}

.level-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.level-icon {
  font-size: 56rpx;
  margin-right: 20rpx;
}

.level-info {
  display: flex;
  flex-direction: column;
}

.level-title {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.level-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-top: 4rpx;
}

.level-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 通用section */
.section {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20rpx;
}

/* 佣金统计 */
.stats-row {
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.stat-label {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 8rpx;
}

.stat-divider {
  width: 1rpx;
  height: 64rpx;
  background: $border;
}

/* 功能入口 */
.func-grid {
  display: flex;
  gap: 16rpx;
}

.func-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.func-icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.func-icon {
  font-size: 40rpx;
}

.func-name {
  font-size: 24rpx;
  color: $text-secondary;
}

/* 成为代理按钮 */
.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: $bg-card;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.btn-agent {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
}

.btn-agent:active {
  opacity: 0.85;
}
</style>
