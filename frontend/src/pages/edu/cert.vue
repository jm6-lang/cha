<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🪪</view>
        <text class="header-title">职业资格</text>
        <text class="header-desc">职业证书 · 技能认证</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+证书编号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="categories">
      <text class="section-title">证书分类</text>
      <view class="cat-grid">
        <view v-for="c in cats" :key="c.name" class="cat-item">
          <text class="cat-emoji">{{ c.emoji }}</text>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-status">证书有效</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">姓名</text>
          <text class="grid-value">{{ keyword || '张*' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">证书名称</text>
          <text class="grid-value">中级会计师</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">证书编号</text>
          <text class="grid-value">2020********1234</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">发证机构</text>
          <text class="grid-value">财政部</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">发证时间</text>
          <text class="grid-value">2020-06-15</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">有效期</text>
          <text class="grid-value">长期有效</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">🪪</text>
      <text class="ph-text">输入信息开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const cats = [
  { emoji: '💼', name: '经济师' },
  { emoji: '📊', name: '会计师' },
  { emoji: '⚖️', name: '律师' },
  { emoji: '🏗️', name: '工程师' },
  { emoji: '👨‍⚕️', name: '医师' },
  { emoji: '👨‍🏫', name: '教师' },
  { emoji: '👮', name: '警务' },
  { emoji: '🧪', name: '检测员' }
];

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
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
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
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.cat-grid { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.cat-item { text-align: center; padding: 16rpx 0; }
.cat-emoji { font-size: 50rpx; display: block; }
.cat-name { font-size: 22rpx; color: $text-secondary; margin-top: 6rpx; display: block; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 24rpx; }
.result-status { font-size: 30rpx; color: #fff; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
