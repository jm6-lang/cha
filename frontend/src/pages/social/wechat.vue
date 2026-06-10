<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💬</view>
        <text class="header-title">微信域名检测</text>
        <text class="header-desc">检测域名是否被微信屏蔽拦截</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入要检测的域名（如 tmini.net）" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">检测</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在检测域名...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-top" :class="result.blocked ? 'blocked' : 'normal'">
        <text class="result-status">{{ result.blocked ? '🚫 已被拦截' : '✅ 域名正常' }}</text>
        <text class="result-url">{{ result.url }}</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">检测域名</text>
          <text class="grid-value">{{ result.url }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">检测结果</text>
          <text class="grid-value" :class="result.blocked ? 'danger' : 'success'">{{ result.blocked ? '已被拦截' : '未被拦截' }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">提示信息</text>
          <text class="grid-value">{{ result.msg }}</text>
        </view>
      </view>

      <view v-if="result.blocked" class="appeal-block">
        <text class="appeal-title">📢 域名被拦截怎么办？</text>
        <text class="appeal-tip">1. 登录微信公众平台 → 违规记录查看详情</text>
        <text class="appeal-tip">2. 提交申诉说明域名用途和整改情况</text>
        <text class="appeal-tip">3. 等待 1-3 个工作日审核结果</text>
        <view class="appeal-btn" @tap="goAppeal">前往申诉</view>
      </view>
    </view>

    <view v-if="!loading && !result" class="placeholder-block">
      <text class="ph-icon">💬</text>
      <text class="ph-text">输入域名开始检测</text>
      <view class="example-block">
        <text class="example-title">试试这些示例：</text>
        <view class="example-list">
          <view v-for="d in examples" :key="d" class="example-item" @tap="keyword = d">{{ d }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryWechatUrl, type WechatUrlResult } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const loading = ref(false);
const error = ref('');
const result = ref<WechatUrlResult | null>(null);

const examples = ['tmini.net', 'baidu.com', 'github.com', 'google.com'];

const onSearch = async () => {
  const kw = keyword.value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!kw || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(kw)) {
    uni.showToast({ title: '请输入正确的域名', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    const r = await queryWechatUrl(kw);
    if (!r) error.value = '检测失败，请稍后重试';
    else result.value = r;
  } catch (e) {
    error.value = '检测异常';
  } finally {
    loading.value = false;
  }
};

const goAppeal = () => {
  uni.showModal({
    title: '申诉指引',
    content: '请前往 微信公众平台 → 违规记录 → 申诉 页面提交申诉',
    showCancel: false,
  });
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: 24rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #07C160, #4DD599); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx 0; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { padding: 40rpx 30rpx; display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.result-top.normal { background: linear-gradient(135deg, #07C160, #4DD599); }
.result-top.blocked { background: linear-gradient(135deg, #FF5252, #FF7676); }
.result-status { font-size: 40rpx; color: #fff; font-weight: 700; }
.result-url { font-size: 26rpx; color: rgba(255,255,255,0.9); font-family: monospace; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; gap: 20rpx; }
.grid-row:last-child { border-bottom: none; }
.grid-label { font-size: 26rpx; color: $text-secondary; flex-shrink: 0; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; text-align: right; }
.grid-value.success { color: $primary; font-weight: 700; }
.grid-value.danger { color: #FF5252; font-weight: 700; }
.appeal-block { margin: 20rpx 30rpx 30rpx; padding: 24rpx; background: $bg-page; border-radius: 16rpx; }
.appeal-title { display: block; font-size: 28rpx; font-weight: 700; color: $text-primary; margin-bottom: 16rpx; }
.appeal-tip { display: block; font-size: 24rpx; color: $text-secondary; line-height: 1.8; }
.appeal-btn { margin-top: 20rpx; padding: 20rpx; background: linear-gradient(135deg, #07C160, #4DD599); color: #fff; text-align: center; border-radius: 12rpx; font-size: 28rpx; font-weight: 600; }
.placeholder-block { padding: 80rpx 30rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
.example-block { margin-top: 60rpx; width: 100%; }
.example-title { display: block; font-size: 24rpx; color: $text-tertiary; margin-bottom: 20rpx; text-align: center; }
.example-list { display: flex; flex-wrap: wrap; gap: 16rpx; justify-content: center; }
.example-item { font-size: 24rpx; color: $info; background: rgba(26,108,255,0.1); padding: 12rpx 24rpx; border-radius: 20rpx; }
</style>
