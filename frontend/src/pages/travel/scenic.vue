<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🗺️</view>
        <text class="header-title">景点门票</text>
        <text class="header-desc">5A · 4A · 全国景区</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入景区/城市" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="level-bar">
      <view v-for="l in levels" :key="l" class="level" :class="{ active: activeLevel === l }" @tap="activeLevel = l">
        <text class="level-text">{{ l }}</text>
      </view>
    </view>

    <view class="spot-list">
      <view v-for="(s, i) in spots" :key="i" class="spot-card">
        <view class="spot-cover">{{ s.cover }}</view>
        <view class="spot-info">
          <view class="spot-name-row">
            <text class="spot-name">{{ s.name }}</text>
            <text class="spot-level">{{ s.level }}</text>
          </view>
          <text class="spot-addr">📍 {{ s.addr }}</text>
          <view class="spot-stats">
            <text class="stat">⭐ {{ s.score }}</text>
            <text class="stat">{{ s.sales }}人已购</text>
          </view>
          <view class="spot-bottom">
            <text class="price">¥{{ s.price }}<text class="price-old">¥{{ s.priceOld }}</text></text>
            <text class="buy-btn">购票</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const activeLevel = ref('全部');
const levels = ['全部', '5A', '4A', '3A', '热门'];
const spots = [
  { name: '故宫博物院', level: '5A', cover: '🏯', addr: '北京市东城区景山前街4号', score: '4.9', sales: '12,856', price: '60', priceOld: '80' },
  { name: '长城（八达岭）', level: '5A', cover: '🏔️', addr: '北京市延庆区G6京藏高速58号出口', score: '4.8', sales: '8,625', price: '40', priceOld: '45' },
  { name: '西湖', level: '5A', cover: '🌊', addr: '浙江省杭州市西湖区龙井路1号', score: '4.9', sales: '15,232', price: '免费', priceOld: '免费' },
  { name: '外滩', level: '4A', cover: '🌃', addr: '上海市黄浦区中山东一路', score: '4.7', sales: '6,524', price: '免费', priceOld: '免费' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入景区', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
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
.level-bar { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; }
.level { padding: 12rpx 30rpx; background: #fff; border-radius: 30rpx; }
.level.active { background: linear-gradient(135deg, #00BCD4, #4DD0E1); }
.level-text { font-size: 24rpx; color: $text-secondary; }
.level.active .level-text { color: #fff; }
.spot-list { padding: 24rpx; }
.spot-card { background: #fff; border-radius: 20rpx; padding: 20rpx; margin-bottom: 20rpx; display: flex; }
.spot-cover { width: 200rpx; height: 200rpx; background: linear-gradient(135deg, #00BCD4, #4DD0E1); border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 100rpx; flex-shrink: 0; }
.spot-info { flex: 1; margin-left: 20rpx; display: flex; flex-direction: column; }
.spot-name-row { display: flex; justify-content: space-between; align-items: center; }
.spot-name { font-size: 28rpx; color: $text-primary; font-weight: 700; }
.spot-level { font-size: 20rpx; color: #fff; background: linear-gradient(135deg, #FF5252, #FF7676); padding: 4rpx 12rpx; border-radius: 6rpx; }
.spot-addr { font-size: 22rpx; color: $text-tertiary; display: block; margin: 6rpx 0; }
.spot-stats { display: flex; gap: 16rpx; }
.stat { font-size: 22rpx; color: $text-secondary; }
.spot-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.price { font-size: 32rpx; color: $danger; font-weight: 700; }
.price-old { font-size: 22rpx; color: $text-tertiary; text-decoration: line-through; margin-left: 8rpx; }
.buy-btn { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; font-size: 24rpx; padding: 10rpx 24rpx; border-radius: 30rpx; }
</style>
