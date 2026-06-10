<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎓</view>
        <text class="header-title">学历查询</text>
        <text class="header-desc">学信网数据 · 真实可信</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+学历证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="tip-card">
      <text class="tip-title">📚 查询说明</text>
      <text class="tip-text">· 支持大专/本科/硕士/博士学历查询</text>
      <text class="tip-text">· 包含 2002 年以后国家承认的学历</text>
      <text class="tip-text">· 仅供合法用途，结果可作背调参考</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-status">✓ 学历信息</text>
      </view>
      <view class="result-body">
        <view class="info-row">
          <text class="info-label">姓名</text>
          <text class="info-value">{{ keyword || '王*飞' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">性别</text>
          <text class="info-value">男</text>
        </view>
        <view class="info-row">
          <text class="info-label">学历层次</text>
          <text class="info-value">本科</text>
        </view>
        <view class="info-row">
          <text class="info-label">毕业院校</text>
          <text class="info-value">北京大学</text>
        </view>
        <view class="info-row">
          <text class="info-label">所学专业</text>
          <text class="info-value">计算机科学与技术</text>
        </view>
        <view class="info-row">
          <text class="info-label">毕业时间</text>
          <text class="info-value">2020-07</text>
        </view>
        <view class="info-row">
          <text class="info-label">证书编号</text>
          <text class="info-value">10001********2345</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">🎓</text>
      <text class="ph-text">输入信息开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);

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
.header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.tip-card { margin: 30rpx 24rpx; padding: 24rpx; background: #FFF7E6; border-radius: 16rpx; }
.tip-title { font-size: 28rpx; color: $warning; font-weight: 700; display: block; margin-bottom: 12rpx; }
.tip-text { font-size: 24rpx; color: $text-secondary; display: block; line-height: 1.8; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 24rpx; }
.result-status { font-size: 30rpx; color: #fff; font-weight: 700; }
.result-body { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
