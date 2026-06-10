<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🛒</view>
        <text class="header-title">二手交易</text>
        <text class="header-desc">二手车 · 二手房 · 二手物品</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入关键词" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">搜索</text>
      </view>
    </view>

    <view class="types">
      <view v-for="t in types" :key="t.name" class="type-item">
        <text class="type-emoji">{{ t.emoji }}</text>
        <text class="type-name">{{ t.name }}</text>
      </view>
    </view>

    <view class="product-list">
      <text class="section-title">热门推荐</text>
      <view v-for="(p, i) in products" :key="i" class="product-card">
        <view class="product-img">{{ p.img }}</view>
        <view class="product-info">
          <text class="product-name">{{ p.name }}</text>
          <text class="product-price">¥{{ p.price }}<text class="product-old">¥{{ p.oldPrice }}</text></text>
          <text class="product-meta">{{ p.meta }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const types = [
  { emoji: '🚗', name: '二手车' },
  { emoji: '🏠', name: '二手房' },
  { emoji: '📱', name: '数码产品' },
  { emoji: '👕', name: '服饰' },
  { emoji: '🪑', name: '家具家电' },
  { emoji: '📚', name: '图书教材' },
  { emoji: '🚲', name: '交通工具' },
  { emoji: '🎁', name: '闲置物品' }
];
const products = [
  { name: 'iPhone 15 Pro Max 256G 黑色', img: '📱', price: '7,200', oldPrice: '9,999', meta: '9 成新 · 北京' },
  { name: '奔驰 E300L 2022 款', img: '🚗', price: '32.8万', oldPrice: '48万', meta: '2 万公里 · 准新车' },
  { name: '三室一厅 朝阳望京 89㎡', img: '🏠', price: '680万', oldPrice: '750万', meta: '南北通透 · 满五唯一' },
  { name: 'MacBook Pro 14寸 M3', img: '💻', price: '12,500', oldPrice: '15,999', meta: '95 新 · 北京海淀' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入关键词', icon: 'none' });
    return;
  }
  uni.showToast({ title: '搜索中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF9800, #FFB74D); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.types { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; padding: 30rpx 24rpx 0; }
.type-item { background: #fff; border-radius: 16rpx; padding: 20rpx 0; text-align: center; }
.type-emoji { font-size: 44rpx; display: block; }
.type-name { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.product-list { }
.product-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 20rpx; display: flex; }
.product-img { width: 180rpx; height: 180rpx; background: $bg-page; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 80rpx; flex-shrink: 0; }
.product-info { flex: 1; margin-left: 20rpx; display: flex; flex-direction: column; }
.product-name { font-size: 28rpx; color: $text-primary; font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-price { font-size: 32rpx; color: $danger; font-weight: 700; margin: 10rpx 0; }
.product-old { font-size: 22rpx; color: $text-tertiary; text-decoration: line-through; margin-left: 12rpx; }
.product-meta { font-size: 22rpx; color: $text-tertiary; margin-top: auto; }
</style>
