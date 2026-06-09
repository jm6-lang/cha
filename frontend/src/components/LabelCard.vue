<template>
  <view class="label-card" :class="`risk-${label.riskLevel}`">
    <view class="row">
      <text class="name">{{ label.name }}</text>
      <text class="count">{{ label.count }}人标记</text>
    </view>
    <view class="source">来源：{{ label.source }}</view>
  </view>
</template>

<script setup lang="ts">
defineProps<{ label: { name: string; source: string; count: number; riskLevel: number } }>();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.label-card {
  background: $bg-page;
  border-radius: $radius-md;
  padding: 24rpx;
  border-left: 8rpx solid $text-tertiary;
}

.label-card.risk-1 {
  border-left-color: $success;
}

.label-card.risk-2 {
  border-left-color: $warning;
}

.label-card.risk-3 {
  border-left-color: $danger;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-primary;
}

.count {
  font-size: 24rpx;
  color: $text-tertiary;
}

.source {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
