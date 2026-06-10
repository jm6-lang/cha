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

      <view class="menu-item" @tap="showApiModal = true">
        <view class="menu-left">
          <text class="menu-icon">🔑</text>
          <text class="menu-name">API 密钥配置</text>
        </view>
        <text class="menu-arrow" :class="{ configured: hasApiKey }">{{ hasApiKey ? '已配置' : '未配置' }} ›</text>
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

    <!-- API 密钥配置弹窗 -->
    <view v-if="showApiModal" class="api-mask" @tap="showApiModal = false">
      <view class="api-modal" @tap.stop="">
        <view class="api-title">🔑 API 密钥配置</view>
        <view class="api-sub">用于天行数据 (tianapi.com) 免费接口；未配置时所有功能用示例数据兜底</view>
        <view class="api-list">
          <text class="api-item">① 注册：tianapi.com 注册账号</text>
          <text class="api-item">② 控制台 → 数据管理 → 我的密钥</text>
          <text class="api-item">③ 普通会员可申请 10 个免费接口</text>
          <text class="api-item">④ 申请后粘贴 Key 至此即可使用</text>
        </view>
        <input v-model="apiKeyInput" class="api-input" placeholder="请输入天行 API Key" maxlength="40" />
        <view class="api-actions">
          <view class="api-btn-cancel" @tap="showApiModal = false">取消</view>
          <view class="api-btn-save" @tap="onSaveApiKey">保存</view>
        </view>
        <view v-if="hasApiKey" class="api-clear" @tap="onClearApiKey">清除已保存的 Key</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTianapiKey, setTianapiKey } from '@/api/free-apis';

const notifyOn = ref(true);
const cacheSize = ref('12.5MB');
const showApiModal = ref(false);
const apiKeyInput = ref('');
const hasApiKey = ref(false);

onMounted(() => {
  try {
    const stored = uni.getStorageSync('tianapi_key');
    if (typeof stored === 'string' && stored) {
      hasApiKey.value = true;
      apiKeyInput.value = stored;
    }
  } catch (e) { /* noop */ }
});

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

function onSaveApiKey() {
  const k = apiKeyInput.value.trim();
  if (!k) {
    uni.showToast({ title: '请输入 Key', icon: 'none' });
    return;
  }
  setTianapiKey(k);
  hasApiKey.value = true;
  showApiModal.value = false;
  uni.showToast({ title: '保存成功，重启 APP 生效', icon: 'success' });
}

function onClearApiKey() {
  try { uni.removeStorageSync('tianapi_key'); } catch (e) { /* noop */ }
  hasApiKey.value = false;
  apiKeyInput.value = '';
  uni.showToast({ title: '已清除', icon: 'none' });
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

/* API 密钥弹窗 */
.api-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
}

.api-modal {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  display: flex;
  flex-direction: column;
}

.api-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  margin-bottom: 12rpx;
}

.api-sub {
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 24rpx;
}

.api-list {
  background: $bg-page;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 24rpx;
}

.api-item {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.8;
}

.api-input {
  border: 2rpx solid $border;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 80rpx;
  font-size: 26rpx;
  background: $bg-page;
}

.api-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.api-btn-cancel,
.api-btn-save {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
}

.api-btn-cancel {
  background: $bg-page;
  color: $text-secondary;
}

.api-btn-save {
  background: $primary;
  color: #fff;
}

.api-clear {
  text-align: center;
  font-size: 24rpx;
  color: $danger;
  margin-top: 24rpx;
}

.menu-arrow.configured {
  color: $primary;
  font-weight: 600;
}
</style>
