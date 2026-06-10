<template>
  <view class="page">
    <!-- 用户头部 -->
    <view class="user-header">
      <view class="user-info" @tap="goProfile">
        <view class="avatar">{{ user.nickname.charAt(0) }}</view>
        <view class="user-detail">
          <text class="nickname">{{ user.nickname }}</text>
          <text class="uid">UID: {{ user.userId || '未登录' }}</text>
        </view>
      </view>
      <view class="header-actions">
        <view class="header-action" @tap="goHistory">
          <text class="action-icon">📋</text>
          <text class="action-label">查询记录</text>
        </view>
      </view>
    </view>

    <!-- 资产卡片 -->
    <view class="asset-card">
      <view class="asset-row">
        <view class="asset-item">
          <text class="asset-value">{{ user.isLoggedIn ? '0.00' : '-' }}</text>
          <text class="asset-label">余额(元)</text>
        </view>
        <view class="asset-divider" />
        <view class="asset-item">
          <text class="asset-value">{{ user.isLoggedIn ? '0' : '-' }}</text>
          <text class="asset-label">查询次数</text>
        </view>
        <view class="asset-divider" />
        <view class="asset-item">
          <text class="asset-value">{{ user.isLoggedIn ? '0' : '-' }}</text>
          <text class="asset-label">优惠券</text>
        </view>
      </view>
      <view class="asset-btns">
        <view class="asset-btn recharge" @tap="onRecharge">
          <text class="asset-btn-text">充值</text>
        </view>
      </view>
    </view>

    <!-- 头部操作区 -->
    <view class="header-actions-float">
      <view class="float-action" @tap="goMessage">
        <text class="float-icon">🔔</text>
        <view v-if="messageBadge > 0" class="float-badge">
          <text class="float-badge-text">{{ messageBadge > 99 ? '99+' : messageBadge }}</text>
        </view>
      </view>
      <view class="float-action" @tap="goSettings">
        <text class="float-icon">⚙️</text>
      </view>
    </view>

    <!-- VIP卡片 -->
    <view class="vip-card" @tap="onVip">
      <view class="vip-left">
        <text class="vip-icon">👑</text>
        <view class="vip-info">
          <text class="vip-title">开通会员</text>
          <text class="vip-desc">享受更多查询优惠</text>
        </view>
      </view>
      <text class="vip-arrow">立即开通 ›</text>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" v-for="(m, i) in menuGroup1" :key="'g1-'+i" @tap="onMenu(m)">
          <view class="menu-left">
            <view class="menu-icon" :style="{ background: m.bgColor }">{{ m.icon }}</view>
            <text class="menu-name">{{ m.name }}</text>
          </view>
          <view class="menu-right">
            <text v-if="m.badge" class="menu-badge">{{ m.badge }}</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" v-for="(m, i) in menuGroup2" :key="'g2-'+i" @tap="onMenu(m)">
          <view class="menu-left">
            <view class="menu-icon" :style="{ background: m.bgColor }">{{ m.icon }}</view>
            <text class="menu-name">{{ m.name }}</text>
          </view>
          <view class="menu-right">
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 登录/退出 -->
    <view class="auth-section">
      <button v-if="!user.isLoggedIn" class="btn-primary" @tap="user.mockLogin">登录 / 注册</button>
      <button v-else class="btn-secondary" @tap="user.logout">退出登录</button>
    </view>

    <!-- 版本 -->
    <view class="version">
      <text class="version-text">数查 (ShuCha) v0.2.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const messageBadge = ref(3);

function goMessage() {
  uni.navigateTo({ url: '/pages/message/index' });
}

function goSettings() {
  uni.navigateTo({ url: '/pages/user/settings' });
}

const menuGroup1 = [
  { name: '我的查询', icon: '📋', bgColor: '#E3F2FD', badge: '', action: 'history' },
  { name: '我的订单', icon: '📦', bgColor: '#FFF3E0', badge: '', action: 'order' },
  { name: '我的钱包', icon: '💰', bgColor: '#E8F5E9', badge: '', action: 'wallet' },
  { name: '我的优惠券', icon: '🎫', bgColor: '#FCE4EC', badge: '2', action: 'coupon' },
];

const menuGroup2 = [
  { name: '邀请好友', icon: '🎁', bgColor: '#F3E5F5', badge: '赚佣金', action: 'invite' },
  { name: '代理中心', icon: '🤝', bgColor: '#E0F7FA', badge: '', action: 'agent' },
  { name: '意见反馈', icon: '💬', bgColor: '#E8EAF6', badge: '', action: 'feedback' },
  { name: '设置', icon: '⚙️', bgColor: '#F2F3F5', badge: '', action: 'settings' },
  { name: '关于数查', icon: 'ℹ️', bgColor: '#F1F8E9', badge: '', action: 'about' },
];

function goProfile() {
  // 已在当前页面
}

function goHistory() {
  uni.navigateTo({ url: '/pages/hcc/history' });
}

function onRecharge() {
  uni.navigateTo({ url: '/pages/user/recharge' });
}

function onVip() {
  uni.navigateTo({ url: '/pages/user/vip' });
}

function onMenu(m: any) {
  const routeMap: Record<string, string> = {
    history: '/pages/hcc/history',
    order: '/pages/order/list',
    wallet: '/pages/user/wallet',
    coupon: '/pages/user/coupon',
    invite: '/pages/user/invite',
    agent: '/pages/user/agent',
    feedback: '/pages/user/feedback',
    settings: '/pages/user/settings',
    about: '/pages/user/about',
  };
  const url = routeMap[m.action];
  if (url) {
    uni.navigateTo({ url });
  } else {
    uni.showToast({ title: `${m.name} - 即将上线`, icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 用户头部 */
.user-header {
  background: $primary;
  padding: 60rpx 32rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 40rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 34rpx;
  font-weight: 600;
  color: #fff;
}

.uid {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.header-actions {
  display: flex;
  gap: 24rpx;
}

.header-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.action-icon {
  font-size: 36rpx;
}

.action-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 资产卡片 */
.asset-card {
  background: $bg-card;
  border-radius: $radius-lg;
  margin: -24rpx 24rpx 0;
  padding: 32rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.asset-row {
  display: flex;
  align-items: center;
}

.asset-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-value {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}

.asset-label {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

.asset-divider {
  width: 1rpx;
  height: 64rpx;
  background: $border;
}

.asset-btns {
  display: flex;
  justify-content: center;
  margin-top: 24rpx;
}

.asset-btn {
  padding: 12rpx 48rpx;
  border-radius: 999rpx;
}

.asset-btn.recharge {
  background: $primary;
}

.asset-btn-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
}

/* VIP卡片 */
.vip-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24rpx 24rpx 0;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%);
  border-radius: $radius-lg;
  padding: 24rpx;
}

.vip-left {
  display: flex;
  align-items: center;
}

.vip-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.vip-info {
  display: flex;
  flex-direction: column;
}

.vip-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #795548;
}

.vip-desc {
  font-size: 22rpx;
  color: #A1887F;
  margin-top: 4rpx;
}

.vip-arrow {
  font-size: 26rpx;
  color: #795548;
  font-weight: 500;
}

/* 功能菜单 */
.menu-section {
  margin: 24rpx;
}

.menu-group {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid $border;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-right: 20rpx;
}

.menu-name {
  font-size: 30rpx;
  color: $text-primary;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.menu-badge {
  font-size: 20rpx;
  color: $danger;
  background: #FFECEC;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  font-weight: 500;
}

.menu-arrow {
  color: $text-tertiary;
  font-size: 32rpx;
}

/* 登录/退出 */
.auth-section {
  padding: 0 24rpx;
}

.btn-primary {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
}

.btn-primary:active {
  opacity: 0.85;
}

.btn-secondary {
  background: $bg-card;
  color: $text-secondary;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  border: 1rpx solid $border;
}

/* 版本 */
.version {
  text-align: center;
  padding: 48rpx 0;
}

.version-text {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
