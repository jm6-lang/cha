<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💑</view>
        <text class="header-title">伴侣背调</text>
        <text class="header-desc">婚前/恋爱背景调查</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入对方姓名/手机号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">专业查询</text>
      </view>
    </view>

    <view class="package-section">
      <text class="section-title">背调套餐</text>
      <view class="pkg-list">
        <view v-for="p in pkgs" :key="p.name" class="pkg-card" :class="{ featured: p.featured }">
          <view v-if="p.featured" class="pkg-tag">推荐</view>
          <text class="pkg-name">{{ p.name }}</text>
          <text class="pkg-price">¥{{ p.price }}</text>
          <view class="pkg-items">
            <text v-for="(it, i) in p.items" :key="i" class="pkg-item">✓ {{ it }}</text>
          </view>
          <view class="pkg-btn" @tap="onPick(p)">立即下单</view>
        </view>
      </view>
    </view>

    <view class="info-section">
      <text class="section-title">背调内容</text>
      <view class="info-grid">
        <view v-for="i in items" :key="i.name" class="info-cell">
          <text class="info-emoji">{{ i.emoji }}</text>
          <text class="info-name">{{ i.name }}</text>
        </view>
      </view>
    </view>

    <view class="promise">
      <text class="promise-title">🛡️ 数查承诺</text>
      <text class="promise-text">· 严格保密，结果仅授权人可见</text>
      <text class="promise-text">· 律师协助，合规合法</text>
      <text class="promise-text">· 数据来源权威，结果可追溯</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');

const pkgs = [
  { name: '基础背调', price: '5.9', items: ['身份核验', '手机号核验', '在逃核查'], featured: false },
  { name: '标准背调', price: '28', items: ['基础内容', '婚姻状况', '学历核查', '车辆房产', '信贷风险'], featured: true },
  { name: '深度背调', price: '88', items: ['标准内容', '社会关系', '出行记录', '工作背景', '详细报告'], featured: false }
];

const items = [
  { emoji: '🆔', name: '身份核验' },
  { emoji: '💍', name: '婚姻状况' },
  { emoji: '🎓', name: '学历核查' },
  { emoji: '🚗', name: '车辆房产' },
  { emoji: '⚖️', name: '诉讼记录' },
  { emoji: '💼', name: '工作背景' },
  { emoji: '📞', name: '通讯分析' },
  { emoji: '🔍', name: '失信记录' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入查询信息', icon: 'none' });
    return;
  }
  uni.showToast({ title: '请选择套餐', icon: 'none' });
};
const onPick = (p: any) => {
  uni.showToast({ title: `已选 ${p.name} ¥${p.price}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #E91E63, #F06292); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; margin: 30rpx 24rpx 20rpx; }
.package-section { }
.pkg-list { padding: 0 24rpx; display: flex; flex-direction: column; gap: 20rpx; }
.pkg-card { background: #fff; border-radius: 20rpx; padding: 30rpx; position: relative; }
.pkg-card.featured { border: 2rpx solid #E91E63; }
.pkg-tag { position: absolute; top: 0; right: 30rpx; background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 20rpx; padding: 6rpx 16rpx; border-radius: 0 0 12rpx 12rpx; }
.pkg-name { font-size: 32rpx; color: $text-primary; font-weight: 700; }
.pkg-price { font-size: 50rpx; color: $danger; font-weight: 700; display: block; margin: 12rpx 0; }
.pkg-price::before { content: '¥'; font-size: 28rpx; }
.pkg-items { display: flex; flex-wrap: wrap; gap: 12rpx; margin: 16rpx 0 24rpx; }
.pkg-item { font-size: 24rpx; color: $text-secondary; background: $bg-page; padding: 6rpx 16rpx; border-radius: 6rpx; }
.pkg-btn { background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 28rpx; text-align: center; padding: 20rpx; border-radius: 16rpx; }
.info-grid { padding: 0 24rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20rpx; }
.info-cell { background: #fff; border-radius: 16rpx; padding: 24rpx 0; display: flex; flex-direction: column; align-items: center; }
.info-emoji { font-size: 40rpx; }
.info-name { font-size: 22rpx; color: $text-secondary; margin-top: 6rpx; }
.promise { margin: 30rpx 24rpx; padding: 24rpx; background: linear-gradient(135deg, #FFF0F5, #FFE4EC); border-radius: 20rpx; }
.promise-title { font-size: 28rpx; color: #E91E63; font-weight: 700; display: block; margin-bottom: 12rpx; }
.promise-text { font-size: 24rpx; color: $text-secondary; display: block; line-height: 1.8; }
</style>
