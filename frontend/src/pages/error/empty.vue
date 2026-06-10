<template>
  <view class="page">
    <view class="empty-wrap">
      <text class="empty-icon">{{ icon }}</text>
      <text v-if="title" class="empty-title">{{ title }}</text>
      <text v-if="desc" class="empty-desc">{{ desc }}</text>
      <view v-if="actionText" class="action-btn" @tap="onAction">
        <text class="action-text">{{ actionText }}</text>
      </view>
      <view v-if="backText" class="back-link" @tap="onBack">
        <text class="back-text">{{ backText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const type = ref('notfound');
const icon = ref('🔍');
const title = ref('');
const desc = ref('');
const actionText = ref('');
const backText = ref('返回上一页');

onLoad((q: any) => {
  type.value = q?.type || 'notfound';
  if (type.value === 'notfound') {
    icon.value = '🔍';
    title.value = '页面不存在';
    desc.value = '您访问的页面已走失';
    actionText.value = '返回首页';
  } else if (type.value === 'network') {
    icon.value = '📡';
    title.value = '网络异常';
    desc.value = '请检查您的网络连接';
    actionText.value = '重新加载';
  } else if (type.value === 'maintenance') {
    icon.value = '🔧';
    title.value = '系统维护中';
    desc.value = '服务升级中，请稍后访问';
    backText.value = '返回首页';
  } else if (type.value === 'forbidden') {
    icon.value = '🚫';
    title.value = '访问受限';
    desc.value = '您没有权限访问此页面';
    actionText.value = '返回首页';
  }
});

function onAction() {
  if (type.value === 'network') {
    uni.showToast({ title: '请检查网络后重试', icon: 'none' });
  } else {
    uni.reLaunch({ url: '/pages/index/index' });
  }
}

function onBack() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.reLaunch({ url: '/pages/index/index' });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 48rpx;
  text-align: center;
}

.empty-icon {
  font-size: 160rpx;
  margin-bottom: 32rpx;
  opacity: 0.7;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: $text-tertiary;
  line-height: 1.6;
  margin-bottom: 48rpx;
}

.action-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 24rpx 64rpx;
  box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.25);
}

.action-btn:active {
  opacity: 0.85;
}

.action-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: 500;
}

.back-link {
  margin-top: 24rpx;
  padding: 16rpx 32rpx;
}

.back-text {
  font-size: 26rpx;
  color: $text-tertiary;
}
</style>
