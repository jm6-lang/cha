<template>
  <view class="page">
    <!-- 设置列表 -->
    <view class="menu-group">
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">🔔</text>
          <text class="menu-name">消息通知</text>
        </view>
        <switch :checked="notifyOn" @change="notifyOn = !notifyOn" color="#07C160" />
      </view>

      <view class="menu-item" @tap="goPage('privacy')">
        <view class="menu-left">
          <text class="menu-icon">🔒</text>
          <text class="menu-name">隐私设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @tap="goPage('security')">
        <view class="menu-left">
          <text class="menu-icon">🛡️</text>
          <text class="menu-name">账号安全</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @tap="clearCache">
        <view class="menu-left">
          <text class="menu-icon">🧹</text>
          <text class="menu-name">清除缓存</text>
        </view>
        <text class="menu-arrow">{{ cacheSize }}</text>
      </view>

      <view class="menu-item" @tap="goAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-name">关于数查</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="btn-logout" @tap="onLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const notifyOn = ref(true);
const cacheSize = ref('12.5MB');

function goPage(page: string) {
  if (page === 'privacy') {
    uni.navigateTo({ url: '/pages/user/privacy' });
  } else if (page === 'security') {
    uni.navigateTo({ url: '/pages/user/privacy' });
  } else {
    uni.showToast({ title: `${page} - 即将上线`, icon: 'none' });
  }
}

function goAbout() {
  uni.navigateTo({ url: '/pages/user/about' });
}

function clearCache() {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        cacheSize.value = '0MB';
        uni.showToast({ title: '缓存已清除', icon: 'success' });
      }
    },
  });
}

function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录', icon: 'none' });
      }
    },
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 菜单组 */
.menu-group {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 0 24rpx;
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
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-name {
  font-size: 30rpx;
  color: $text-primary;
}

.menu-arrow {
  font-size: 26rpx;
  color: $text-tertiary;
}

/* 退出登录 */
.logout-section {
  padding: 48rpx 24rpx;
}

.btn-logout {
  background: $bg-card;
  color: $danger;
  border-radius: $radius-lg;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.btn-logout:active {
  opacity: 0.85;
}

</style>
