<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📜</view>
        <text class="header-title">考试查询</text>
        <text class="header-desc">考试成绩 · 证书</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+准考证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="exams">
      <text class="section-title">考试类型</text>
      <view class="exam-list">
        <view v-for="e in exams" :key="e.name" class="exam-item">
          <text class="exam-emoji">{{ e.emoji }}</text>
          <view class="exam-info">
            <text class="exam-name">{{ e.name }}</text>
            <text class="exam-time">{{ e.time }}</text>
          </view>
          <text class="exam-arrow">›</text>
        </view>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-status">✓ 通过</text>
        <text class="result-score">85 分</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">考试名称</text>
          <text class="grid-value">国家公务员考试</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">报考岗位</text>
          <text class="grid-value">某市税务局科员</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">考试时间</text>
          <text class="grid-value">2024-12-01</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">总分</text>
          <text class="grid-value highlight">85 分</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">排名</text>
          <text class="grid-value">前 5%</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">面试资格</text>
          <text class="grid-value">已获得</text>
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
const exams = [
  { emoji: '🏛️', name: '公务员考试', time: '每年 12 月' },
  { emoji: '📚', name: '高考成绩', time: '每年 6 月' },
  { emoji: '🎓', name: '研究生考试', time: '每年 12 月' },
  { emoji: '🏫', name: '中考成绩', time: '每年 6 月' },
  { emoji: '💼', name: '职业资格', time: '每月' },
  { emoji: '🗣️', name: '英语四六级', time: '每年 6/12 月' }
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
.exam-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 10rpx 24rpx; }
.exam-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.exam-item:last-child { border-bottom: none; }
.exam-emoji { font-size: 50rpx; margin-right: 20rpx; }
.exam-info { flex: 1; }
.exam-name { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.exam-time { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.exam-arrow { font-size: 32rpx; color: $text-tertiary; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx; display: flex; justify-content: space-between; align-items: center; }
.result-status { font-size: 32rpx; color: #fff; font-weight: 700; }
.result-score { font-size: 50rpx; color: #fff; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $primary; font-weight: 700; }
</style>
