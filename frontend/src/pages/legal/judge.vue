<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⚖️</view>
        <text class="header-title">裁判文书</text>
        <text class="header-desc">中国裁判文书网 · 同步更新</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名/案号/关键词" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="filter-bar">
      <view v-for="f in filters" :key="f" class="filter-chip">{{ f }}</view>
    </view>

    <view class="result-list">
      <view v-for="(r, i) in list" :key="i" class="case-card">
        <view class="case-top">
          <text class="case-no">案号：{{ r.no }}</text>
          <text class="case-time">{{ r.time }}</text>
        </view>
        <text class="case-title">{{ r.title }}</text>
        <view class="case-meta">
          <text class="meta-tag">{{ r.type }}</text>
          <text class="meta-tag">{{ r.court }}</text>
        </view>
        <view class="case-bottom">
          <text class="case-result">{{ r.result }}</text>
          <text class="case-detail">查看详情 ›</text>
        </view>
      </view>
    </view>

    <view class="load-more" @tap="loadMore">加载更多</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const filters = ['全部', '刑事', '民事', '行政', '执行', '赔偿'];
const list = [
  { no: '(2025)京01民终1234号', title: '张某与李某民间借贷纠纷一案', type: '民事', court: '北京市第一中级人民法院', result: '二审维持原判', time: '2025-05-10' },
  { no: '(2025)沪0115民初5678号', title: '王某诉某科技公司合同纠纷案', type: '民事', court: '上海市浦东新区人民法院', result: '调解结案', time: '2025-04-22' },
  { no: '(2024)粤0304刑初9012号', title: '某公司涉嫌诈骗罪一案', type: '刑事', court: '深圳市福田区人民法院', result: '判决有罪', time: '2024-12-08' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入关键词', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
const loadMore = () => uni.showToast({ title: '加载中', icon: 'loading' });
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
.filter-bar { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; overflow-x: auto; }
.filter-chip { padding: 10rpx 24rpx; background: #fff; border-radius: 30rpx; font-size: 24rpx; color: $text-secondary; white-space: nowrap; }
.result-list { padding: 24rpx; }
.case-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.case-top { display: flex; justify-content: space-between; }
.case-no { font-size: 22rpx; color: $text-tertiary; }
.case-time { font-size: 22rpx; color: $text-tertiary; }
.case-title { font-size: 30rpx; color: $text-primary; font-weight: 600; display: block; margin: 12rpx 0; line-height: 1.4; }
.case-meta { display: flex; gap: 12rpx; margin-bottom: 16rpx; }
.meta-tag { font-size: 22rpx; color: $info; background: rgba(26,108,255,0.08); padding: 4rpx 16rpx; border-radius: 6rpx; }
.case-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16rpx; border-top: 1rpx solid $border-color; }
.case-result { font-size: 26rpx; color: $text-secondary; }
.case-detail { font-size: 24rpx; color: $primary; }
.load-more { text-align: center; padding: 30rpx; color: $text-tertiary; font-size: 26rpx; }
</style>
