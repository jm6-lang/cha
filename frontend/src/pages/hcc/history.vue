<template>
  <view class="container">
    <view v-if="store.loading" class="loading">加载中...</view>
    <view v-else-if="store.list.length === 0" class="empty">暂无查询记录</view>
    <view v-else class="list">
      <view v-for="item in store.list" :key="item.id" class="item card" @tap="goResult(item.number)">
        <view class="row">
          <text class="number">{{ item.number }}</text>
          <text class="time">{{ formatTime(item.createTime) }}</text>
        </view>
        <view class="meta">
          <text>{{ item.province }} {{ item.city }} · {{ item.carrier }}</text>
          <text class="label-count">{{ item.labelCount }} 个标记</text>
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
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading, .empty {
  text-align: center;
  padding: 96rpx 0;
  color: $text-tertiary;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.item .number {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-primary;
}

.item .time {
  font-size: 24rpx;
  color: $text-tertiary;
}

.item .meta {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: $text-secondary;
}

.item .label-count {
  color: $warning;
}
</style>
