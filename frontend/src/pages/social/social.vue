<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏥</view>
        <text class="header-title">社保查询</text>
        <text class="header-desc">五险一金 · 缴费明细</text>
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
      <view class="user-info">
        <view class="user-avatar">张</view>
        <view class="user-text">
          <text class="user-name">{{ keyword || '张*伟' }}</text>
          <text class="user-id">11010**********1234</text>
        </view>
        <text class="user-status">正常参保</text>
      </view>

      <view class="insurance-list">
        <view v-for="(i, idx) in items" :key="idx" class="insurance-item">
          <view class="ins-left">
            <text class="ins-emoji">{{ i.emoji }}</text>
            <view class="ins-info">
              <text class="ins-name">{{ i.name }}</text>
              <text class="ins-base">缴费基数 ¥{{ i.base }}</text>
            </view>
          </view>
          <view class="ins-right">
            <text class="ins-amt">¥{{ i.amount }}/月</text>
            <text class="ins-month">已缴 {{ i.months }}月</text>
          </view>
        </view>
      </view>

      <view class="total-card">
        <text class="total-label">月缴合计</text>
        <text class="total-amt">¥1,832.00</text>
        <view class="total-detail">
          <text class="d-item">个人：¥683.50</text>
          <text class="d-item">单位：¥1,148.50</text>
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
const items = [
  { emoji: '👴', name: '养老保险', base: '12000', amount: '960', months: 60 },
  { emoji: '🏥', name: '医疗保险', base: '12000', amount: '300', months: 60 },
  { emoji: '💼', name: '失业保险', base: '12000', amount: '24', months: 60 },
  { emoji: '🛡️', name: '工伤保险', base: '12000', amount: '0', months: 60 },
  { emoji: '🤱', name: '生育保险', base: '12000', amount: '48', months: 60 },
  { emoji: '🏠', name: '住房公积金', base: '12000', amount: '500', months: 60 }
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
.header { background: linear-gradient(135deg, #00BCD4, #4DD0E1); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; }
.user-info { background: #fff; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.user-avatar { width: 100rpx; height: 100rpx; border-radius: 50%; background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 44rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.user-text { flex: 1; margin-left: 20rpx; }
.user-name { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.user-id { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
.user-status { font-size: 22rpx; color: #fff; background: $primary; padding: 6rpx 16rpx; border-radius: 20rpx; }
.insurance-list { background: #fff; border-radius: 20rpx; margin-top: 20rpx; padding: 10rpx 30rpx; }
.insurance-item { display: flex; justify-content: space-between; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.insurance-item:last-child { border-bottom: none; }
.ins-left { display: flex; align-items: center; }
.ins-emoji { font-size: 44rpx; margin-right: 20rpx; }
.ins-info { }
.ins-name { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.ins-base { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.ins-right { text-align: right; }
.ins-amt { font-size: 28rpx; color: $warning; font-weight: 700; display: block; }
.ins-month { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.total-card { background: linear-gradient(135deg, #00BCD4, #4DD0E1); border-radius: 20rpx; padding: 30rpx; margin-top: 20rpx; text-align: center; color: #fff; }
.total-label { font-size: 24rpx; display: block; }
.total-amt { font-size: 56rpx; font-weight: 700; display: block; margin: 12rpx 0; }
.total-detail { display: flex; justify-content: center; gap: 30rpx; }
.d-item { font-size: 24rpx; opacity: 0.9; }
</style>
