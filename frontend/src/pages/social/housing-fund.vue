<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏛️</view>
        <text class="header-title">住房公积金</text>
        <text class="header-desc">缴存 · 提取 · 贷款</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入身份证+姓名" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="balance-card">
        <text class="balance-label">账户余额</text>
        <text class="balance-num">¥86,425.50</text>
        <view class="balance-detail">
          <view class="d-item">
            <text class="d-lbl">月缴存</text>
            <text class="d-val">¥1,000</text>
          </view>
          <view class="d-item">
            <text class="d-lbl">缴至</text>
            <text class="d-val">2026-06</text>
          </view>
          <view class="d-item">
            <text class="d-lbl">开户日期</text>
            <text class="d-val">2018-03</text>
          </view>
        </view>
      </view>

      <view class="func-grid">
        <view class="func-cell">
          <text class="func-emoji">🏠</text>
          <text class="func-name">购房提取</text>
        </view>
        <view class="func-cell">
          <text class="func-emoji">💰</text>
          <text class="func-name">租房提取</text>
        </view>
        <view class="func-cell">
          <text class="func-emoji">🏦</text>
          <text class="func-name">贷款计算</text>
        </view>
        <view class="func-cell">
          <text class="func-emoji">📋</text>
          <text class="func-name">缴存明细</text>
        </view>
      </view>

      <view class="list-section">
        <text class="section-title">最近缴存</text>
        <view v-for="(r, i) in records" :key="i" class="record-item">
          <view class="record-left">
            <text class="record-month">{{ r.month }}</text>
            <text class="record-type">{{ r.type }}</text>
          </view>
          <text class="record-amount">+¥{{ r.amount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const records = [
  { month: '2026-06', type: '正常汇缴', amount: '1,000.00' },
  { month: '2026-05', type: '正常汇缴', amount: '1,000.00' },
  { month: '2026-04', type: '正常汇缴', amount: '1,000.00' },
  { month: '2026-03', type: '正常汇缴', amount: '1,000.00' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #E91E63, #F06292); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; }
.balance-card { background: linear-gradient(135deg, #E91E63, #F06292); border-radius: 20rpx; padding: 40rpx 30rpx; color: #fff; text-align: center; }
.balance-label { font-size: 24rpx; opacity: 0.9; display: block; }
.balance-num { font-size: 70rpx; font-weight: 700; display: block; margin: 16rpx 0 30rpx; }
.balance-detail { display: flex; padding-top: 30rpx; border-top: 1rpx solid rgba(255,255,255,0.3); }
.d-item { flex: 1; text-align: center; }
.d-lbl { font-size: 22rpx; opacity: 0.85; display: block; }
.d-val { font-size: 26rpx; font-weight: 600; display: block; margin-top: 6rpx; }
.func-grid { background: #fff; border-radius: 20rpx; padding: 20rpx; margin-top: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.func-cell { text-align: center; padding: 16rpx 0; }
.func-emoji { font-size: 50rpx; display: block; }
.func-name { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 0 16rpx; }
.list-section { background: #fff; border-radius: 20rpx; padding: 10rpx 30rpx; }
.record-item { display: flex; justify-content: space-between; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.record-item:last-child { border-bottom: none; }
.record-left { }
.record-month { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.record-type { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.record-amount { font-size: 30rpx; color: $primary; font-weight: 700; }
</style>
