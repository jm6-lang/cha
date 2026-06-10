<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💊</view>
        <text class="header-title">药品查询</text>
        <text class="header-desc">国药准字 · 处方药 · 中成药</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入药品名称/批准文号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="categories">
      <text class="section-title">分类</text>
      <view class="cat-list">
        <view v-for="c in cats" :key="c.name" class="cat-item">
          <text class="cat-emoji">{{ c.emoji }}</text>
          <text class="cat-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="drug-list">
      <text class="section-title">常见药品</text>
      <view v-for="(d, i) in drugs" :key="i" class="drug-card">
        <view class="drug-icon">💊</view>
        <view class="drug-info">
          <view class="drug-name-row">
            <text class="drug-name">{{ d.name }}</text>
            <text class="drug-type">{{ d.type }}</text>
          </view>
          <text class="drug-spec">{{ d.spec }} · {{ d.manufacturer }}</text>
          <view class="drug-meta">
            <text class="meta-item">批准文号: {{ d.no }}</text>
            <text class="meta-item">OTC: {{ d.otc ? '是' : '否' }}</text>
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
const cats = [
  { emoji: '💊', name: '处方药' },
  { emoji: '🟢', name: 'OTC' },
  { emoji: '🧪', name: '中成药' },
  { emoji: '🌿', name: '中药' },
  { emoji: '💉', name: '注射剂' },
  { emoji: '🧴', name: '外用药' },
  { emoji: '🩹', name: '医用耗材' },
  { emoji: '🧬', name: '生物制品' }
];
const drugs = [
  { name: '阿莫西林胶囊', type: '处方药', spec: '0.25g*24粒', manufacturer: '石药集团', no: '国药准字H1302****', otc: false },
  { name: '布洛芬缓释胶囊', type: 'OTC甲', spec: '0.3g*20粒', manufacturer: '中美天津史克', no: '国药准字H1096****', otc: true },
  { name: '感冒灵颗粒', type: 'OTC甲', spec: '10g*9袋', manufacturer: '华润三九', no: '国药准字Z4402****', otc: true }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入药品名称', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #00BCD4, #4DD0E1); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.cat-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.cat-item { text-align: center; padding: 16rpx 0; }
.cat-emoji { font-size: 50rpx; display: block; }
.cat-name { font-size: 22rpx; color: $text-secondary; margin-top: 6rpx; display: block; }
.drug-list { }
.drug-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 24rpx; display: flex; }
.drug-icon { width: 100rpx; height: 100rpx; background: linear-gradient(135deg, #00BCD4, #4DD0E1); border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 50rpx; flex-shrink: 0; }
.drug-info { flex: 1; margin-left: 20rpx; }
.drug-name-row { display: flex; justify-content: space-between; align-items: center; }
.drug-name { font-size: 28rpx; color: $text-primary; font-weight: 700; }
.drug-type { font-size: 20rpx; color: $danger; background: rgba(255,82,82,0.1); padding: 4rpx 12rpx; border-radius: 6rpx; }
.drug-spec { font-size: 24rpx; color: $text-secondary; display: block; margin: 6rpx 0; }
.drug-meta { display: flex; flex-direction: column; }
.meta-item { font-size: 22rpx; color: $text-tertiary; line-height: 1.5; }
</style>
