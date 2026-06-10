<template>
  <view class="page">
    <!-- VIP卡片 -->
    <view class="vip-card">
      <view class="vip-header">
        <text class="vip-crown">👑</text>
        <view class="vip-info">
          <text class="vip-title">数查会员</text>
          <text class="vip-status">当前：非会员</text>
        </view>
      </view>
      <text class="vip-desc">开通会员，尊享更多权益</text>
    </view>

    <!-- 会员权益 -->
    <view class="section">
      <text class="section-title">会员权益</text>
      <view class="benefit-list">
        <view v-for="(b, i) in benefits" :key="i" class="benefit-item">
          <view class="benefit-icon-wrap">
            <text class="benefit-icon">{{ b.icon }}</text>
          </view>
          <view class="benefit-info">
            <text class="benefit-name">{{ b.name }}</text>
            <text class="benefit-desc">{{ b.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 套餐选择 -->
    <view class="section">
      <text class="section-title">选择套餐</text>
      <view class="plan-list">
        <view
          v-for="(p, i) in plans"
          :key="i"
          class="plan-item"
          :class="{ active: selectedPlan === i }"
          @tap="selectedPlan = i"
        >
          <text v-if="p.tag" class="plan-tag">{{ p.tag }}</text>
          <text class="plan-name">{{ p.name }}</text>
          <view class="plan-price-row">
            <text class="plan-price">¥{{ p.price }}</text>
            <text class="plan-period">/{{ p.period }}</text>
          </view>
          <text class="plan-avg">约¥{{ p.avg }}/月</text>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="bottom-info">
        <text class="bottom-label">支付金额：</text>
        <text class="bottom-price">¥{{ plans[selectedPlan].price }}</text>
      </view>
      <button class="btn-open" @tap="onOpenVip">立即开通</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedPlan = ref(1);

const benefits = [
  { icon: '🏷️', name: '查询折扣', desc: '会员享8折查询优惠' },
  { icon: '🎧', name: '专属客服', desc: '一对一VIP客服通道' },
  { icon: '⚡', name: '优先处理', desc: '查询请求优先处理' },
  { icon: '🔄', name: '更多次数', desc: '每月额外赠送查询次数' },
];

const plans = [
  { name: '月卡', price: '29.9', period: '月', avg: '29.9', tag: '' },
  { name: '季卡', price: '79.9', period: '季', avg: '26.6', tag: '推荐' },
  { name: '年卡', price: '199.9', period: '年', avg: '16.7', tag: '最划算' },
];

function onOpenVip() {
  uni.showToast({ title: '开通会员 - 即将上线', icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* VIP卡片 */
.vip-card {
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 50%, #FF8F00 100%);
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 160, 0, 0.3);
}

.vip-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.vip-crown {
  font-size: 56rpx;
  margin-right: 20rpx;
}

.vip-info {
  display: flex;
  flex-direction: column;
}

.vip-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #5D3A00;
}

.vip-status {
  font-size: 24rpx;
  color: #795548;
  margin-top: 4rpx;
}

.vip-desc {
  font-size: 24rpx;
  color: #795548;
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

/* 权益列表 */
.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
}

.benefit-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: $radius-md;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.benefit-icon {
  font-size: 36rpx;
}

.benefit-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.benefit-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
}

.benefit-desc {
  font-size: 24rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

/* 套餐选择 */
.plan-list {
  display: flex;
  gap: 16rpx;
}

.plan-item {
  flex: 1;
  background: $bg-card;
  border: 2rpx solid $border;
  border-radius: $radius-lg;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.2s;
}

.plan-item.active {
  border-color: $primary;
  background: $primary-light;
}

.plan-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: $primary;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 0 $radius-lg 0 $radius-md;
}

.plan-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.plan-price-row {
  display: flex;
  align-items: baseline;
}

.plan-price {
  font-size: 40rpx;
  font-weight: 700;
  color: $danger;
}

.plan-period {
  font-size: 22rpx;
  color: $text-tertiary;
}

.plan-avg {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 8rpx;
}

/* 底部按钮 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $bg-card;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-info {
  display: flex;
  align-items: baseline;
}

.bottom-label {
  font-size: 26rpx;
  color: $text-secondary;
}

.bottom-price {
  font-size: 36rpx;
  font-weight: 700;
  color: $danger;
}

.btn-open {
  background: linear-gradient(135deg, #FFD700, #FFA000);
  color: #5D3A00;
  border-radius: 999rpx;
  height: 80rpx;
  padding: 0 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
}

.btn-open:active {
  opacity: 0.85;
}
</style>
