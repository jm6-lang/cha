<template>
  <view class="page">
    <!-- 余额卡片 -->
    <view class="balance-card">
      <text class="balance-label">当前余额</text>
      <view class="balance-value-row">
        <text class="balance-unit">¥</text>
        <text class="balance-value">0.00</text>
      </view>
    </view>

    <!-- 充值金额选择 -->
    <view class="section">
      <text class="section-title">选择充值金额</text>
      <view class="amount-grid">
        <view
          v-for="item in amountList"
          :key="item"
          class="amount-item"
          :class="{ active: selectedAmount === item }"
          @tap="selectAmount(item)"
        >
          <text class="amount-num" :class="{ 'amount-num-active': selectedAmount === item }">¥{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 自定义金额 -->
    <view class="section">
      <text class="section-title">自定义金额</text>
      <view class="custom-input-wrap">
        <text class="custom-prefix">¥</text>
        <input
          class="custom-input"
          type="digit"
          placeholder="请输入充值金额"
          :value="customAmount"
          @input="onCustomInput"
        />
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <text class="section-title">支付方式</text>
      <view class="pay-list">
        <view
          class="pay-item"
          :class="{ active: payMethod === 'wechat' }"
          @tap="payMethod = 'wechat'"
        >
          <text class="pay-icon">💚</text>
          <text class="pay-name">微信支付</text>
          <view class="pay-check">
            <view v-if="payMethod === 'wechat'" class="check-dot" />
          </view>
        </view>
        <view
          class="pay-item"
          :class="{ active: payMethod === 'alipay' }"
          @tap="payMethod = 'alipay'"
        >
          <text class="pay-icon">💙</text>
          <text class="pay-name">支付宝</text>
          <view class="pay-check">
            <view v-if="payMethod === 'alipay'" class="check-dot" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="price-row">
        <text class="price-label">支付金额：</text>
        <text class="price-value">¥{{ displayAmount }}</text>
      </view>
      <button class="btn-recharge" @tap="onRecharge">立即充值</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const amountList = [10, 30, 50, 100, 200, 500];
const selectedAmount = ref(50);
const customAmount = ref('');
const payMethod = ref('wechat');

const displayAmount = computed(() => {
  if (customAmount.value) return parseFloat(customAmount.value) || 0;
  return selectedAmount.value;
});

function selectAmount(item: number) {
  selectedAmount.value = item;
  customAmount.value = '';
}

function onCustomInput(e: any) {
  customAmount.value = e.detail.value;
  selectedAmount.value = 0;
}

function onRecharge() {
  if (!displayAmount.value || displayAmount.value <= 0) {
    uni.showToast({ title: '请选择或输入充值金额', icon: 'none' });
    return;
  }
  uni.showToast({ title: `充值¥${displayAmount.value} - 即将上线`, icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* 余额卡片 */
.balance-card {
  background: $primary;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 40rpx 32rpx;
}

.balance-label {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.balance-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 12rpx;
}

.balance-unit {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
  margin-right: 4rpx;
}

.balance-value {
  font-size: 56rpx;
  color: #fff;
  font-weight: 700;
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

/* 金额宫格 */
.amount-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.amount-item {
  width: calc(33.33% - 14rpx);
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid $border;
  border-radius: $radius-md;
  background: $bg-card;
  transition: all 0.2s;
}

.amount-item.active {
  border-color: $primary;
  background: $primary-light;
}

.amount-num {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.amount-num-active {
  color: $primary;
}

/* 自定义金额 */
.custom-input-wrap {
  display: flex;
  align-items: center;
  border: 2rpx solid $border;
  border-radius: $radius-md;
  padding: 0 20rpx;
  height: 88rpx;
}

.custom-prefix {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-primary;
  margin-right: 8rpx;
}

.custom-input {
  flex: 1;
  font-size: 30rpx;
  color: $text-primary;
  height: 88rpx;
}

/* 支付方式 */
.pay-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.pay-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid $border;
  border-radius: $radius-md;
  transition: all 0.2s;
}

.pay-item.active {
  border-color: $primary;
  background: $primary-light;
}

.pay-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.pay-name {
  flex: 1;
  font-size: 28rpx;
  color: $text-primary;
}

.pay-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-item.active .pay-check {
  border-color: $primary;
}

.check-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: $primary;
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

.price-row {
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 26rpx;
  color: $text-secondary;
}

.price-value {
  font-size: 36rpx;
  font-weight: 700;
  color: $danger;
}

.btn-recharge {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 80rpx;
  padding: 0 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}

.btn-recharge:active {
  opacity: 0.85;
}
</style>
