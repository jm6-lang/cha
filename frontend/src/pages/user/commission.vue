<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💰</view>
        <text class="header-title">佣金明细</text>
        <text class="header-desc">代理推广 享高额返佣</text>
      </view>
    </view>

    <view class="balance-card">
      <view class="balance-item">
        <text class="balance-num">¥326.50</text>
        <text class="balance-label">可提现佣金</text>
      </view>
      <view class="balance-divider" />
      <view class="balance-item">
        <text class="balance-num">¥1,250.00</text>
        <text class="balance-label">累计佣金</text>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-btn primary" @tap="onWithdraw">
        <text class="action-text">立即提现</text>
      </view>
      <view class="action-btn" @tap="onDetail">
        <text class="action-text">结算规则</text>
      </view>
    </view>

    <view class="month-stat">
      <text class="section-title">本月统计</text>
      <view class="month-grid">
        <view class="month-item">
          <text class="mi-num">¥285</text>
          <text class="mi-label">本月佣金</text>
        </view>
        <view class="month-item">
          <text class="mi-num">23</text>
          <text class="mi-label">成交订单</text>
        </view>
        <view class="month-item">
          <text class="mi-num">18%</text>
          <text class="mi-label">完成率</text>
        </view>
      </view>
    </view>

    <view class="tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeTab === t.key }"
        @tap="activeTab = t.key"
      >
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view class="record-list">
      <view
        v-for="(r, i) in filteredList"
        :key="i"
        class="record-item"
      >
        <view class="record-icon" :style="{ background: r.color }">
          <text class="ri-text">{{ r.icon }}</text>
        </view>
        <view class="record-info">
          <text class="ri-name">{{ r.name }}</text>
          <text class="ri-meta">{{ r.user }} · 订单号 {{ r.orderNo }}</text>
          <text class="ri-time">{{ r.time }}</text>
        </view>
        <view class="record-amount">
          <text class="amount-text">+¥{{ r.amount }}</text>
          <text :class="['status-tag', r.status === '已结算' ? 'active' : 'pending']">
            {{ r.status }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const activeTab = ref('all');

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'settled', name: '已结算' },
  { key: 'pending', name: '待结算' },
];

const list = ref([
  { name: '个人征信查询', user: '张*三', orderNo: '20241125001', time: '2024-11-25 14:30', amount: '0.9', status: '已结算', icon: '💳', color: '#E8F5E9' },
  { name: '企业尽调报告', user: '李*四', orderNo: '20241124002', time: '2024-11-24 09:18', amount: '1.8', status: '已结算', icon: '🏢', color: '#E3F2FD' },
  { name: '深度背调报告', user: '王*五', orderNo: '20241123003', time: '2024-11-23 21:42', amount: '1.8', status: '待结算', icon: '🔍', color: '#F3E5F5' },
  { name: '失信被执行人', user: '赵*六', orderNo: '20241122004', time: '2024-11-22 16:05', amount: '0.9', status: '已结算', icon: '⚖️', color: '#FFF3E0' },
  { name: '车辆违章查询', user: '钱*七', orderNo: '20241121005', time: '2024-11-21 11:20', amount: '0.9', status: '待结算', icon: '🚗', color: '#E0F7FA' },
]);

const filteredList = computed(() => {
  if (activeTab.value === 'all') return list.value;
  if (activeTab.value === 'settled') return list.value.filter(r => r.status === '已结算');
  return list.value.filter(r => r.status === '待结算');
});

function onWithdraw() {
  uni.showModal({
    title: '提现申请',
    content: '可提现佣金：¥326.50\n提现到微信零钱，预计 1-3 个工作日到账。',
    confirmText: '确认提现',
    success: (res) => {
      if (res.confirm) uni.showToast({ title: '提现申请已提交', icon: 'success' });
    },
  });
}

function onDetail() {
  uni.showModal({
    title: '结算规则',
    content: '1. 用户完成支付后 7 天确认收货\n2. 7 天后佣金自动结算到账户\n3. 单次提现最低 10 元起\n4. 提现手续费 1%',
    showCancel: false,
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #FF9800 0%, #E65100 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 32rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 余额 */
.balance-card {
  display: flex;
  align-items: center;
  margin: -16rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.balance-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-num {
  font-size: 40rpx;
  font-weight: 800;
  color: $warning;
  margin-bottom: 4rpx;
  font-family: monospace;
  letter-spacing: 1rpx;
}

.balance-label {
  font-size: 22rpx;
  color: $text-tertiary;
}

.balance-divider {
  width: 1rpx;
  height: 64rpx;
  background: $border;
}

/* 操作 */
.quick-actions {
  display: flex;
  gap: 12rpx;
  margin: 20rpx 24rpx 0;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  background: $bg-card;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.action-btn.primary {
  background: $warning;
}

.action-text {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 600;
}

.action-btn.primary .action-text {
  color: #fff;
}

/* 月统计 */
.month-stat {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.month-grid {
  display: flex;
}

.month-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mi-num {
  font-size: 32rpx;
  font-weight: 700;
  color: $warning;
  margin-bottom: 4rpx;
}

.mi-label {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* Tab */
.tabs {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-md;
  padding: 8rpx;
  gap: 4rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: $radius-sm;
}

.tab.active {
  background: $warning;
}

.tab-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.tab.active .tab-text {
  color: #fff;
  font-weight: 600;
}

/* 列表 */
.record-list {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 16rpx 28rpx;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.record-item:last-child {
  border-bottom: none;
}

.record-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.ri-text {
  font-size: 36rpx;
}

.record-info {
  flex: 1;
  min-width: 0;
}

.ri-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.ri-meta {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 2rpx;
}

.ri-time {
  font-size: 20rpx;
  color: $text-tertiary;
}

.record-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  flex-shrink: 0;
  margin-left: 12rpx;
}

.amount-text {
  font-size: 30rpx;
  font-weight: 700;
  color: $warning;
}

.status-tag {
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
}

.status-tag.active {
  color: $primary;
  background: rgba(7, 193, 96, 0.1);
}

.status-tag.pending {
  color: $warning;
  background: rgba(255, 152, 0, 0.1);
}
</style>
