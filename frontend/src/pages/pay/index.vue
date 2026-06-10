<template>
  <view class="page">
    <!-- 订单信息卡片 -->
    <view class="order-card">
      <view class="order-header">
        <text class="order-label">订单信息</text>
      </view>
      <view class="order-body">
        <view class="order-row">
          <text class="order-name">{{ serviceName }}</text>
        </view>
        <view class="order-price-row">
          <text class="order-price-label">支付金额</text>
          <text class="order-price">¥{{ servicePrice }}</text>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="pay-method-card">
      <text class="section-title">支付方式</text>
      <view class="method-list">
        <view
          class="method-item"
          :class="{ active: payMethod === 'wechat' }"
          @tap="payMethod = 'wechat'"
        >
          <view class="method-left">
            <view class="method-icon wechat-bg">
              <text class="method-icon-text">&#128172;</text>
            </view>
            <text class="method-name">微信支付</text>
          </view>
          <view class="method-radio" :class="{ checked: payMethod === 'wechat' }">
            <view v-if="payMethod === 'wechat'" class="radio-inner" />
          </view>
        </view>
        <view class="method-divider" />
        <view
          class="method-item"
          :class="{ active: payMethod === 'alipay' }"
          @tap="payMethod = 'alipay'"
        >
          <view class="method-left">
            <view class="method-icon alipay-bg">
              <text class="method-icon-text">&#128179;</text>
            </view>
            <text class="method-name">支付宝</text>
          </view>
          <view class="method-radio" :class="{ checked: payMethod === 'alipay' }">
            <view v-if="payMethod === 'alipay'" class="radio-inner" />
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-card" @tap="onCoupon">
      <view class="coupon-left">
        <text class="coupon-icon">🎫</text>
        <text class="coupon-label">优惠券</text>
      </view>
      <view class="coupon-right">
        <text class="coupon-status">暂无可用</text>
        <text class="coupon-arrow">›</text>
      </view>
    </view>

    <!-- 底部固定支付栏 -->
    <view class="pay-bar">
      <view class="pay-bar-left">
        <text class="pay-bar-label">合计：</text>
        <text class="pay-bar-price">¥{{ servicePrice }}</text>
      </view>
      <view class="pay-bar-btn" @tap="onPay">
        <text class="pay-bar-btn-text">立即支付</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { payFor } from '@/api/pay';

const user = useUserStore();

const serviceName = ref('');
const servicePrice = ref('');
const typeCode = ref('');
const payMethod = ref('wechat');
const openid = ref('');
const paying = ref(false);

onLoad((options: any) => {
  if (options) {
    serviceName.value = decodeURIComponent(options.subject || options.name || '');
    servicePrice.value = options.amount || options.price || '';
    typeCode.value = options.type || options.typeCode || '';
  }
  // 拉取 openid（H5 直接忽略；小程序通过 wx.login 走后端换）
  // #ifdef MP-WEIXIN
  uni.login({
    success: (res) => {
      if (res.code) {
        // 调后端换 openid（这里简化：直接用 code 代替；生产应走后端兑换 openid）
        // 后端：POST /api/wx/jscode2session?code=xxx
        uni.request({
          url: '/api/wx/jscode2session',
          method: 'POST',
          data: { code: res.code },
          success: (r) => {
            if ((r.data as any)?.code === 0) openid.value = (r.data as any).openid;
          },
        });
      }
    },
  });
  // #endif
});

function onCoupon() {
  uni.showToast({ title: '暂无可用优惠券', icon: 'none' });
}

async function onPay() {
  if (paying.value) return;
  if (!user.isLoggedIn) {
    uni.navigateTo({ url: '/pages/index/login' });
    return;
  }
  paying.value = true;
  try {
    const priceNum = parseFloat(servicePrice.value) || 0;
    if (priceNum < 0.01) {
      uni.showToast({ title: '金额错误', icon: 'none' });
      return;
    }
    // #ifdef MP-WEIXIN
    if (!openid.value) {
      uni.showToast({ title: '正在获取 openid...', icon: 'none' });
      return;
    }
    // #endif
    const r = await payFor({
      totalFen: Math.round(priceNum * 100),
      subject: serviceName.value,
      attach: typeCode.value,
      openid: openid.value,
    });
    if (!r) return;
    // 跳到结果页（带订单号，轮询查单）
    uni.redirectTo({
      url: `/pages/pay/result?outTradeNo=${r.out_trade_no}&subject=${encodeURIComponent(serviceName.value)}&amount=${servicePrice.value}`,
    });
  } finally {
    paying.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* ===== 订单信息卡片 ===== */
.order-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.order-header {
  margin-bottom: 24rpx;
}

.order-label {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
}

.order-body {
  padding: 24rpx;
  background: $bg-grey;
  border-radius: $radius-md;
}

.order-row {
  margin-bottom: 16rpx;
}

.order-name {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-primary;
}

.order-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-price-label {
  font-size: 26rpx;
  color: $text-secondary;
}

.order-price {
  font-size: 44rpx;
  font-weight: 700;
  color: $danger;
}

/* ===== 支付方式 ===== */
.pay-method-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 24rpx;
}

.method-list {
  display: flex;
  flex-direction: column;
}

.method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.method-left {
  display: flex;
  align-items: center;
}

.method-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.wechat-bg {
  background: #E8F8EF;
}

.alipay-bg {
  background: #E3F2FD;
}

.method-icon-text {
  font-size: 32rpx;
}

.method-name {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
}

.method-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.method-radio.checked {
  border-color: $primary;
}

.radio-inner {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: $primary;
}

.method-divider {
  height: 1rpx;
  background: $border;
}

/* ===== 优惠券 ===== */
.coupon-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.coupon-left {
  display: flex;
  align-items: center;
}

.coupon-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.coupon-label {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
}

.coupon-right {
  display: flex;
  align-items: center;
}

.coupon-status {
  font-size: 26rpx;
  color: $text-tertiary;
  margin-right: 8rpx;
}

.coupon-arrow {
  font-size: 28rpx;
  color: $text-tertiary;
}

/* ===== 底部固定支付栏 ===== */
.pay-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: $bg-card;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.pay-bar-left {
  display: flex;
  align-items: baseline;
}

.pay-bar-label {
  font-size: 28rpx;
  color: $text-secondary;
}

.pay-bar-price {
  font-size: 40rpx;
  font-weight: 700;
  color: $danger;
}

.pay-bar-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 0 64rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
}

.pay-bar-btn:active {
  opacity: 0.85;
}

.pay-bar-btn-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: 600;
}
</style>
