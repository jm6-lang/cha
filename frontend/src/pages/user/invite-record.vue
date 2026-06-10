<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👥</view>
        <text class="header-title">邀请记录</text>
        <text class="header-desc">邀请好友 双方共赢</text>
      </view>
    </view>

    <view class="stats-row">
      <view class="stat-card">
        <text class="stat-num">23</text>
        <text class="stat-label">已邀请</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">18</text>
        <text class="stat-label">已注册</text>
      </view>
      <view class="stat-card">
        <text class="stat-num">¥86</text>
        <text class="stat-label">已赚佣金</text>
      </view>
    </view>

    <view class="action-card">
      <view class="action-info">
        <text class="action-title">我的邀请码</text>
        <text class="action-code">{{ inviteCode }}</text>
      </view>
      <view class="action-btns">
        <view class="btn-copy" @tap="onCopy">
          <text class="btn-text">复制</text>
        </view>
        <view class="btn-share" @tap="onShare">
          <text class="btn-text">分享</text>
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
        <view class="record-avatar">
          <text class="avatar-text">{{ r.name.substring(0, 1) }}</text>
        </view>
        <view class="record-info">
          <text class="ri-name">{{ r.name }}</text>
          <text class="ri-time">{{ r.time }}</text>
        </view>
        <view class="record-amount">
          <text class="amount-text">+¥{{ r.amount }}</text>
          <text :class="['status-tag', r.status === '已注册' ? 'active' : 'pending']">
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

const inviteCode = ref('SC2024ABCD');
const activeTab = ref('all');

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'registered', name: '已注册' },
  { key: 'pending', name: '待注册' },
];

const list = ref([
  { name: '张*三', time: '2024-11-25 14:30', amount: 3, status: '已注册' },
  { name: '李*四', time: '2024-11-23 09:18', amount: 3, status: '已注册' },
  { name: '王*五', time: '2024-11-22 21:42', amount: 3, status: '已注册' },
  { name: '赵*六', time: '2024-11-20 16:05', amount: 3, status: '已注册' },
  { name: '钱*七', time: '2024-11-19 11:20', amount: 3, status: '待注册' },
  { name: '孙*八', time: '2024-11-18 18:50', amount: 3, status: '待注册' },
]);

const filteredList = computed(() => {
  if (activeTab.value === 'all') return list.value;
  if (activeTab.value === 'registered') return list.value.filter(r => r.status === '已注册');
  return list.value.filter(r => r.status === '待注册');
});

function onCopy() {
  uni.setClipboardData({ data: inviteCode.value, success: () => uni.showToast({ title: '已复制', icon: 'success' }) });
}

function onShare() {
  uni.navigateTo({ url: '/pages/share/poster' });
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
  background: linear-gradient(180deg, #FF9800 0%, #F57C00 100%);
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

/* 统计 */
.stats-row {
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
  font-size: 36rpx;
  font-weight: 700;
  color: $warning;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 邀请码 */
.action-card {
  display: flex;
  align-items: center;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.action-info {
  flex: 1;
}

.action-title {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  margin-bottom: 4rpx;
}

.action-code {
  font-size: 36rpx;
  font-weight: 700;
  color: $warning;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.action-btns {
  display: flex;
  gap: 12rpx;
}

.btn-copy,
.btn-share {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
}

.btn-copy {
  background: $bg-grey;
}

.btn-share {
  background: $warning;
}

.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}

.btn-copy .btn-text {
  color: $text-primary;
}

.btn-share .btn-text {
  color: #fff;
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
  padding: 16rpx 28r;
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

.record-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB74D, #FF9800);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  flex-shrink: 0;
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
  color: $text-tertiary;
  background: $bg-grey;
}
</style>
