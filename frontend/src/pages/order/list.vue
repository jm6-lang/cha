<template>
  <view class="page">
    <!-- Tab切换 -->
    <view class="tab-bar">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-item"
        :class="{ active: currentTab === i }"
        @tap="currentTab = i"
      >
        <text class="tab-text" :class="{ 'tab-text-active': currentTab === i }">{{ tab }}</text>
        <view v-if="currentTab === i" class="tab-line" />
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view
        v-for="(order, i) in filteredOrders"
        :key="i"
        class="order-card"
      >
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :class="'status-' + order.statusType">{{ order.status }}</text>
        </view>
        <view class="order-body">
          <view class="order-info">
            <text class="order-service">{{ order.service }}</text>
            <text class="order-time">{{ order.time }}</text>
          </view>
          <text class="order-amount">¥{{ order.amount }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无相关订单</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const tabs = ['全部', '待支付', '已完成', '已退款'];
const currentTab = ref(0);

const orders = [
  {
    orderNo: 'SC20240601001',
    service: '企业工商查询',
    amount: '9.90',
    status: '已完成',
    statusType: 'done',
    time: '2024-06-01 14:30',
  },
  {
    orderNo: 'SC20240602002',
    service: '个人信用报告',
    amount: '19.90',
    status: '待支付',
    statusType: 'pending',
    time: '2024-06-02 09:15',
  },
  {
    orderNo: 'SC20240530003',
    service: '车辆信息查询',
    amount: '5.00',
    status: '已退款',
    statusType: 'refund',
    time: '2024-05-30 16:45',
  },
];

const filteredOrders = computed(() => {
  if (currentTab.value === 0) return orders;
  const statusMap: Record<number, string> = { 1: '待支付', 2: '已完成', 3: '已退款' };
  return orders.filter((o) => o.status === statusMap[currentTab.value]);
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* Tab */
.tab-bar {
  display: flex;
  background: $bg-card;
  padding: 0 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: $text-secondary;
}

.tab-text-active {
  color: $primary;
  font-weight: 600;
}

.tab-line {
  width: 40rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: $primary;
  margin-top: 8rpx;
}

/* 订单列表 */
.order-list {
  padding: 24rpx;
}

.order-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid $border;
}

.order-no {
  font-size: 24rpx;
  color: $text-tertiary;
}

.order-status {
  font-size: 24rpx;
  font-weight: 500;
}

.status-pending {
  color: $warning;
}

.status-done {
  color: $success;
}

.status-refund {
  color: $text-tertiary;
}

.order-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20rpx;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-service {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.order-time {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 8rpx;
}

.order-amount {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $text-tertiary;
}
</style>
