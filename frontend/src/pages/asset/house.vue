<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏠</view>
        <text class="header-title">房产查询</text>
        <text class="header-desc">全国房产信息 · 不动产登记</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-icon">⚠️</text>
      <text class="notice-text">本服务仅限本人查询，结果严格保密</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-title">名下房产信息</text>
        <text class="result-count">共 2 套</text>
      </view>
      <view v-for="(h, i) in houses" :key="i" class="house-card">
        <view class="house-top">
          <text class="house-name">{{ h.name }}</text>
          <text class="house-nature">{{ h.nature }}</text>
        </view>
        <view class="house-addr">
          <text class="addr-icon">📍</text>
          <text class="addr-text">{{ h.addr }}</text>
        </view>
        <view class="house-info">
          <view class="info-cell">
            <text class="cell-num">{{ h.area }}㎡</text>
            <text class="cell-lbl">建筑面积</text>
          </view>
          <view class="info-cell">
            <text class="cell-num">¥{{ h.value }}万</text>
            <text class="cell-lbl">市值估价</text>
          </view>
          <view class="info-cell">
            <text class="cell-num">{{ h.year }}</text>
            <text class="cell-lbl">购置年份</text>
          </view>
        </view>
        <view class="house-bottom">
          <text class="house-cert">不动产证号：{{ h.cert }}</text>
          <text class="house-status">{{ h.status }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="info-block">
      <view class="info-card">
        <text class="info-title">🔍 全面查询</text>
        <text class="info-desc">名下住宅、商住、别墅、车位全掌握</text>
      </view>
      <view class="info-card">
        <text class="info-title">🔒 隐私保障</text>
        <text class="info-desc">银行级加密，本人不授权不可查</text>
      </view>
      <view class="info-card">
        <text class="info-title">⚡ 实时同步</text>
        <text class="info-desc">与不动产登记中心数据同步</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);

const houses = [
  { name: '朝阳区阳光小区', nature: '住宅', addr: '北京市朝阳区望京街道阳光小区3号楼2单元1801', area: '89.5', value: '650', year: '2018', cert: '京(2018)朝不动产权第****1234号', status: '已备案' },
  { name: '海淀区中关村公寓', nature: '商住', addr: '北京市海淀区中关村大街18号6层', area: '52.0', value: '420', year: '2020', cert: '京(2020)海不动产权第****5678号', status: '已备案' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
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
.notice { margin: 30rpx 24rpx; padding: 20rpx 24rpx; background: #FFF7E6; border-radius: 16rpx; display: flex; align-items: center; }
.notice-icon { font-size: 28rpx; margin-right: 12rpx; }
.notice-text { font-size: 24rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; display: flex; justify-content: space-between; border-bottom: 1rpx solid $border-color; }
.result-title { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.result-count { font-size: 24rpx; color: $text-tertiary; }
.house-card { padding: 24rpx; border-bottom: 1rpx solid $border-color; }
.house-card:last-child { border-bottom: none; }
.house-top { display: flex; justify-content: space-between; align-items: center; }
.house-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.house-nature { font-size: 22rpx; color: $primary; background: rgba(7,193,96,0.1); padding: 4rpx 14rpx; border-radius: 6rpx; }
.house-addr { display: flex; align-items: flex-start; margin: 12rpx 0; }
.addr-icon { font-size: 22rpx; margin-right: 8rpx; margin-top: 2rpx; }
.addr-text { font-size: 24rpx; color: $text-tertiary; flex: 1; }
.house-info { display: flex; background: $bg-page; border-radius: 12rpx; padding: 20rpx 0; }
.info-cell { flex: 1; text-align: center; }
.cell-num { font-size: 28rpx; color: $text-primary; font-weight: 700; display: block; }
.cell-lbl { font-size: 20rpx; color: $text-tertiary; }
.house-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 16rpx; }
.house-cert { font-size: 22rpx; color: $text-tertiary; }
.house-status { font-size: 22rpx; color: $primary; }
.info-block { padding: 30rpx 24rpx; }
.info-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }
.info-title { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.info-desc { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 8rpx; }
</style>
