<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌤️</view>
        <text class="header-title">天气预报</text>
        <text class="header-desc">实时天气 · 15 天预报</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入城市名" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="weather-card">
      <view class="weather-now">
        <text class="weather-city">📍 {{ result.city }}</text>
        <text class="weather-temp">{{ result.temp }}°</text>
        <text class="weather-desc">{{ result.desc }}</text>
        <view class="weather-detail">
          <view class="detail-cell">
            <text class="cell-lbl">湿度</text>
            <text class="cell-val">{{ result.humidity }}%</text>
          </view>
          <view class="detail-cell">
            <text class="cell-lbl">风速</text>
            <text class="cell-val">{{ result.wind }}</text>
          </view>
          <view class="detail-cell">
            <text class="cell-lbl">空气质量</text>
            <text class="cell-val">{{ result.aqi }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="searched" class="forecast">
      <text class="section-title">未来 7 天</text>
      <view class="forecast-list">
        <view v-for="(f, i) in forecast" :key="i" class="forecast-item">
          <text class="forecast-day">{{ f.day }}</text>
          <text class="forecast-emoji">{{ f.emoji }}</text>
          <view class="forecast-temp">
            <text class="temp-high">{{ f.high }}°</text>
            <text class="temp-low">{{ f.low }}°</text>
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
const searched = ref(false);
const result = ref({ city: '北京', temp: 25, desc: '晴', humidity: 45, wind: '东南风 3 级', aqi: '良 65' });
const forecast = [
  { day: '今天', emoji: '☀️', high: 25, low: 18 },
  { day: '明天', emoji: '⛅', high: 27, low: 19 },
  { day: '周三', emoji: '🌧️', high: 24, low: 17 },
  { day: '周四', emoji: '⛅', high: 26, low: 18 },
  { day: '周五', emoji: '☀️', high: 28, low: 20 },
  { day: '周六', emoji: '☀️', high: 30, low: 21 },
  { day: '周日', emoji: '🌧️', high: 25, low: 19 }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入城市', icon: 'none' });
    return;
  }
  searched.value = true;
  result.value.city = keyword.value;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #1976D2, #42A5F5); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.weather-card { margin: 30rpx 24rpx 0; border-radius: 20rpx; overflow: hidden; }
.weather-now { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 50rpx 30rpx; color: #fff; }
.weather-city { font-size: 28rpx; opacity: 0.9; display: block; }
.weather-temp { font-size: 120rpx; font-weight: 700; display: block; line-height: 1; }
.weather-desc { font-size: 30rpx; opacity: 0.9; display: block; margin: 10rpx 0 30rpx; }
.weather-detail { display: flex; padding-top: 30rpx; border-top: 1rpx solid rgba(255,255,255,0.3); }
.detail-cell { flex: 1; text-align: center; }
.cell-lbl { font-size: 22rpx; opacity: 0.85; display: block; }
.cell-val { font-size: 26rpx; font-weight: 600; display: block; margin-top: 6rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.forecast-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx 24rpx; }
.forecast-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid $border-color; }
.forecast-item:last-child { border-bottom: none; }
.forecast-day { width: 120rpx; font-size: 28rpx; color: $text-primary; }
.forecast-emoji { font-size: 40rpx; flex: 1; text-align: center; }
.forecast-temp { text-align: right; }
.temp-high { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.temp-low { font-size: 24rpx; color: $text-tertiary; margin-left: 12rpx; }
</style>
