<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📡</view>
        <text class="header-title">空号检测</text>
        <text class="header-desc">号码状态 · 在线 · 活跃度</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入手机号" placeholder-class="placeholder" maxlength="11" />
        <text class="search-btn" @tap="onSearch">检测</text>
      </view>
    </view>

    <view class="batch-mode">
      <text class="batch-tip">💡 提示：一次最多支持 1000 个号码批量检测</text>
    </view>

    <view v-if="searched" class="result-card">
      <view class="result-status" :class="{ active: result.active }">
        <text class="status-icon">{{ result.active ? '✓' : '✕' }}</text>
        <text class="status-text">{{ result.active ? '活跃用户' : '空号/停机' }}</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">检测号码</text>
          <text class="grid-value">{{ formatPhone(keyword) }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">运营商</text>
          <text class="grid-value">{{ result.carrier }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">归属地</text>
          <text class="grid-value">{{ result.area }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">号码状态</text>
          <text class="grid-value" :class="{ active: result.active }">{{ result.active ? '正常在用' : '空号' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">在网时长</text>
          <text class="grid-value">{{ result.duration }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">活跃度</text>
          <text class="grid-value highlight">{{ result.activity }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">消费等级</text>
          <text class="grid-value">{{ result.level }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="placeholder-block">
      <text class="ph-icon">📡</text>
      <text class="ph-text">输入手机号检测状态</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const result = ref({ active: true, carrier: '中国移动', area: '广东 深圳', duration: '5年8个月', activity: '高', level: '中高端' });

const formatPhone = (p: string) => {
  return p.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1 $2 $3').trim();
};

const onSearch = () => {
  if (!/^1[3-9]\d{9}$/.test(keyword.value)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' });
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
.batch-mode { margin: 30rpx 24rpx 0; }
.batch-tip { font-size: 22rpx; color: $text-tertiary; display: block; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-status { padding: 50rpx; display: flex; flex-direction: column; align-items: center; background: linear-gradient(135deg, #07C160, #4DD599); }
.result-status.active { background: linear-gradient(135deg, #07C160, #4DD599); }
.status-icon { width: 100rpx; height: 100rpx; line-height: 100rpx; text-align: center; background: #fff; color: $primary; border-radius: 50%; font-size: 60rpx; font-weight: 700; }
.status-text { font-size: 32rpx; color: #fff; font-weight: 700; margin-top: 16rpx; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.grid-value.highlight { color: $primary; font-weight: 700; }
.grid-value.active { color: $primary; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
