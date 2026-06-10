<template>
  <view class="page">
    <!-- 余额卡片 -->
    <view class="balance-card">
      <view class="balance-top">
        <view class="balance-left">
          <text class="balance-label">账户余额</text>
          <view class="balance-row">
            <text class="balance-unit">¥</text>
            <text class="balance-value">0.00</text>
          </view>
        </view>
        <button class="btn-recharge" @tap="goRecharge">充值</button>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-bar">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-item"
        :class="{ active: currentTab === i }"
        @tap="currentTab = i"
      >
        <text class="tab-text" :class="{ 'tab-text-active': currentTab === i }">{{ tab }}</text>
        <view v-if="currentTab === i" class="tab-line" />
      </view>
    </view>

    <!-- 交易记录 -->
    <view class="record-list" v-if="currentTab === 0">
      <view class="empty-state">
        <text class="empty-icon">💰</text>
        <text class="empty-text">暂无交易记录</text>
      </view>
    </view>

    <view class="record-list" v-else-if="currentTab === 1">
      <view class="empty-state">
        <text class="empty-icon">📥</text>
        <text class="empty-text">暂无收入记录</text>
      </view>
    </view>

    <view class="record-list" v-else>
      <view class="empty-state">
        <text class="empty-icon">📤</text>
        <text class="empty-text">暂无支出记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = ['全部', '收入', '支出'];
const currentTab = ref(0);

function goRecharge() {
  uni.navigateTo({ url: '/pages/user/recharge' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 余额卡片 */
.balance-card {
  background: $primary;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 36rpx 32rpx;
}

.balance-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-left {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.balance-row {
  display: flex;
  align-items: baseline;
  margin-top: 8rpx;
}

.balance-unit {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
  margin-right: 4rpx;
}

.balance-value {
  font-size: 52rpx;
  color: #fff;
  font-weight: 700;
}

.btn-recharge {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 999rpx;
  height: 64rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
}

.btn-recharge:active {
  opacity: 0.85;
}

/* Tab */
.tab-bar {
  display: flex;
  background: $bg-card;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 0 16rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: $text-secondary;
}

.tab-text-active {
  color: $primary;
  font-weight: 600;
}

.tab-line {
  width: 40rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: $primary;
  margin-top: 8rpx;
}

/* 交易记录 */
.record-list {
  margin: 0 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $text-tertiary;
}
</style>
