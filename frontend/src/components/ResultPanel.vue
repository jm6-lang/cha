<template>
  <view class="result-panel">
    <view class="header">
      <text class="title">号码归属地</text>
    </view>
    <view class="info-grid">
      <view class="info-item">
        <text class="label">省份</text>
        <text class="value">{{ data.province || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">城市</text>
        <text class="value">{{ data.city || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">运营商</text>
        <text class="value">{{ data.carrier || '-' }}</text>
      </view>
    </view>
    <view class="divider" />
    <view class="header">
      <text class="title">公开标记 ({{ data.labels.length }})</text>
    </view>
    <view v-if="data.labels.length === 0" class="empty">暂无公开标记记录</view>
    <view v-else class="labels">
      <LabelCard v-for="(l, i) in data.labels" :key="i" :label="l" />
    </view>
  </view>
</template>

<script setup lang="ts">
import LabelCard from './LabelCard.vue';
import type { NumberLabel } from '@/api/shucha';

defineProps<{ data: NumberLabel }>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.result-panel {
  background: $bg-card;
  border-radius: $radius-md;
  padding: 32rpx;
}

.header {
  margin-bottom: 16rpx;
}

.header .title {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-primary;
}

.info-grid {
  display: flex;
  gap: 24rpx;
}

.info-grid .info-item {
  flex: 1;
}

.info-grid .info-item .label {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  margin-bottom: 4rpx;
}

.info-grid .info-item .value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

.divider {
  height: 1rpx;
  background: $border;
  margin: 24rpx 0;
}

.empty {
  text-align: center;
  color: $text-tertiary;
  padding: 32rpx 0;
  font-size: 26rpx;
}

.labels {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
