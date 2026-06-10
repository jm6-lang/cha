<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📊</view>
        <text class="header-title">信用报告</text>
        <text class="header-desc">央行征信 · 简版报告</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证+手机号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">申请报告</text>
      </view>
    </view>

    <view class="price-card">
      <text class="price-label">报告价格</text>
      <text class="price-num">¥5.9</text>
      <text class="price-desc">含 6 大模块 · 央行数据</text>
    </view>

    <view class="content-list">
      <text class="section-title">报告内容</text>
      <view v-for="c in contents" :key="c.name" class="content-item">
        <text class="content-icon">{{ c.icon }}</text>
        <view class="content-info">
          <text class="content-name">{{ c.name }}</text>
          <text class="content-desc">{{ c.desc }}</text>
        </view>
        <text class="content-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const contents = [
  { icon: '👤', name: '个人信息', desc: '身份信息、婚姻、居住地址' },
  { icon: '💳', name: '信贷记录', desc: '贷款、信用卡、担保记录' },
  { icon: '📋', name: '公共记录', desc: '欠税、民事判决、强制执行' },
  { icon: '🔍', name: '查询记录', desc: '近 2 年信用报告查询明细' },
  { icon: '⚠️', name: '负面信息', desc: '逾期、违约、呆账等记录' },
  { icon: '📈', name: '信用评分', desc: '基于 1000+ 维度综合评分' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  uni.showToast({ title: '申请中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
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
.price-card { margin: 30rpx 24rpx; background: linear-gradient(135deg, #1A6CFF, #4A8FFF); border-radius: 20rpx; padding: 30rpx; text-align: center; }
.price-label { font-size: 24rpx; color: rgba(255,255,255,0.85); display: block; }
.price-num { font-size: 70rpx; color: #fff; font-weight: 700; display: block; margin: 10rpx 0; }
.price-desc { font-size: 22rpx; color: rgba(255,255,255,0.85); }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 0 24rpx 20rpx; }
.content-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 10rpx 24rpx; }
.content-item { display: flex; align-items: center; padding: 26rpx 0; border-bottom: 1rpx solid $border-color; }
.content-item:last-child { border-bottom: none; }
.content-icon { font-size: 44rpx; margin-right: 20rpx; }
.content-info { flex: 1; }
.content-name { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.content-desc { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.content-arrow { font-size: 32rpx; color: $text-tertiary; }
</style>
