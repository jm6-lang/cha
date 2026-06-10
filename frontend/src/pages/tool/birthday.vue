<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎂</view>
        <text class="header-title">生日查询</text>
        <text class="header-desc">生日 · 星座 · 生肖 · 年龄</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" type="number" class="search-input" placeholder="输入身份证号" placeholder-class="placeholder" maxlength="18" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <text class="result-emoji">🎂</text>
        <text class="result-date">{{ result.birthday }}</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">年龄</text>
          <text class="grid-value highlight">{{ result.age }} 岁</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">星座</text>
          <text class="grid-value">{{ result.zodiac }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">生肖</text>
          <text class="grid-value">{{ result.shengxiao }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">出生日</text>
          <text class="grid-value">{{ result.week }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">距下次生日</text>
          <text class="grid-value">{{ result.nextBirth }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">人生进度</text>
          <view class="progress-wrap">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: result.progress + '%' }" />
            </view>
            <text class="progress-num">{{ result.progress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">🎂</text>
      <text class="ph-text">输入身份证号开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const result = ref({ birthday: '1990-05-15', age: 36, zodiac: '金牛座', shengxiao: '马', week: '星期二', nextBirth: '185 天', progress: 36 });

const onSearch = () => {
  if (keyword.value.length < 18) {
    uni.showToast({ title: '请输入 18 位身份证号', icon: 'none' });
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
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #E91E63, #F06292); padding: 50rpx 30rpx; text-align: center; }
.result-emoji { font-size: 80rpx; display: block; }
.result-date { font-size: 36rpx; color: #fff; font-weight: 700; display: block; margin-top: 16rpx; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $primary; font-weight: 700; }
.progress-wrap { display: flex; align-items: center; flex: 1; margin-left: 20rpx; }
.progress-bar { flex: 1; height: 16rpx; background: $bg-page; border-radius: 8rpx; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #E91E63, #F06292); border-radius: 8rpx; }
.progress-num { font-size: 24rpx; color: $primary; font-weight: 700; margin-left: 16rpx; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
