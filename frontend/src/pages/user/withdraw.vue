<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💸</view>
        <text class="header-title">提现申请</text>
        <text class="header-desc">可提现余额 ¥326.50</text>
      </view>
    </view>

    <view class="amount-card">
      <text class="amount-label">提现金额（元）</text>
      <view class="amount-input-wrap">
        <text class="amount-symbol">¥</text>
        <input
          v-model="amount"
          class="amount-input"
          type="digit"
          placeholder="请输入金额"
          placeholder-class="placeholder"
        />
      </view>
      <view class="amount-tip">
        <text class="tip-text">最低提现 ¥10，{{ withdrawFee }}% 手续费</text>
        <text class="tip-link" @tap="onAllWithdraw">全部提现</text>
      </view>
    </view>

    <view class="method-card">
      <text class="card-title">提现方式</text>
      <view
        v-for="m in methods"
        :key="m.key"
        class="method-row"
        :class="{ active: selectedMethod === m.key }"
        @tap="selectedMethod = m.key"
      >
        <view class="method-icon-wrap" :style="{ background: m.color }">
          <text class="method-icon">{{ m.icon }}</text>
        </view>
        <view class="method-info">
          <text class="method-name">{{ m.name }}</text>
          <text class="method-desc">{{ m.desc }}</text>
        </view>
        <view class="method-radio" :class="{ checked: selectedMethod === m.key }">
          <text v-if="selectedMethod === m.key" class="radio-check">✓</text>
        </view>
      </view>
    </view>

    <view class="submit-area">
      <view class="submit-btn" :class="{ disabled: !canSubmit }" @tap="onSubmit">
        <text class="submit-text">立即提现</text>
      </view>
    </view>

    <view class="rule-card">
      <text class="rule-title">提现规则</text>
      <text class="rule-text">1. 最低提现金额 ¥10，单日最高 ¥5000</text>
      <text class="rule-text">2. 提现手续费 1%（最低 0.1 元）</text>
      <text class="rule-text">3. 工作日 1-3 个工作日到账</text>
      <text class="rule-text">4. 周末和节假日顺延</text>
      <text class="rule-text">5. 提现到账后将以短信/微信通知</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const amount = ref('');
const selectedMethod = ref('wechat');
const withdrawFee = 1;

const methods = ref([
  { key: 'wechat', name: '微信零钱', desc: '实时到账，推荐', icon: '💚', color: '#E8F8EF' },
  { key: 'alipay', name: '支付宝', desc: '1-3 个工作日到账', icon: '💙', color: '#E3F2FD' },
  { key: 'bank', name: '银行卡', desc: '1-3 个工作日到账', icon: '💳', color: '#F3E5F5' },
]);

const canSubmit = computed(() => {
  const a = parseFloat(amount.value);
  return !isNaN(a) && a >= 10 && a <= 326.5;
});

function onAllWithdraw() {
  amount.value = '326.50';
}

function onSubmit() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' });
    return;
  }
  const a = parseFloat(amount.value);
  const fee = Math.max(0.1, a * 0.01).toFixed(2);
  uni.showModal({
    title: '确认提现',
    content: `提现金额：¥${a}\n手续费：¥${fee}\n实际到账：¥${(a - parseFloat(fee)).toFixed(2)}`,
    confirmText: '确认提现',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '提现申请已提交', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    },
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #FF9800 0%, #E65100 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 32rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 金额 */
.amount-card {
  background: $bg-card;
  margin: -16rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.amount-label {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  margin-bottom: 16rpx;
}

.amount-input-wrap {
  display: flex;
  align-items: baseline;
  border-bottom: 1rpx solid $border;
  padding-bottom: 16rpx;
}

.amount-symbol {
  font-size: 48rpx;
  font-weight: 700;
  color: $text-primary;
  margin-right: 12rpx;
}

.amount-input {
  flex: 1;
  height: 80rpx;
  font-size: 56rpx;
  font-weight: 700;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.placeholder {
  color: $text-placeholder;
  font-weight: 400;
  font-family: sans-serif;
}

.amount-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12rpx;
}

.tip-text {
  font-size: 22rpx;
  color: $text-tertiary;
}

.tip-link {
  font-size: 24rpx;
  color: $warning;
  font-weight: 500;
}

/* 方式 */
.method-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.method-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.method-row:last-child {
  border-bottom: none;
}

.method-row.active {
  background: rgba(255, 152, 0, 0.05);
  margin: 0 -16rpx;
  padding: 20rpx 16rpx;
  border-radius: $radius-md;
  border-bottom: none;
}

.method-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.method-icon {
  font-size: 36rpx;
}

.method-info {
  flex: 1;
}

.method-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.method-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}

.method-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-radio.checked {
  background: $warning;
  border-color: $warning;
}

.radio-check {
  font-size: 24rpx;
  color: #fff;
  font-weight: 700;
}

/* 提交 */
.submit-area {
  margin: 32rpx 24rpx;
}

.submit-btn {
  background: $warning;
  border-radius: 999rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.3);
}

.submit-btn.disabled {
  background: $text-placeholder;
  box-shadow: none;
}

.submit-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 规则 */
.rule-card {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.rule-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.rule-text {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.8;
}
</style>
