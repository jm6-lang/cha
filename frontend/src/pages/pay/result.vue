<template>
  <view class="page">
    <view class="result-container">
      <!-- 成功状态 -->
      <template v-if="isSuccess">
        <view class="result-icon-wrap success">
          <text class="result-icon">&#10003;</text>
        </view>
        <text class="result-title">支付成功</text>
        <text class="result-price">¥{{ price }}</text>
        <text class="result-name">{{ name }}</text>

        <view class="result-actions">
          <view class="btn-primary" @tap="goOrder">
            <text class="btn-text">查看订单</text>
          </view>
          <view class="btn-secondary" @tap="goHome">
            <text class="btn-text-secondary">返回首页</text>
          </view>
        </view>
      </template>

      <!-- 失败状态 -->
      <template v-else>
        <view class="result-icon-wrap fail">
          <text class="result-icon">&#10005;</text>
        </view>
        <text class="result-title">支付失败</text>
        <text class="result-fail-desc">请检查网络或余额后重试</text>

        <view class="result-actions">
          <view class="btn-primary" @tap="onRetry">
            <text class="btn-text">重新支付</text>
          </view>
          <view class="btn-secondary" @tap="goHome">
            <text class="btn-text-secondary">返回首页</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const status = ref('success');
const name = ref('');
const price = ref('');

const isSuccess = computed(() => status.value === 'success');

onLoad((options: any) => {
  if (options) {
    status.value = options.status || 'success';
    name.value = decodeURIComponent(options.name || '');
    price.value = options.price || '';
  }
});

function goOrder() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' });
}

function onRetry() {
  uni.navigateBack();
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
}

/* ===== 结果图标 ===== */
.result-icon-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.result-icon-wrap.success {
  background: $primary-light;
}

.result-icon-wrap.fail {
  background: #FFECEC;
}

.result-icon {
  font-size: 72rpx;
  font-weight: 700;
}

.success .result-icon {
  color: $primary;
}

.fail .result-icon {
  color: $danger;
}

/* ===== 结果信息 ===== */
.result-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
}

.result-price {
  font-size: 56rpx;
  font-weight: 700;
  color: $danger;
  margin-bottom: 12rpx;
}

.result-name {
  font-size: 28rpx;
  color: $text-secondary;
  margin-bottom: 8rpx;
}

.result-fail-desc {
  font-size: 28rpx;
  color: $text-tertiary;
  margin-bottom: 8rpx;
}

/* ===== 操作按钮 ===== */
.result-actions {
  margin-top: 64rpx;
  width: 100%;
  padding: 0 64rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.btn-primary {
  height: 96rpx;
  background: $primary;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
}

.btn-primary:active {
  opacity: 0.85;
}

.btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.btn-secondary {
  height: 96rpx;
  background: $bg-card;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid $border;
}

.btn-text-secondary {
  font-size: 30rpx;
  color: $text-secondary;
  font-weight: 500;
}
</style>
