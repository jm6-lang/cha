<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📛</view>
        <text class="header-title">逾期黑名单</text>
        <text class="header-desc">网贷/信用卡逾期一站查询</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="tab-bar">
      <view v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-tip">检测到 3 条相关记录</text>
      </view>
      <view v-for="(r, i) in records" :key="i" class="record-item">
        <view class="record-top">
          <text class="record-platform">{{ r.platform }}</text>
          <text class="record-amount">{{ r.amount }}</text>
        </view>
        <view class="record-meta">
          <text class="meta-item">逾期 {{ r.days }}天</text>
          <text class="meta-item">{{ r.type }}</text>
        </view>
        <text class="record-time">{{ r.time }}</text>
      </view>
    </view>

    <view v-if="!searched" class="info-block">
      <view class="info-card">
        <text class="info-title">🔐 隐私保护</text>
        <text class="info-desc">所有查询加密传输，仅本人可见，结果不外泄</text>
      </view>
      <view class="info-card">
        <text class="info-title">📊 数据全面</text>
        <text class="info-desc">覆盖 200+ 网贷平台 + 银行信用卡数据</text>
      </view>
      <view class="info-card">
        <text class="info-title">⚡ 实时更新</text>
        <text class="info-desc">与各大平台数据同步，结果准确可靠</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const activeTab = ref('all');
const tabs = [
  { key: 'all', name: '全部' },
  { key: 'loan', name: '网贷' },
  { key: 'card', name: '信用卡' }
];
const records = [
  { platform: '某小贷平台', amount: '¥3,500', days: '47', type: '网贷', time: '2025-04-12' },
  { platform: '某银行信用卡', amount: '¥8,260', days: '92', type: '信用卡', time: '2025-02-08' },
  { platform: '某消费金融', amount: '¥1,200', days: '15', type: '网贷', time: '2025-05-20' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入查询信息', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #FF6B35, #FF9F66); padding: 30rpx 40rpx 80rpx; }
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
.tab-bar { display: flex; padding: 30rpx 24rpx 0; gap: 20rpx; }
.tab-item { padding: 12rpx 30rpx; background: #fff; border-radius: 30rpx; }
.tab-item.active { background: linear-gradient(135deg, #FF6B35, #FF9F66); }
.tab-text { font-size: 24rpx; color: $text-secondary; }
.tab-item.active .tab-text { color: #fff; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; border-bottom: 1rpx solid $border-color; }
.result-tip { font-size: 26rpx; color: $danger; font-weight: 600; }
.record-item { padding: 24rpx; border-bottom: 1rpx solid $border-color; }
.record-item:last-child { border-bottom: none; }
.record-top { display: flex; justify-content: space-between; align-items: center; }
.record-platform { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.record-amount { font-size: 32rpx; color: $danger; font-weight: 700; }
.record-meta { display: flex; gap: 16rpx; margin-top: 8rpx; }
.meta-item { font-size: 22rpx; color: $text-tertiary; background: $bg-page; padding: 4rpx 12rpx; border-radius: 6rpx; }
.record-time { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 10rpx; }
.info-block { padding: 30rpx 24rpx; }
.info-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }
.info-title { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.info-desc { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 8rpx; line-height: 1.5; }
</style>
