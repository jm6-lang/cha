<template>
  <view class="page">
    <!-- 绿色渐变头部 -->
    <view class="header-section">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="brand-logo">数</view>
        <text class="brand-slogan">查号码 用数查</text>
      </view>
      <view class="header-bottom" />
    </view>

    <!-- 登录表单 -->
    <view class="form-card">
      <text class="form-title">手机号登录</text>

      <!-- 手机号 -->
      <view class="form-item">
        <view class="input-wrap">
          <text class="input-prefix">+86</text>
          <view class="input-divider" />
          <input
            v-model="phone"
            class="form-input"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 验证码 -->
      <view class="form-item">
        <view class="input-wrap code-wrap">
          <input
            v-model="code"
            class="form-input code-input"
            type="number"
            maxlength="6"
            placeholder="请输入验证码"
            placeholder-class="input-placeholder"
          />
          <view
            class="code-btn"
            :class="{ disabled: counting }"
            @tap="onGetCode"
          >
            <text class="code-btn-text">{{ counting ? `${countDown}s` : '获取验证码' }}</text>
          </view>
        </view>
      </view>

      <!-- 登录按钮 -->
      <view class="login-btn" @tap="onLogin">
        <text class="login-btn-text">登录/注册</text>
      </view>

      <!-- 协议 -->
      <view class="agreement">
        <view class="agreement-check" @tap="agreed = !agreed">
          <view class="checkbox" :class="{ checked: agreed }">
            <text v-if="agreed" class="check-icon">&#10003;</text>
          </view>
        </view>
        <text class="agreement-text">
          已阅读并同意
          <text class="agreement-link" @tap.stop="onAgreement('user')">《用户协议》</text>
          和
          <text class="agreement-link" @tap.stop="onAgreement('privacy')">《隐私政策》</text>
        </text>
      </view>
    </view>

    <!-- 第三方登录 -->
    <view class="third-party">
      <view class="third-divider">
        <view class="divider-line" />
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line" />
      </view>
      <view class="third-icons">
        <view class="third-item" @tap="onThirdLogin('wechat')">
          <view class="third-icon wechat-icon">
            <text class="icon-text">&#128172;</text>
          </view>
          <text class="third-label">微信</text>
        </view>
        <view class="third-item" @tap="onThirdLogin('qq')">
          <view class="third-icon qq-icon">
            <text class="icon-text">&#128100;</text>
          </view>
          <text class="third-label">QQ</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const phone = ref('');
const code = ref('');
const agreed = ref(false);
const counting = ref(false);
const countDown = ref(60);
const statusBarHeight = ref(44);

// 获取状态栏高度
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

let timer: ReturnType<typeof setInterval> | null = null;

function onGetCode() {
  if (counting.value) return;
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  // 模拟发送验证码
  uni.showToast({ title: '验证码已发送', icon: 'none' });
  counting.value = true;
  countDown.value = 60;
  timer = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      counting.value = false;
      if (timer) clearInterval(timer);
    }
  }, 1000);
}

function onLogin() {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议和隐私政策', icon: 'none' });
    return;
  }
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  // 演示模式：直接mock登录成功
  user.mockLogin();
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' });
  }, 500);
}

function onThirdLogin(type: string) {
  uni.showToast({ title: `${type === 'wechat' ? '微信' : 'QQ'}登录 - 即将上线`, icon: 'none' });
}

function onAgreement(type: string) {
  if (type === 'user') {
    uni.navigateTo({ url: '/pages/agreement/user' });
  } else {
    uni.navigateTo({ url: '/pages/agreement/privacy' });
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* ===== 绿色渐变头部 ===== */
.header-section {
  background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);
  padding-bottom: 0;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0 64rpx;
}

.brand-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 60rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.brand-slogan {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 4rpx;
}

.header-bottom {
  height: 32rpx;
  background: $bg-page;
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -1rpx;
}

/* ===== 登录表单卡片 ===== */
.form-card {
  margin: -16rpx 32rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 48rpx 32rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.form-title {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 40rpx;
}

.form-item {
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

.input-prefix {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
  flex-shrink: 0;
}

.input-divider {
  width: 1rpx;
  height: 40rpx;
  background: $border;
  margin: 0 20rpx;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
}

.code-wrap {
  padding-right: 12rpx;
}

.code-input {
  flex: 1;
}

.code-btn {
  flex-shrink: 0;
  padding: 0 24rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  background: $primary-light;
}

.code-btn.disabled {
  opacity: 0.6;
}

.code-btn-text {
  font-size: 26rpx;
  color: $primary;
  font-weight: 500;
  white-space: nowrap;
}

.input-placeholder {
  color: $text-tertiary;
  font-size: 28rpx;
}

/* 登录按钮 */
.login-btn {
  margin-top: 48rpx;
  height: 96rpx;
  background: $primary;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
}

.login-btn:active {
  opacity: 0.85;
}

.login-btn-text {
  font-size: 34rpx;
  color: #fff;
  font-weight: 600;
}

/* 协议 */
.agreement {
  display: flex;
  align-items: flex-start;
  margin-top: 32rpx;
}

.agreement-check {
  margin-right: 12rpx;
  padding-top: 4rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox.checked {
  background: $primary;
  border-color: $primary;
}

.check-icon {
  font-size: 20rpx;
  color: #fff;
}

.agreement-text {
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 36rpx;
}

.agreement-link {
  color: $primary;
}

/* ===== 第三方登录 ===== */
.third-party {
  margin-top: 80rpx;
  padding: 0 32rpx;
}

.third-divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: $border;
}

.divider-text {
  font-size: 24rpx;
  color: $text-tertiary;
  padding: 0 24rpx;
}

.third-icons {
  display: flex;
  justify-content: center;
  gap: 80rpx;
}

.third-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.third-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.wechat-icon {
  background: #E8F8EF;
}

.qq-icon {
  background: #E3F2FD;
}

.icon-text {
  font-size: 40rpx;
}

.third-label {
  font-size: 22rpx;
  color: $text-secondary;
}
</style>
