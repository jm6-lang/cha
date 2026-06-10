<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📞</view>
        <text class="header-title">固话查询</text>
        <text class="header-desc">固定电话归属地</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入座机号(区号+号码)" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="phone-display">
        <text class="phone-area">{{ result.areaCode }}</text>
        <text class="phone-num">{{ result.num }}</text>
      </view>
      <view class="info-list">
        <view class="info-row">
          <text class="info-label">归属地</text>
          <text class="info-value">{{ result.city }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">运营商</text>
          <text class="info-value">{{ result.carrier }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">区号</text>
          <text class="info-value">{{ result.areaCode }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">邮编</text>
          <text class="info-value">{{ result.zip }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="info-block">
      <text class="section-title">热门区号</text>
      <view class="area-grid">
        <view v-for="a in areas" :key="a.code" class="area-card">
          <text class="area-code">{{ a.code }}</text>
          <text class="area-city">{{ a.city }}</text>
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
const result = ref({ areaCode: '010', num: '8888****', city: '北京市', carrier: '中国电信', zip: '100000' });
const areas = [
  { code: '010', city: '北京' },
  { code: '021', city: '上海' },
  { code: '020', city: '广州' },
  { code: '0755', city: '深圳' },
  { code: '0571', city: '杭州' },
  { code: '025', city: '南京' },
  { code: '027', city: '武汉' },
  { code: '028', city: '成都' }
];

const onSearch = () => {
  if (!keyword.value || keyword.value.length < 7) {
    uni.showToast({ title: '请输入正确座机号', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #07C160, #4DD599); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.phone-display { background: linear-gradient(135deg, #07C160, #4DD599); padding: 50rpx 30rpx; text-align: center; }
.phone-area { font-size: 32rpx; color: #fff; font-weight: 600; display: block; }
.phone-num { font-size: 50rpx; color: #fff; font-weight: 700; display: block; margin-top: 12rpx; letter-spacing: 4rpx; }
.info-list { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.area-grid { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.area-card { text-align: center; padding: 20rpx 0; background: $bg-page; border-radius: 12rpx; }
.area-code { font-size: 32rpx; color: $primary; font-weight: 700; display: block; }
.area-city { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
</style>
