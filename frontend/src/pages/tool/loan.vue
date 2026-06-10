<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💰</view>
        <text class="header-title">贷款计算</text>
        <text class="header-desc">房贷/车贷/信用贷一站搞定</text>
      </view>
    </view>

    <view class="tab-bar">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-row">
        <text class="form-label">贷款金额</text>
        <view class="form-input-wrap">
          <input v-model="amount" type="number" class="form-input" placeholder="0" />
          <text class="form-unit">万元</text>
        </view>
      </view>
      <view class="form-row">
        <text class="form-label">贷款年限</text>
        <view class="form-input-wrap">
          <input v-model="years" type="number" class="form-input" placeholder="0" />
          <text class="form-unit">年</text>
        </view>
      </view>
      <view class="form-row">
        <text class="form-label">年利率</text>
        <view class="form-input-wrap">
          <input v-model="rate" type="number" class="form-input" placeholder="0" />
          <text class="form-unit">%</text>
        </view>
      </view>
      <view class="form-row">
        <text class="form-label">还款方式</text>
        <view class="type-list">
          <view v-for="m in methods" :key="m.key" class="type" :class="{ active: method === m.key }" @tap="method = m.key">
            <text class="type-text">{{ m.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="calc-btn" @tap="onCalc">立即计算</view>

    <view v-if="result.show" class="result-card">
      <view class="result-row">
        <text class="result-label">月供</text>
        <text class="result-value">¥{{ result.monthly }}</text>
      </view>
      <view class="result-row">
        <text class="result-label">总利息</text>
        <text class="result-value">¥{{ result.interest }}</text>
      </view>
      <view class="result-row">
        <text class="result-label">还款总额</text>
        <text class="result-value">¥{{ result.total }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeTab = ref('house');
const tabs = [
  { key: 'house', name: '房贷' },
  { key: 'car', name: '车贷' },
  { key: 'credit', name: '信用贷' }
];
const amount = ref('100');
const years = ref('30');
const rate = ref('4.2');
const method = ref('equal');
const methods = [
  { key: 'equal', name: '等额本息' },
  { key: 'principal', name: '等额本金' }
];
const result = ref({ show: false, monthly: '0', interest: '0', total: '0' });

const onCalc = () => {
  const amt = parseFloat(amount.value) * 10000;
  const yr = parseInt(years.value);
  const r = parseFloat(rate.value) / 100 / 12;
  const n = yr * 12;
  let m = 0;
  if (method.value === 'equal') {
    m = (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else {
    m = amt / n + (amt * r);
  }
  const total = m * n;
  const interest = total - amt;
  result.value = {
    show: true,
    monthly: m.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    interest: interest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    total: total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  };
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.header { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.tab-bar { display: flex; gap: 20rpx; padding: 30rpx 24rpx 0; }
.tab { flex: 1; padding: 20rpx 0; text-align: center; background: #fff; border-radius: 16rpx; }
.tab.active { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.tab-text { font-size: 28rpx; color: $text-secondary; }
.tab.active .tab-text { color: #fff; }
.form-card { background: #fff; margin: 24rpx; border-radius: 20rpx; padding: 10rpx 30rpx; }
.form-row { display: flex; justify-content: space-between; align-items: center; padding: 30rpx 0; border-bottom: 1rpx solid $border-color; }
.form-row:last-child { border-bottom: none; flex-direction: column; align-items: flex-start; }
.form-label { font-size: 28rpx; color: $text-primary; font-weight: 500; }
.form-input-wrap { display: flex; align-items: baseline; }
.form-input { font-size: 32rpx; color: $text-primary; text-align: right; min-width: 200rpx; }
.form-unit { font-size: 24rpx; color: $text-tertiary; margin-left: 8rpx; }
.type-list { display: flex; gap: 16rpx; margin-top: 16rpx; width: 100%; }
.type { flex: 1; padding: 16rpx 0; text-align: center; background: $bg-page; border-radius: 12rpx; }
.type.active { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.type-text { font-size: 26rpx; color: $text-secondary; }
.type.active .type-text { color: #fff; }
.calc-btn { margin: 30rpx 24rpx; background: linear-gradient(135deg, #FF9800, #FFB74D); color: #fff; font-size: 30rpx; font-weight: 700; text-align: center; padding: 26rpx; border-radius: 50rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 10rpx 30rpx; }
.result-row { display: flex; justify-content: space-between; padding: 26rpx 0; border-bottom: 1rpx solid $border-color; }
.result-row:last-child { border-bottom: none; }
.result-label { font-size: 28rpx; color: $text-secondary; }
.result-value { font-size: 32rpx; color: $warning; font-weight: 700; }
</style>
