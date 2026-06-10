<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⭐</view>
        <text class="header-title">积分明细</text>
        <text class="header-desc">当前积分 {{ myPoints }} · 成长值 {{ growthValue }}</text>
      </view>
    </view>

    <view class="stat-row">
      <view class="stat-card">
        <text class="stat-num">{{ totalEarn }}</text>
        <text class="stat-label">累计获得</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ totalSpend }}</text>
        <text class="stat-label">累计消耗</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">{{ monthEarn }}</text>
        <text class="stat-label">本月获得</text>
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
          <text class="ri-time">{{ r.time }}</text>
        </view>
        <view class="record-amount" :class="{ positive: r.amount > 0 }">
          <text class="amount-text">{{ r.amount > 0 ? '+' : '' }}{{ r.amount }}</text>
        </view>
      </view>
      <view v-if="filteredList.length === 0" class="empty">
        <text class="empty-text">暂无相关记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const myPoints = ref(2580);
const growthValue = ref(680);

const activeTab = ref('all');
const tabs = [
  { key: 'all', name: '全部' },
  { key: 'earn', name: '收入' },
  { key: 'spend', name: '支出' },
];

const list = ref([
  { type: 'earn', name: '每日签到', desc: '连续签到奖励', time: '2024-11-25 09:12', amount: 20, icon: '📅', color: '#E8F5E9' },
  { type: 'spend', name: '兑换 5 元抵扣券', desc: '积分商城兑换', time: '2024-11-23 14:30', amount: -500, icon: '🎟️', color: '#FFF3E0' },
  { type: 'earn', name: '首次充值奖励', desc: '充值 100 元', time: '2024-11-20 18:42', amount: 200, icon: '💰', color: '#E3F2FD' },
  { type: 'earn', name: '邀请好友', desc: '好友已注册', time: '2024-11-18 21:15', amount: 200, icon: '👥', color: '#FCE4EC' },
  { type: 'spend', name: '查询消耗', desc: '个人征信报告', time: '2024-11-15 11:08', amount: -100, icon: '🔍', color: '#F3E5F5' },
  { type: 'earn', name: '抽奖活动', desc: '抽奖奖励', time: '2024-11-12 16:20', amount: 50, icon: '🎰', color: '#FFF8E1' },
  { type: 'earn', name: '完善资料', desc: '绑定手机号', time: '2024-11-10 10:00', amount: 30, icon: '✅', color: '#E8F5E9' },
]);

const totalEarn = computed(() => list.value.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0));
const totalSpend = computed(() => list.value.filter(r => r.amount < 0).reduce((s, r) => s + r.amount, 0));
const monthEarn = computed(() => totalEarn.value);

const filteredList = computed(() => {
  if (activeTab.value === 'all') return list.value;
  return list.value.filter(r => r.type === activeTab.value);
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #FFC107 0%, #FFA000 100%);
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
  color: rgba(255, 255, 255, 0.9);
}

/* 统计 */
.stat-row {
  display: flex;
  gap: 12rpx;
  margin: -16rpx 24rpx 0;
  position: relative;
  z-index: 10;
}

.stat-card {
  flex: 1;
  background: $bg-card;
  border-radius: $radius-md;
  padding: 20rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.stat-num {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $warning;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 20rpx;
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

.ri-time {
  font-size: 22rpx;
  color: $text-tertiary;
}

.record-amount {
  flex-shrink: 0;
  margin-left: 12rpx;
}

.amount-text {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-tertiary;
}

.record-amount.positive .amount-text {
  color: $primary;
}

.empty {
  padding: 60rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 26rpx;
  color: $text-tertiary;
}
</style>
