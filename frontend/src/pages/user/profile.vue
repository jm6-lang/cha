<template>
  <view class="container">
    <view class="profile-header card">
      <view class="avatar">{{ user.nickname.charAt(0) }}</view>
      <view class="info">
        <text class="name">{{ user.nickname }}</text>
        <text class="uid">UID: {{ user.userId || '-' }}</text>
      </view>
    </view>

    <view class="menu card">
      <view class="menu-item" v-for="(m, i) in menus" :key="i" @tap="onMenu(m)">
        <text class="menu-icon">{{ m.icon }}</text>
        <text class="menu-name">{{ m.name }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="actions">
      <button v-if="!user.isLoggedIn" class="btn-primary" @tap="user.mockLogin">登录（演示）</button>
      <button v-else class="btn-secondary" @tap="user.logout">退出登录</button>
    </view>

    <view class="brand">数查 (ShuCha) v0.1.0</view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const menus = [
  { name: '我的查询', icon: '📋' },
  { name: '会员中心', icon: '💎' },
  { name: '钱包', icon: '💰' },
  { name: '设置', icon: '⚙️' },
  { name: '关于数查', icon: 'ℹ️' }
];

function onMenu(m: any) {
  if (m.name === '我的查询') {
    uni.navigateTo({ url: '/pages/hcc/history' });
  } else {
    uni.showToast({ title: `${m.name} - 待开发`, icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.profile-header .avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: $primary;
  color: #fff;
  font-size: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.profile-header .info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.profile-header .name {
  font-size: 36rpx;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 8rpx;
}

.profile-header .uid {
  font-size: 24rpx;
  color: $text-tertiary;
}

.menu {
  margin-bottom: 32rpx;
}

.menu .menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid $border;
}

.menu .menu-item:last-child {
  border-bottom: none;
}

.menu .menu-icon {
  font-size: 36rpx;
  width: 60rpx;
}

.menu .menu-name {
  flex: 1;
  font-size: 30rpx;
  color: $text-primary;
}

.menu .menu-arrow {
  color: $text-tertiary;
  font-size: 32rpx;
}

.btn-secondary {
  background: $bg-page;
  color: $text-primary;
  height: 88rpx;
  border-radius: 999rpx;
  border: none;
  font-size: 30rpx;
}

.brand {
  text-align: center;
  color: $text-tertiary;
  font-size: 24rpx;
  margin-top: 48rpx;
}
</style>
