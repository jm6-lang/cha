<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🍲</view>
        <text class="header-title">菜谱查询</text>
        <text class="header-desc">食材 · 做法 · 口味 · 营养</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入菜名/食材，如 番茄炒蛋" placeholder-class="placeholder" @confirm="onSearch" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="cats">
      <text class="section-title">热门分类</text>
      <view class="cat-list">
        <view v-for="c in cats" :key="c.name" class="cat-item" @tap="onPickCat(c.name)">
          <text class="cat-emoji">{{ c.emoji }}</text>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询菜谱...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && recipes.length === 0 && !error" class="empty">
      <text class="empty-icon">🍽️</text>
      <text class="empty-text">输入食材或菜名查询</text>
    </view>

    <view class="recipe-list">
      <view v-for="(r, i) in recipes" :key="i" class="recipe-card">
        <view class="r-head">
          <text class="r-name">{{ r.name }}</text>
        </view>
        <view class="r-info" v-if="r.tags">
          <text class="r-tag">📌 {{ r.tags }}</text>
        </view>
        <view class="r-info">
          <text class="r-label">🥘 主料：</text>
          <text class="r-value">{{ r.ingredients || '见步骤' }}</text>
        </view>
        <view class="r-info" v-if="r.steps">
          <text class="r-label">📝 做法：</text>
          <text class="r-value">{{ r.steps }}</text>
        </view>
        <view class="r-img" v-if="r.pic">
          <image :src="r.pic" mode="aspectFill" class="r-pic" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryRecipe, type Recipe } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const loading = ref(false);
const error = ref('');
const recipes = ref<Recipe[]>([]);

const cats = [
  { emoji: '🥩', name: '荤菜' },
  { emoji: '🥬', name: '素菜' },
  { emoji: '🍜', name: '主食' },
  { emoji: '🍰', name: '甜品' },
  { emoji: '🥤', name: '汤羹' },
  { emoji: '🥗', name: '凉菜' },
  { emoji: '🍲', name: '火锅' },
  { emoji: '🍱', name: '便当' },
];

const onPickCat = (name: string) => {
  keyword.value = name;
  onSearch();
};

const onSearch = async () => {
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入菜名', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const r = await queryRecipe(keyword.value.trim());
    if (!r) {
      recipes.value = mockRecipe(keyword.value.trim());
    } else {
      recipes.value = r;
    }
  } catch (e) {
    error.value = '查询失败，请重试';
  } finally {
    loading.value = false;
  }
};

const mockRecipe = (k: string): Recipe[] => [
  { name: `${k} 经典做法`, ingredients: '主料、配料适量', steps: '1. 准备食材；2. 热锅下油；3. 翻炒；4. 调味出锅', tags: '家常 · 简单' },
  { name: `${k} 升级版`, ingredients: '主料、配料、调料', steps: '1. 处理食材；2. 腌制入味；3. 大火快炒；4. 装盘', tags: '进阶 · 美味' },
  { name: `${k} 懒人版`, ingredients: '速食食材', steps: '1. 一锅出；2. 5 分钟搞定', tags: '懒人 · 速食' },
];
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF6B35, #FF9F66); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF6B35, #FF9F66); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.cats { }
.cat-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.cat-item { text-align: center; padding: 16rpx 0; }
.cat-emoji { font-size: 50rpx; display: block; }
.cat-name { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.empty { padding: 100rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 100rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
.recipe-list { padding: 24rpx; }
.recipe-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.r-head { padding-bottom: 12rpx; border-bottom: 1rpx solid $border-color; }
.r-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.r-info { margin-top: 12rpx; display: flex; align-items: flex-start; }
.r-label { font-size: 24rpx; color: $text-secondary; flex-shrink: 0; }
.r-value { font-size: 24rpx; color: $text-primary; line-height: 1.6; flex: 1; }
.r-tag { font-size: 22rpx; color: $danger; }
.r-img { margin-top: 16rpx; }
.r-pic { width: 100%; height: 360rpx; border-radius: 12rpx; }
</style>
