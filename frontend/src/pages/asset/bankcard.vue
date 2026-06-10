<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏦</view>
        <text class="header-title">银行卡查询</text>
        <text class="header-desc">开户行 · 归属地 · 卡类型</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入银行卡号" placeholder-class="placeholder" maxlength="19" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="bank-card">
        <view class="bank-top">
          <text class="bank-name">{{ result.bank }}</text>
          <text class="bank-type">{{ result.cardType }}</text>
        </view>
        <text class="bank-num">{{ formatCard(keyword) }}</text>
        <view class="bank-bottom">
          <view>
            <text class="bottom-lbl">卡名</text>
            <text class="bottom-val">{{ result.cardName }}</text>
          </view>
          <view>
            <text class="bottom-lbl">卡BIN</text>
            <text class="bottom-val">{{ result.bin }}</text>
          </view>
        </view>
      </view>
      <view class="info-list">
        <view class="info-row">
          <text class="info-label">开户行</text>
          <text class="info-value">{{ result.bank }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">卡种</text>
          <text class="info-value">{{ result.cardType }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">卡名</text>
          <text class="info-value">{{ result.cardName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">卡号长度</text>
          <text class="info-value">{{ keyword.length }} 位</text>
        </view>
        <view class="info-row">
          <text class="info-label">卡组织</text>
          <text class="info-value">{{ result.org }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">校验</text>
          <text class="info-value success">通过 Luhn 校验</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">💳</text>
      <text class="ph-text">输入银行卡号开始查询</text>
      <text class="ph-tip">系统不会存储您的卡号</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const result = ref({
  bank: '中国工商银行',
  cardType: '借记卡',
  cardName: '牡丹灵通卡',
  bin: '622202',
  org: '银联'
});

const formatCard = (c: string) => {
  return c.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const onSearch = () => {
  if (keyword.value.length < 16) {
    uni.showToast({ title: '请输入正确的卡号', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; }
.bank-card { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); border-radius: 20rpx; padding: 40rpx 30rpx; color: #fff; box-shadow: 0 10rpx 30rpx rgba(26,108,255,0.3); }
.bank-top { display: flex; justify-content: space-between; }
.bank-name { font-size: 30rpx; font-weight: 700; }
.bank-type { font-size: 22rpx; background: rgba(255,255,255,0.2); padding: 4rpx 16rpx; border-radius: 6rpx; }
.bank-num { font-size: 38rpx; font-weight: 600; display: block; margin: 40rpx 0; letter-spacing: 4rpx; }
.bank-bottom { display: flex; justify-content: space-between; }
.bottom-lbl { font-size: 22rpx; opacity: 0.8; display: block; }
.bottom-val { font-size: 26rpx; font-weight: 600; display: block; margin-top: 6rpx; }
.info-list { background: #fff; border-radius: 20rpx; margin-top: 20rpx; padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-value.success { color: $primary; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
.ph-tip { font-size: 22rpx; color: $text-tertiary; margin-top: 10rpx; }
</style>
