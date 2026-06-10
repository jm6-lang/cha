<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚗</view>
        <text class="header-title">汽车估值</text>
        <text class="header-desc">输入车型查询指导价/成交价</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入车型关键词（如 凯迪拉克）" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询车型...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error && cars.length" class="content">
      <text class="result-count">共找到 {{ cars.length }} 款车型</text>
      <view class="car-list">
        <view v-for="c in cars" :key="c.id" class="car-item">
          <view class="car-top">
            <view class="brand">
              <image v-if="c.logo" :src="c.logo" class="brand-logo" mode="aspectFit" />
              <text class="brand-text">{{ c.brand }}</text>
            </view>
            <text class="car-level">{{ c.level }}</text>
          </view>
          <view class="car-name">{{ c.name }}</view>
          <view class="car-prices">
            <view v-if="c.price" class="price-block">
              <text class="pb-label">指导价</text>
              <text class="pb-value">¥{{ c.price }}万</text>
            </view>
            <view v-if="c.priceMin || c.priceMax" class="price-block highlight">
              <text class="pb-label">成交价区间</text>
              <text class="pb-value">¥{{ c.priceMin || '?' }} - {{ c.priceMax || '?' }}万</text>
            </view>
          </view>
          <view v-if="c.isNewEnergy" class="tag tag-new">新能源</view>
        </view>
      </view>
    </view>

    <view v-if="!loading && !error && searched && cars.length === 0" class="empty">
      <text class="empty-icon">🔍</text>
      <text class="empty-text">未找到相关车型</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryCar, type CarModel } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const loading = ref(false);
const error = ref('');
const cars = ref<CarModel[]>([]);
const searched = ref(false);

const onSearch = async () => {
  const kw = keyword.value.trim();
  if (!kw) {
    uni.showToast({ title: '请输入车型关键词', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  cars.value = [];
  searched.value = true;
  try {
    const r = await queryCar(kw);
    if (!r) error.value = '查询失败，请稍后重试';
    else cars.value = r.list;
  } catch (e) {
    error.value = '查询异常';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
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
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 30rpx 24rpx 0; }
.result-count { display: block; font-size: 24rpx; color: $text-tertiary; margin-bottom: 16rpx; }
.car-list { display: flex; flex-direction: column; gap: 16rpx; }
.car-item { background: #fff; border-radius: 20rpx; padding: 24rpx; position: relative; }
.car-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
.brand { display: flex; align-items: center; gap: 8rpx; }
.brand-logo { width: 36rpx; height: 36rpx; border-radius: 8rpx; background: $bg-page; }
.brand-text { font-size: 24rpx; color: $text-secondary; font-weight: 600; }
.car-level { font-size: 22rpx; color: $info; background: rgba(26,108,255,0.1); padding: 4rpx 12rpx; border-radius: 10rpx; }
.car-name { display: block; font-size: 32rpx; color: $text-primary; font-weight: 700; margin-bottom: 16rpx; }
.car-prices { display: flex; flex-direction: column; gap: 8rpx; }
.price-block { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 16rpx; background: $bg-page; border-radius: 10rpx; }
.price-block.highlight { background: linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,107,53,0.04)); }
.pb-label { font-size: 24rpx; color: $text-secondary; }
.pb-value { font-size: 28rpx; color: $text-primary; font-weight: 700; }
.price-block.highlight .pb-value { color: #FF6B35; }
.tag { position: absolute; top: 24rpx; right: 24rpx; padding: 4rpx 12rpx; border-radius: 10rpx; font-size: 20rpx; font-weight: 600; }
.tag-new { background: rgba(7,193,96,0.12); color: $primary; }
.empty { text-align: center; padding: 100rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 80rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
