<template>
  <view class="page">
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

    <!-- 未使用 -->
    <view v-if="currentTab === 0" class="coupon-list">
      <view v-for="(c, i) in unusedCoupons" :key="i" class="coupon-card">
        <view class="coupon-left">
          <text class="coupon-symbol">¥</text>
          <text class="coupon-amount">{{ c.amount }}</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ c.name }}</text>
          <text class="coupon-condition">{{ c.condition }}</text>
          <text class="coupon-expire">{{ c.expire }}</text>
        </view>
        <view class="coupon-badge">
          <text class="badge-text">使用</text>
        </view>
      </view>
    </view>

    <!-- 已使用 -->
    <view v-else-if="currentTab === 1" class="empty-state">
      <text class="empty-icon">🎫</text>
      <text class="empty-text">暂无已使用的优惠券</text>
    </view>

    <!-- 已过期 -->
    <view v-else class="empty-state">
      <text class="empty-icon">🎫</text>
      <text class="empty-text">暂无已过期的优惠券</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = ['未使用', '已使用', '已过期'];
const currentTab = ref(0);

const unusedCoupons = [
  {
    name: '新用户专享',
    amount: '5.0',
    condition: '满10元可用',
    expire: '2024-12-31到期',
  },
  {
    name: '查询折扣券',
    amount: '8折',
    condition: '无门槛',
    expire: '2024-12-31到期',
  },
];
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* Tab */
.tab-bar {
  display: flex;
  background: $bg-card;
  padding: 0 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
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

/* 优惠券列表 */
.coupon-list {
  padding: 24rpx;
}

.coupon-card {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: $radius-lg;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.coupon-left {
  width: 180rpx;
  background: $primary;
  display: flex;
  align-items: baseline;
  justify-content: center;
  padding: 32rpx 0;
  position: relative;
}

.coupon-left::after {
  content: '';
  position: absolute;
  right: -6rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $bg-page;
}

.coupon-symbol {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
  margin-right: 2rpx;
}

.coupon-amount {
  font-size: 44rpx;
  color: #fff;
  font-weight: 700;
}

.coupon-right {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
}

.coupon-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
}

.coupon-condition {
  font-size: 22rpx;
  color: $text-secondary;
  margin-top: 6rpx;
}

.coupon-expire {
  font-size: 20rpx;
  color: $text-tertiary;
  margin-top: 6rpx;
}

.coupon-badge {
  padding: 0 24rpx;
}

.badge-text {
  font-size: 24rpx;
  color: $primary;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
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
