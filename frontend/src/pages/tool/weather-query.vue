<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">☀️</view>
        <text class="header-title">天气查询</text>
        <text class="header-desc">实时天气、温度、湿度、风速</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">📍</text>
        <input
          v-model="city"
          class="form-input"
          placeholder="请输入城市名，如 北京"
          placeholder-class="input-placeholder"
          @confirm="onQuery"
        />
        <view v-if="city" class="input-clear" @tap="city = ''">
          <text class="clear-icon">✕</text>
        </view>
      </view>
      <view class="quick-city">
        <text class="quick-tip">热门：</text>
        <text class="quick-item" @tap="city = '北京'">北京</text>
        <text class="quick-item" @tap="city = '上海'">上海</text>
        <text class="quick-item" @tap="city = '广州'">广州</text>
        <text class="quick-item" @tap="city = '深圳'">深圳</text>
        <text class="quick-item" @tap="city = '杭州'">杭州</text>
      </view>
      <view class="query-btn" :class="{ loading: querying }" @tap="onQuery">
        <text class="query-btn-text">{{ querying ? '查询中...' : '查询天气' }}</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="city-name">
        <text class="city-text">📍 {{ result.city }}</text>
      </view>
      <view class="weather-main">
        <view class="weather-desc-block">
          <text class="weather-desc">{{ result.desc }}</text>
        </view>
        <view class="weather-temp-block">
          <text class="weather-temp">{{ result.temp }}</text>
          <text class="weather-feels">体感 {{ result.feelsLike }}</text>
        </view>
      </view>
      <view class="weather-detail">
        <view class="detail-item">
          <text class="detail-icon">💧</text>
          <text class="detail-label">湿度</text>
          <text class="detail-value">{{ result.humidity }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-icon">💨</text>
          <text class="detail-label">风速</text>
          <text class="detail-value">{{ result.wind }}</text>
        </view>
      </view>
    </view>

    <view class="disclaimer">
      <text class="disclaimer-text">天气数据来源于 wttr.in，仅供参考</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryWeather } from '@/api/free-apis';

const city = ref('');
const querying = ref(false);
const result = ref<any>(null);
const statusBarHeight = ref(44);

const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

async function onQuery() {
  const v = city.value.trim();
  if (!v) {
    uni.showToast({ title: '请输入城市名', icon: 'none' });
    return;
  }
  querying.value = true;
  try {
    const r = await queryWeather(v);
    if (r) {
      result.value = r;
    } else {
      uni.showToast({ title: '查询失败，请检查城市名', icon: 'none' });
    }
  } finally {
    querying.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 头部 */
.header {
  background: linear-gradient(180deg, #4FC3F7 0%, #1976D2 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 56rpx;
}

.header-icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 表单 */
.form-card {
  margin: -32rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.input-prefix {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
}

.input-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 24rpx;
  color: #fff;
}

.input-placeholder {
  color: $text-tertiary;
}

.quick-city {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}

.quick-tip {
  font-size: 24rpx;
  color: $text-tertiary;
}

.quick-item {
  font-size: 24rpx;
  color: $info;
  background: rgba(26, 108, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}

.query-btn {
  margin-top: 32rpx;
  height: 96rpx;
  background: linear-gradient(90deg, #4FC3F7, #1976D2);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(25, 118, 210, 0.3);
}

.query-btn:active {
  opacity: 0.85;
}

.query-btn.loading {
  opacity: 0.7;
}

.query-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 结果 */
.result-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.city-name {
  margin-bottom: 16rpx;
}

.city-text {
  font-size: 28rpx;
  color: $text-secondary;
  font-weight: 500;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $border-light;
  margin-bottom: 24rpx;
}

.weather-desc {
  font-size: 36rpx;
  color: $text-primary;
  font-weight: 600;
}

.weather-temp {
  display: block;
  font-size: 72rpx;
  font-weight: 700;
  color: $info;
  line-height: 1;
}

.weather-feels {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
  text-align: right;
}

.weather-detail {
  display: flex;
  gap: 16rpx;
}

.detail-item {
  flex: 1;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 16rpx;
  text-align: center;
}

.detail-icon {
  display: block;
  font-size: 36rpx;
  margin-bottom: 4rpx;
}

.detail-label {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 4rpx;
}

.detail-value {
  display: block;
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 600;
}

/* 免责声明 */
.disclaimer {
  text-align: center;
  padding: 24rpx;
}

.disclaimer-text {
  font-size: 22rpx;
  color: $text-tertiary;
}
</style>
