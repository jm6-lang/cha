<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌍</view>
        <text class="header-title">区号查询</text>
        <text class="header-desc">世界区号 · 时差 · 国家</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入国家/区号/城市" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="regions">
      <view v-for="r in regions" :key="r.name" class="region-section">
        <text class="region-name">{{ r.name }}</text>
        <view class="area-list">
          <view v-for="a in r.list" :key="a.code" class="area-item">
            <text class="area-flag">{{ a.flag }}</text>
            <view class="area-info">
              <text class="area-country">{{ a.country }}</text>
              <text class="area-time">{{ a.time }}</text>
            </view>
            <text class="area-code">+{{ a.code }}</text>
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

const regions = [
  {
    name: '亚洲',
    list: [
      { flag: '🇨🇳', country: '中国', code: '86', time: 'UTC+8' },
      { flag: '🇯🇵', country: '日本', code: '81', time: 'UTC+9' },
      { flag: '🇰🇷', country: '韩国', code: '82', time: 'UTC+9' },
      { flag: '🇸🇬', country: '新加坡', code: '65', time: 'UTC+8' }
    ]
  },
  {
    name: '欧洲',
    list: [
      { flag: '🇬🇧', country: '英国', code: '44', time: 'UTC+0' },
      { flag: '🇫🇷', country: '法国', code: '33', time: 'UTC+1' },
      { flag: '🇩🇪', country: '德国', code: '49', time: 'UTC+1' },
      { flag: '🇮🇹', country: '意大利', code: '39', time: 'UTC+1' }
    ]
  },
  {
    name: '美洲',
    list: [
      { flag: '🇺🇸', country: '美国', code: '1', time: 'UTC-5/-10' },
      { flag: '🇨🇦', country: '加拿大', code: '1', time: 'UTC-3.5/-8' },
      { flag: '🇧🇷', country: '巴西', code: '55', time: 'UTC-3' }
    ]
  }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入查询信息', icon: 'none' });
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
.regions { padding: 30rpx 24rpx 0; }
.region-section { margin-bottom: 30rpx; }
.region-name { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; margin-bottom: 16rpx; }
.area-list { background: #fff; border-radius: 20rpx; padding: 10rpx 24rpx; }
.area-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.area-item:last-child { border-bottom: none; }
.area-flag { font-size: 40rpx; margin-right: 20rpx; }
.area-info { flex: 1; }
.area-country { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.area-time { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.area-code { font-size: 28rpx; color: $info; font-weight: 700; }
</style>
