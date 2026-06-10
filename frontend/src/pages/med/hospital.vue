<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏥</view>
        <text class="header-title">医院查询</text>
        <text class="header-desc">全国医院资质 · 等级 · 科室</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入医院名称/科室" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="filter-tabs">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view class="hospital-list">
      <view v-for="(h, i) in list" :key="i" class="hospital-card">
        <view class="hospital-name-row">
          <text class="h-name">{{ h.name }}</text>
          <text class="h-level">{{ h.level }}</text>
        </view>
        <text class="h-type">{{ h.type }} · {{ h.nature }}</text>
        <view class="h-addr">
          <text class="addr-icon">📍</text>
          <text class="addr-text">{{ h.addr }}</text>
        </view>
        <view class="h-tags">
          <text v-for="t in h.tags" :key="t" class="h-tag">{{ t }}</text>
        </view>
        <view class="h-stats">
          <view class="h-stat">
            <text class="stat-num">{{ h.beds }}</text>
            <text class="stat-lbl">床位</text>
          </view>
          <view class="h-stat">
            <text class="stat-num">{{ h.docs }}</text>
            <text class="stat-lbl">医生</text>
          </view>
          <view class="h-stat">
            <text class="stat-num">{{ h.depts }}</text>
            <text class="stat-lbl">科室</text>
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
const activeTab = ref('all');
const tabs = [
  { key: 'all', name: '全部' },
  { key: '3a', name: '三甲' },
  { key: 'special', name: '专科' },
  { key: 'community', name: '社区' }
];
const list = [
  { name: '北京协和医院', level: '三甲', type: '综合医院', nature: '公立', addr: '北京市东城区帅府园1号', tags: ['综合', '重点学科', '医保'], beds: '2000', docs: '1800+', depts: '54' },
  { name: '北京大学第一医院', level: '三甲', type: '综合医院', nature: '公立', addr: '北京市西城区西什库大街8号', tags: ['综合', '医保'], beds: '1500', docs: '1200+', depts: '46' },
  { name: '上海瑞金医院', level: '三甲', type: '综合医院', nature: '公立', addr: '上海市黄浦区瑞金二路197号', tags: ['综合', '重点学科'], beds: '1800', docs: '1500+', depts: '48' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入医院名称', icon: 'none' });
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
.filter-tabs { display: flex; padding: 30rpx 24rpx 0; gap: 20rpx; }
.tab { padding: 12rpx 30rpx; background: #fff; border-radius: 30rpx; }
.tab.active { background: linear-gradient(135deg, #00BCD4, #4DD0E1); }
.tab-text { font-size: 24rpx; color: $text-secondary; }
.tab.active .tab-text { color: #fff; }
.hospital-list { padding: 24rpx; }
.hospital-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.hospital-name-row { display: flex; justify-content: space-between; align-items: center; }
.h-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.h-level { font-size: 22rpx; color: $danger; background: rgba(255,82,82,0.1); padding: 4rpx 16rpx; border-radius: 6rpx; }
.h-type { font-size: 24rpx; color: $text-secondary; display: block; margin: 8rpx 0; }
.h-addr { display: flex; align-items: flex-start; }
.addr-icon { font-size: 22rpx; margin-right: 8rpx; margin-top: 2rpx; }
.addr-text { font-size: 24rpx; color: $text-tertiary; flex: 1; }
.h-tags { display: flex; gap: 10rpx; margin: 12rpx 0; }
.h-tag { font-size: 20rpx; color: $info; background: rgba(26,108,255,0.08); padding: 2rpx 12rpx; border-radius: 6rpx; }
.h-stats { display: flex; padding-top: 16rpx; border-top: 1rpx solid $border-color; }
.h-stat { flex: 1; text-align: center; }
.stat-num { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.stat-lbl { font-size: 20rpx; color: $text-tertiary; }
</style>
