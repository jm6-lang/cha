<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎓</view>
        <text class="header-title">学校查询</text>
        <text class="header-desc">全国高校 · 学历认证</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入学校名称/代码" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="filter-bar">
      <view v-for="t in types" :key="t" class="filter" :class="{ active: activeType === t }" @tap="activeType = t">
        <text class="filter-text">{{ t }}</text>
      </view>
    </view>

    <view class="school-list">
      <view v-for="(s, i) in schools" :key="i" class="school-card">
        <view class="school-logo">{{ s.name[0] }}</view>
        <view class="school-info">
          <view class="school-name-row">
            <text class="school-name">{{ s.name }}</text>
            <text class="school-tag" :class="{ top: s.top }">{{ s.level }}</text>
          </view>
          <text class="school-addr">📍 {{ s.addr }}</text>
          <view class="school-stats">
            <text class="stat">985</text>
            <text class="stat">211</text>
            <text class="stat">双一流</text>
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
const activeType = ref('全部');
const types = ['全部', '985', '211', '本科', '专科', '民办'];
const schools = [
  { name: '清华大学', level: '985/211', addr: '北京市海淀区清华园1号', top: true },
  { name: '北京大学', level: '985/211', addr: '北京市海淀区颐和园路5号', top: true },
  { name: '复旦大学', level: '985/211', addr: '上海市杨浦区邯郸路220号', top: true },
  { name: '上海交通大学', level: '985/211', addr: '上海市闵行区东川路800号', top: true },
  { name: '浙江大学', level: '985/211', addr: '杭州市西湖区余杭塘路866号', top: true }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入学校名称', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.filter-bar { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; overflow-x: auto; }
.filter { padding: 10rpx 24rpx; background: #fff; border-radius: 30rpx; }
.filter.active { background: linear-gradient(135deg, #7B61FF, #A78BFA); }
.filter-text { font-size: 24rpx; color: $text-secondary; }
.filter.active .filter-text { color: #fff; }
.school-list { padding: 24rpx; }
.school-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; display: flex; }
.school-logo { width: 100rpx; height: 100rpx; border-radius: 16rpx; background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 50rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.school-info { flex: 1; margin-left: 20rpx; }
.school-name-row { display: flex; justify-content: space-between; align-items: center; }
.school-name { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.school-tag { font-size: 20rpx; color: $danger; background: rgba(255,82,82,0.1); padding: 4rpx 12rpx; border-radius: 6rpx; }
.school-tag.top { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; }
.school-addr { font-size: 24rpx; color: $text-tertiary; display: block; margin: 8rpx 0; }
.school-stats { display: flex; gap: 10rpx; }
.stat { font-size: 20rpx; color: $info; background: rgba(26,108,255,0.08); padding: 4rpx 12rpx; border-radius: 6rpx; }
</style>
