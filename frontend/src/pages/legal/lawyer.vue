<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👨‍⚖️</view>
        <text class="header-title">律师查询</text>
        <text class="header-desc">全国律师执业信息核验</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入律师姓名/律所/执业证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="categories">
      <text class="section-title">按专长分类</text>
      <view class="cat-list">
        <view v-for="c in cats" :key="c.name" class="cat-item">
          <text class="cat-emoji">{{ c.emoji }}</text>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="lawyer-list">
      <text class="section-title">推荐律师</text>
      <view v-for="(l, i) in lawyers" :key="i" class="lawyer-card">
        <view class="lawyer-avatar">{{ l.name[0] }}</view>
        <view class="lawyer-info">
          <view class="lawyer-name-row">
            <text class="lawyer-name">{{ l.name }}</text>
            <text class="lawyer-cert">{{ l.cert }}</text>
          </view>
          <text class="lawyer-firm">{{ l.firm }}</text>
          <view class="lawyer-tags">
            <text v-for="t in l.tags" :key="t" class="lawyer-tag">{{ t }}</text>
          </view>
          <view class="lawyer-stat">
            <text class="stat-num">{{ l.cases }}件</text>
            <text class="stat-label">经手案件</text>
            <text class="stat-divider">·</text>
            <text class="stat-num">{{ l.years }}年</text>
            <text class="stat-label">执业</text>
          </view>
        </view>
        <view class="lawyer-cta">咨询</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const cats = [
  { emoji: '⚖️', name: '刑事辩护' },
  { emoji: '🏠', name: '婚姻家事' },
  { emoji: '💼', name: '合同纠纷' },
  { emoji: '🏢', name: '公司法务' },
  { emoji: '💰', name: '债权债务' },
  { emoji: '🛡️', name: '知识产权' },
  { emoji: '🚗', name: '交通事故' },
  { emoji: '👨‍👩‍👧', name: '继承遗产' }
];
const lawyers = [
  { name: '张明华', cert: '执业证已验证', firm: '北京市盈科律师事务所', tags: ['刑事辩护', '经济犯罪'], cases: '320+', years: '15' },
  { name: '李雪松', cert: '执业证已验证', firm: '上海锦天城律师事务所', tags: ['公司法', '并购重组'], cases: '280+', years: '12' },
  { name: '王建国', cert: '执业证已验证', firm: '广东国晖律师事务所', tags: ['交通事故', '人身损害'], cases: '450+', years: '18' }
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
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.categories { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 10rpx 0; }
.cat-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx; padding: 10rpx 24rpx; }
.cat-item { display: flex; flex-direction: column; align-items: center; padding: 16rpx 0; }
.cat-emoji { font-size: 44rpx; }
.cat-name { font-size: 22rpx; color: $text-secondary; margin-top: 6rpx; }
.lawyer-list { }
.lawyer-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 24rpx; display: flex; align-items: center; }
.lawyer-avatar { width: 100rpx; height: 100rpx; border-radius: 50%; background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 44rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.lawyer-info { flex: 1; margin-left: 20rpx; }
.lawyer-name-row { display: flex; align-items: center; gap: 10rpx; }
.lawyer-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.lawyer-cert { font-size: 20rpx; color: $primary; background: rgba(7,193,96,0.1); padding: 2rpx 10rpx; border-radius: 6rpx; }
.lawyer-firm { font-size: 24rpx; color: $text-secondary; display: block; margin: 6rpx 0; }
.lawyer-tags { display: flex; gap: 10rpx; margin-bottom: 10rpx; }
.lawyer-tag { font-size: 20rpx; color: $info; background: rgba(26,108,255,0.08); padding: 2rpx 12rpx; border-radius: 6rpx; }
.lawyer-stat { font-size: 22rpx; color: $text-tertiary; }
.stat-num { color: $warning; font-weight: 700; font-size: 24rpx; }
.stat-divider { margin: 0 12rpx; }
.lawyer-cta { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 24rpx; padding: 12rpx 24rpx; border-radius: 30rpx; }
</style>
