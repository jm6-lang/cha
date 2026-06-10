<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💍</view>
        <text class="header-title">婚史查询</text>
        <text class="header-desc">婚姻登记记录查询</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名+身份证号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="search-types">
      <text class="types-title">查询类型</text>
      <view class="types-list">
        <view v-for="t in types" :key="t.key" class="type-item" :class="{ active: activeType === t.key }" @tap="activeType = t.key">
          <text class="type-text">{{ t.name }}</text>
          <text class="type-price">¥{{ t.price }}</text>
        </view>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-header">
        <text class="result-title">查询结果</text>
        <text class="result-time">{{ queryTime }}</text>
      </view>
      <view class="result-info">
        <view class="info-row">
          <text class="info-label">查询对象</text>
          <text class="info-value">{{ keyword || '李*华' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">婚姻状态</text>
          <text class="info-value highlight">已婚</text>
        </view>
        <view class="info-row">
          <text class="info-label">配偶姓名</text>
 <text class="info-value">王*敏</text>
        </view>
        <view class="info-row">
          <text class="info-label">登记时间</text>
          <text class="info-value">2020-06-15</text>
        </view>
        <view class="info-row">
          <text class="info-label">登记机关</text>
          <text class="info-value">北京市朝阳区民政局</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="help-block">
      <text class="help-title">📝 温馨提示</text>
      <text class="help-text">· 本服务仅供合法用途使用</text>
      <text class="help-text">· 需本人授权或提供合法证明</text>
      <text class="help-text">· 结果仅供参考，以民政部门为准</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const activeType = ref('current');
const queryTime = ref('');
const types = [
  { key: 'current', name: '当前婚姻', price: '5.9' },
  { key: 'history', name: '历史记录', price: '9.9' },
  { key: 'all', name: '全部记录', price: '15' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入信息', icon: 'none' });
    return;
  }
  searched.value = true;
  queryTime.value = new Date().toLocaleString('zh-CN');
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
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
.search-types { padding: 30rpx 24rpx 0; }
.types-title { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-bottom: 16rpx; }
.types-list { display: flex; gap: 16rpx; }
.type-item { flex: 1; background: #fff; border-radius: 16rpx; padding: 24rpx 0; text-align: center; }
.type-item.active { background: linear-gradient(135deg, #E91E63, #F06292); }
.type-text { font-size: 26rpx; color: $text-primary; display: block; }
.type-item.active .type-text { color: #fff; }
.type-price { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
.type-item.active .type-price { color: rgba(255,255,255,0.9); }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; background: linear-gradient(135deg, #FFE4EC, #FFF0F5); display: flex; justify-content: space-between; }
.result-title { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.result-time { font-size: 22rpx; color: $text-tertiary; }
.result-info { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.info-value.highlight { color: $danger; font-weight: 700; }
.help-block { margin: 30rpx 24rpx; padding: 30rpx; background: #FFF7E6; border-radius: 20rpx; }
.help-title { font-size: 28rpx; color: $warning; font-weight: 700; display: block; margin-bottom: 16rpx; }
.help-text { font-size: 24rpx; color: $text-secondary; display: block; line-height: 1.8; }
</style>
