<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🍜</view>
        <text class="header-title">食品安全</text>
        <text class="header-desc">食品抽检 · 企业资质</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入食品名称/企业" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="categories">
      <text class="section-title">食品分类</text>
      <view class="cat-list">
        <view v-for="c in cats" :key="c.name" class="cat-item">
          <text class="cat-emoji">{{ c.emoji }}</text>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="food-list">
      <text class="section-title">抽检结果</text>
      <view v-for="(f, i) in foods" :key="i" class="food-card">
        <view class="food-name-row">
          <text class="food-name">{{ f.name }}</text>
          <text class="food-status" :class="{ safe: f.safe }">{{ f.safe ? '合格' : '不合格' }}</text>
        </view>
        <text class="food-maker">生产企业：{{ f.maker }}</text>
        <view class="food-meta">
          <text class="meta-item">抽检时间：{{ f.date }}</text>
          <text class="meta-item">抽检机构：{{ f.org }}</text>
        </view>
        <view v-if="!f.safe" class="problem">
          <text class="problem-title">⚠️ 不合格项</text>
          <text class="problem-text">{{ f.problem }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const cats = [
  { emoji: '🥛', name: '乳制品' },
  { emoji: '🍞', name: '粮油' },
  { emoji: '🥩', name: '肉制品' },
  { emoji: '🥬', name: '蔬菜' },
  { emoji: '🍎', name: '水果' },
  { emoji: '🧂', name: '调味品' },
  { emoji: '🍪', name: '零食' },
  { emoji: '🥤', name: '饮料' }
];
const foods = [
  { name: '伊利纯牛奶', maker: '内蒙古伊利实业集团', date: '2025-12-15', org: '国家市场监督管理总局', safe: true, problem: '' },
  { name: '某品牌辣条', maker: '某食品有限公司', date: '2025-10-22', org: '河南省市场监督管理局', safe: false, problem: '检出禁用添加剂' },
  { name: '海天生抽', maker: '海天味业', date: '2025-11-08', org: '广东省市场监督管理局', safe: true, problem: '' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入食品', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
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
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.cat-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.cat-item { text-align: center; padding: 16rpx 0; }
.cat-emoji { font-size: 50rpx; display: block; }
.cat-name { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
.food-list { }
.food-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 24rpx; }
.food-name-row { display: flex; justify-content: space-between; align-items: center; }
.food-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.food-status { font-size: 22rpx; color: #fff; background: $danger; padding: 4rpx 16rpx; border-radius: 6rpx; }
.food-status.safe { background: $primary; }
.food-maker { font-size: 24rpx; color: $text-secondary; display: block; margin: 10rpx 0; }
.food-meta { padding-top: 12rpx; border-top: 1rpx solid $border-color; }
.meta-item { font-size: 22rpx; color: $text-tertiary; display: block; line-height: 1.6; }
.problem { margin-top: 16rpx; padding: 16rpx; background: #FFEBEE; border-radius: 12rpx; }
.problem-title { font-size: 24rpx; color: $danger; font-weight: 600; display: block; }
.problem-text { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
</style>
