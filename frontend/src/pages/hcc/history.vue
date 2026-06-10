<template>
  <view class="container">
    <view v-if="store.loading" class="loading-wrap">
      <view class="loading-spinner" />
      <text class="loading-text">加载中...</text>
    </view>
    <view v-else-if="store.list.length === 0" class="empty-wrap">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无查询记录</text>
      <text class="empty-hint">去首页查询号码吧</text>
      <view class="empty-btn" @tap="goHome">
        <text class="empty-btn-text">去查询</text>
      </view>
    </view>
    <view v-else class="list">
      <view v-for="item in store.list" :key="item.id" class="item" @tap="goResult(item.number)">
        <view class="item-top">
          <text class="number">{{ item.number }}</text>
          <text class="time">{{ formatTime(item.createTime) }}</text>
        </view>
        <view class="item-bottom">
          <view class="item-meta">
            <text class="meta-text">{{ item.province }} {{ item.city }} · {{ item.carrier }}</text>
          </view>
          <view class="item-badge" :class="item.labelCount > 0 ? 'has-label' : 'no-label'">
            <text class="badge-text">{{ item.labelCount }} 个标记</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHistoryStore } from '@/stores/history';

const store = useHistoryStore();

onMounted(() => store.refresh());

function formatTime(t: string) {
  if (!t) return '';
  return t.substring(5, 16);
}

function goResult(n: string) {
  uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(n)}` });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 24rpx;
  background: $bg-page;
  min-height: 100vh;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 0;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 6rpx solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24rpx;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: $text-tertiary;
}

.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: $text-tertiary;
  margin-bottom: 48rpx;
}

.empty-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 16rpx 64rpx;
}

.empty-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.number {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.time {
  font-size: 24rpx;
  color: $text-tertiary;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.item-badge {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
}

.item-badge.has-label {
  background: #FFF7E8;
}

.item-badge.no-label {
  background: #E8F8EF;
}

.badge-text {
  font-size: 22rpx;
  font-weight: 500;
}

.has-label .badge-text {
  color: $warning;
}

.no-label .badge-text {
  color: $success;
}
</style>
