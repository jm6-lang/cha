<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌐</view>
        <text class="header-title">IP 归属地查询</text>
        <text class="header-desc">输入 IP 地址查询地理位置与运营商</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-title">查询 IP 地址</view>
      <view class="input-wrap">
        <input
          v-model="ip"
          class="form-input"
          placeholder="请输入 IP 地址，如 8.8.8.8"
          placeholder-class="input-placeholder"
          @confirm="onQuery"
        />
        <view v-if="ip" class="input-clear" @tap="ip = ''">
          <text class="clear-icon">✕</text>
        </view>
      </view>
      <view class="form-tips">提示：IP 地址为 4 段 0-255 数字组合</view>
      <view class="quick-ip">
        <text class="quick-tip">试试：</text>
        <text class="quick-item" @tap="ip = '8.8.8.8'">8.8.8.8</text>
        <text class="quick-item" @tap="ip = '114.114.114.114'">114.114.114.114</text>
        <text class="quick-item" @tap="ip = '1.1.1.1'">1.1.1.1</text>
      </view>
      <view class="query-btn" :class="{ loading: querying }" @tap="onQuery">
        <text class="query-btn-text">{{ querying ? '查询中...' : '立即查询' }}</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header">
        <text class="result-title">查询结果</text>
        <text class="result-ip">{{ result.ip }}</text>
      </view>
      <view class="result-list">
        <view class="result-row">
          <text class="row-label">国家/地区</text>
          <text class="row-value">{{ result.country }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">省份/州</text>
          <text class="row-value">{{ result.region }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">城市</text>
          <text class="row-value">{{ result.city }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">运营商/组织</text>
          <text class="row-value">{{ result.isp }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">经纬度</text>
          <text class="row-value">{{ result.lat.toFixed(4) }}, {{ result.lon.toFixed(4) }}</text>
        </view>
      </view>
      <view class="result-disclaimer">
        <text class="disclaimer-text">免责声明：本查询结果仅供参考，IP 数据库可能存在误差。地理位置由 IP 地址反查得到，可能与实际位置不符。</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryIpLocation } from '@/api/free-apis';

const ip = ref('');
const querying = ref(false);
const result = ref<any>(null);
const statusBarHeight = ref(44);

const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

function validateIp(s: string): boolean {
  const m = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  for (let i = 1; i <= 4; i++) {
    const n = parseInt(m[i], 10);
    if (n < 0 || n > 255) return false;
  }
  return true;
}

async function onQuery() {
  const v = ip.value.trim();
  if (!v) {
    uni.showToast({ title: '请输入 IP 地址', icon: 'none' });
    return;
  }
  if (!validateIp(v)) {
    uni.showToast({ title: 'IP 格式不正确', icon: 'none' });
    return;
  }
  querying.value = true;
  try {
    const r = await queryIpLocation(v);
    if (r) {
      result.value = r;
    } else {
      uni.showToast({ title: '查询失败，请稍后重试', icon: 'none' });
    }
  } finally {
    querying.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 头部 */
.header {
  background: linear-gradient(180deg, #1A6CFF 0%, #0D47A1 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 56rpx;
}

.header-icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 表单卡片 */
.form-card {
  margin: -32rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.form-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 24rpx;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.input-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 24rpx;
  color: #fff;
}

.input-placeholder {
  color: $text-tertiary;
  font-size: 28rpx;
}

.form-tips {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
}

.quick-ip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.quick-tip {
  font-size: 24rpx;
  color: $text-tertiary;
}

.quick-item {
  font-size: 24rpx;
  color: $info;
  background: rgba(26, 108, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}

.query-btn {
  margin-top: 32rpx;
  height: 96rpx;
  background: $info;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 108, 255, 0.3);
}

.query-btn:active {
  opacity: 0.85;
}

.query-btn.loading {
  opacity: 0.7;
}

.query-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 结果卡片 */
.result-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid $border;
}

.result-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
}

.result-ip {
  font-size: 26rpx;
  color: $info;
  font-family: monospace;
}

.result-list {
  margin-bottom: 16rpx;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.result-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 28rpx;
  color: $text-tertiary;
}

.row-value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
}

.result-disclaimer {
  margin-top: 20rpx;
  padding: 16rpx 20rpx;
  background: #FFF7E8;
  border-radius: $radius-md;
}

.disclaimer-text {
  font-size: 22rpx;
  color: $warning;
  line-height: 1.6;
}
</style>
