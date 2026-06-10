<template>
  <view class="page">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-icon">🔍</view>
      <text class="brand-name">数查</text>
      <text class="version">v0.2.0</text>
    </view>

    <!-- 信息列表 -->
    <view class="menu-group">
      <view class="menu-item" @tap="goPage('用户协议')">
        <text class="menu-name">用户协议</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('隐私政策')">
        <text class="menu-name">隐私政策</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPage('官方网站')">
        <text class="menu-name">官方网站</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="callService">
        <text class="menu-name">客服电话</text>
        <text class="menu-value">400-888-9999</text>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <text class="copyright-text">© 2024 数查科技 All Rights Reserved</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function goPage(name: string) {
  uni.showToast({ title: `${name} - 即将上线`, icon: 'none' });
}

function callService() {
  uni.makePhoneCall({ phoneNumber: '400-888-9999' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 48rpx;
}

.logo-icon {
  width: 128rpx;
  height: 128rpx;
  border-radius: $radius-xl;
  background: $primary-light;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.brand-name {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 8rpx;
}

.version {
  font-size: 26rpx;
  color: $text-tertiary;
}

/* 信息列表 */
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

.menu-name {
  font-size: 30rpx;
  color: $text-primary;
}

.menu-arrow {
  font-size: 32rpx;
  color: $text-tertiary;
}

.menu-value {
  font-size: 28rpx;
  color: $primary;
}

/* 版权信息 */
.copyright {
  text-align: center;
  padding: 80rpx 0 48rpx;
}

.copyright-text {
  font-size: 22rpx;
  color: $text-tertiary;
}
</style>
