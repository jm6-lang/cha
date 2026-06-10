<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🐶</view>
        <text class="header-title">宠物服务</text>
        <text class="header-desc">宠物医院 · 美容 · 寄养</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入服务/位置" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="quick-funcs">
      <view v-for="f in funcs" :key="f.name" class="func-item">
        <text class="func-emoji">{{ f.emoji }}</text>
        <text class="func-name">{{ f.name }}</text>
      </view>
    </view>

    <view class="shop-list">
      <text class="section-title">附近宠物店</text>
      <view v-for="(s, i) in shops" :key="i" class="shop-card">
        <view class="shop-icon">{{ s.emoji }}</view>
        <view class="shop-info">
          <text class="shop-name">{{ s.name }}</text>
          <text class="shop-addr">📍 {{ s.addr }} · {{ s.distance }}</text>
          <view class="shop-stats">
            <text class="stat">⭐ {{ s.score }}</text>
            <text class="stat">月售 {{ s.sales }}</text>
          </view>
          <view class="shop-tags">
            <text v-for="t in s.tags" :key="t" class="shop-tag">{{ t }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const funcs = [
  { emoji: '🏥', name: '宠物医院' },
  { emoji: '✂️', name: '美容洗护' },
  { emoji: '🏠', name: '宠物寄养' },
  { emoji: '🎓', name: '宠物训练' },
  { emoji: '🛒', name: '宠物用品' },
  { emoji: '💉', name: '疫苗接种' },
  { emoji: '📷', name: '宠物摄影' },
  { emoji: '🧬', name: '宠物配种' }
];
const shops = [
  { name: '宠爱一生宠物医院', emoji: '🏥', addr: '朝阳区望京街', distance: '500m', score: '4.8', sales: '328', tags: ['24小时', '医保', '名医'] },
  { name: '萌宠美容 SPA', emoji: '✂️', addr: '海淀区中关村大街', distance: '1.2km', score: '4.7', sales: '256', tags: ['精修', '上门'] },
  { name: '汪星人寄养中心', emoji: '🏠', addr: '昌平区回龙观', distance: '8.5km', score: '4.9', sales: '186', tags: ['独立房间', '24h监控'] }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
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
.quick-funcs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; padding: 30rpx 24rpx 0; }
.func-item { background: #fff; border-radius: 16rpx; padding: 20rpx 0; text-align: center; }
.func-emoji { font-size: 44rpx; display: block; }
.func-name { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.shop-list { }
.shop-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 24rpx; display: flex; }
.shop-icon { width: 100rpx; height: 100rpx; background: linear-gradient(135deg, #FF9800, #FFB74D); border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 50rpx; flex-shrink: 0; }
.shop-info { flex: 1; margin-left: 20rpx; }
.shop-name { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.shop-addr { font-size: 22rpx; color: $text-tertiary; display: block; margin: 6rpx 0; }
.shop-stats { display: flex; gap: 16rpx; }
.stat { font-size: 22rpx; color: $warning; }
.shop-tags { display: flex; gap: 10rpx; margin-top: 8rpx; }
.shop-tag { font-size: 20rpx; color: $primary; background: rgba(7,193,96,0.1); padding: 2rpx 12rpx; border-radius: 6rpx; }
</style>
