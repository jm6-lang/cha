<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">{{ icon }}</view>
        <text class="header-title">{{ title }}</text>
        <text class="header-desc">{{ subtitle }}</text>
      </view>
    </view>

    <view class="result-card">
      <view class="amount">
        <text class="amount-num">¥{{ amount }}</text>
        <text class="amount-label">订单金额</text>
      </view>
      <view class="info-row">
        <text class="info-label">订单号</text>
        <text class="info-value">{{ outTradeNo }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">商品</text>
        <text class="info-value">{{ subject }}</text>
      </view>
      <view class="info-row" v-if="paidAt">
        <text class="info-label">支付时间</text>
        <text class="info-value">{{ paidAt }}</text>
      </view>
      <view class="info-row" v-if="tradeNo">
        <text class="info-label">微信订单号</text>
        <text class="info-value">{{ tradeNo }}</text>
      </view>
    </view>

    <view class="action-row">
      <view class="btn-secondary" @tap="onBack">返回</view>
      <view class="btn-primary" v-if="status === 'PENDING'" @tap="onCheckAgain">🔄 重新查询</view>
      <view class="btn-primary" v-if="status === 'FAIL'" @tap="onRetry">重新支付</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { queryOrder } from '@/api/pay';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);

// 页面参数
const outTradeNo = ref<string>('');
const subject = ref<string>('');
const amount = ref<string>('0.00');
const status = ref<'PENDING' | 'SUCCESS' | 'FAIL'>('PENDING');
const paidAt = ref<string>('');
const tradeNo = ref<string>('');

const icon = computed(() => status.value === 'SUCCESS' ? '✅' : status.value === 'FAIL' ? '❌' : '⏳');
const title = computed(() => status.value === 'SUCCESS' ? '支付成功' : status.value === 'FAIL' ? '支付失败' : '等待支付');
const subtitle = computed(() => status.value === 'PENDING' ? '正在查询订单状态...' : status.value === 'SUCCESS' ? '感谢您的支持' : '请重新尝试');

let pollTimer: any = null;

onMounted(() => {
  const pages = getCurrentPages();
  const page: any = pages[pages.length - 1];
  const opt = page?.options || {};
  outTradeNo.value = opt.outTradeNo || '';
  subject.value = decodeURIComponent(opt.subject || '');
  amount.value = opt.amount || '0.00';

  if (outTradeNo.value) {
    // 启动轮询（每 3 秒查一次，最多 10 次）
    let times = 0;
    pollTimer = setInterval(async () => {
      times++;
      if (times > 10) {
        clearInterval(pollTimer);
        pollTimer = null;
        return;
      }
      const r = await queryOrder(outTradeNo.value);
      if (!r) return;
      if (r.trade_state === 'SUCCESS' || r.status === 'SUCCESS') {
        status.value = 'SUCCESS';
        paidAt.value = new Date(r.success_time || r.paidAt || Date.now()).toLocaleString('zh-CN');
        tradeNo.value = r.transaction_id || r.tradeNo || '';
        clearInterval(pollTimer);
        pollTimer = null;
      } else if (r.trade_state === 'CLOSED' || r.trade_state === 'REVOKED' || r.status === 'FAIL') {
        status.value = 'FAIL';
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }, 3000);
  }
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

const onCheckAgain = async () => {
  if (!outTradeNo.value) return;
  const r = await queryOrder(outTradeNo.value);
  if (r && (r.trade_state === 'SUCCESS' || r.status === 'SUCCESS')) {
    status.value = 'SUCCESS';
    paidAt.value = new Date(r.success_time || r.paidAt || Date.now()).toLocaleString('zh-CN');
    tradeNo.value = r.transaction_id || '';
  } else if (r && (r.trade_state === 'CLOSED' || r.status === 'FAIL')) {
    status.value = 'FAIL';
  } else {
    uni.showToast({ title: '订单未支付', icon: 'none' });
  }
};

const onRetry = () => {
  uni.navigateBack({ delta: 1 });
};

const onBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #07C160, #00B85A); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 100rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.result-card { background: #fff; margin: -40rpx 24rpx 0; border-radius: 20rpx; padding: 40rpx 30rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05); }
.amount { text-align: center; padding: 30rpx 0 40rpx; border-bottom: 1rpx solid $border-color; margin-bottom: 20rpx; }
.amount-num { font-size: 60rpx; color: $danger; font-weight: 700; display: block; }
.amount-label { font-size: 24rpx; color: $text-tertiary; display: block; margin-top: 8rpx; }
.info-row { display: flex; padding: 18rpx 0; }
.info-label { width: 180rpx; font-size: 26rpx; color: $text-tertiary; flex-shrink: 0; }
.info-value { font-size: 26rpx; color: $text-primary; flex: 1; word-break: break-all; }
.action-row { display: flex; gap: 20rpx; padding: 30rpx 24rpx; }
.btn-secondary, .btn-primary { flex: 1; text-align: center; padding: 24rpx 0; border-radius: 40rpx; font-size: 28rpx; font-weight: 600; }
.btn-secondary { background: #fff; color: $text-secondary; border: 2rpx solid $border-color; }
.btn-primary { background: linear-gradient(135deg, #07C160, #00B85A); color: #fff; }
</style>
