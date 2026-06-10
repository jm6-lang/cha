<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🅾️</view>
        <text class="header-title">QQ 查询</text>
        <text class="header-desc">QQ 账号 · 等级 · 注册信息</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入 QQ 号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-top">
        <view class="avatar">{{ keyword.slice(-2) || 'QQ' }}</view>
        <view class="top-info">
          <text class="info-nick">用户{{ keyword || '123456' }}</text>
          <text class="info-level">VIP{{ level }} · {{ level * 16 }}级</text>
        </view>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">QQ 号</text>
          <text class="grid-value">{{ keyword || '123456789' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">注册时间</text>
          <text class="grid-value">2010-05-12</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">最后登录</text>
          <text class="grid-value">2026-06-08 14:23</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">常用地区</text>
          <text class="grid-value">广东 深圳</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">QQ 等级</text>
          <text class="grid-value highlight">{{ level * 16 }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">会员状态</text>
          <text class="grid-value">SVIP</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">账号风险</text>
          <text class="grid-value success">低风险</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">🅾️</text>
      <text class="ph-text">输入 QQ 号开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const level = computed(() => keyword.value.length > 0 ? Math.min(8, keyword.value.length) : 0);

const onSearch = () => {
  if (!/^\d{5,12}$/.test(keyword.value)) {
    uni.showToast({ title: '请输入正确 QQ 号', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
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
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 30rpx; display: flex; align-items: center; }
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; background: #fff; color: #1976D2; font-size: 44rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 24rpx; }
.top-info { }
.info-nick { font-size: 34rpx; color: #fff; font-weight: 700; display: block; }
.info-level { font-size: 24rpx; color: rgba(255,255,255,0.9); display: block; margin-top: 8rpx; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $warning; font-weight: 700; }
.grid-value.success { color: $primary; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
