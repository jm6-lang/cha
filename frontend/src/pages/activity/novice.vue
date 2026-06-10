<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎁</view>
        <text class="header-title">新人专享</text>
        <text class="header-desc">注册即享 5 重好礼</text>
      </view>
    </view>

    <view class="hero-card">
      <view class="hero-prize">
        <text class="hero-prize-num">¥58</text>
        <text class="hero-prize-label">新人礼包</text>
      </view>
      <view class="hero-content">
        <text class="hero-title">限时领取 仅限新用户</text>
        <text class="hero-desc">含 8 元抵扣券 + 5 次免费查询 + 100 积分</text>
        <view class="hero-btn" @tap="onClaim">
          <text class="hero-btn-text">立即领取</text>
        </view>
      </view>
    </view>

    <view class="step-card">
      <text class="step-title">新人任务</text>
      <view class="step-list">
        <view class="step-item">
          <view class="step-num done">✓</view>
          <view class="step-info">
            <text class="step-name">注册账号</text>
            <text class="step-desc">完成注册即可</text>
          </view>
          <text class="step-reward">+20积分</text>
        </view>
        <view class="step-item">
          <view class="step-num done">✓</view>
          <view class="step-info">
            <text class="step-name">绑定手机号</text>
            <text class="step-desc">完善手机号信息</text>
          </view>
          <text class="step-reward">+30积分</text>
        </view>
        <view class="step-item" @tap="onStepTap(3)">
          <view class="step-num">3</view>
          <view class="step-info">
            <text class="step-name">完成首次查询</text>
            <text class="step-desc">查询任意号码</text>
          </view>
          <text class="step-reward">+50积分</text>
        </view>
        <view class="step-item" @tap="onStepTap(4)">
          <view class="step-num">4</view>
          <view class="step-info">
            <text class="step-name">首次充值</text>
            <text class="step-desc">充值任意金额</text>
          </view>
          <text class="step-reward">+100积分</text>
        </view>
        <view class="step-item" @tap="onStepTap(5)">
          <view class="step-num">5</view>
          <view class="step-info">
            <text class="step-name">邀请好友</text>
            <text class="step-desc">成功邀请 1 位好友</text>
          </view>
          <text class="step-reward">+200积分</text>
        </view>
      </view>
    </view>

    <view class="exclusive-card">
      <text class="ex-title">新人专享服务</text>
      <view class="ex-grid">
        <view class="ex-item">
          <text class="ex-icon">🔍</text>
          <text class="ex-name">免费查询 5 次</text>
          <text class="ex-desc">任意付费查询</text>
        </view>
        <view class="ex-item">
          <text class="ex-icon">🎟️</text>
          <text class="ex-name">8 元抵扣券</text>
          <text class="ex-desc">单次满 30 元可用</text>
        </view>
        <view class="ex-item">
          <text class="ex-icon">💎</text>
          <text class="ex-name">VIP 7 天体验</text>
          <text class="ex-desc">免费体验会员</text>
        </view>
        <view class="ex-item">
          <text class="ex-icon">👥</text>
          <text class="ex-name">邀请奖励</text>
          <text class="ex-desc">邀请得现金</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

function onClaim() {
  uni.showModal({
    title: '领取成功 🎉',
    content: '新人礼包已发放到您的账户，\n有效期 7 天，请尽快使用。',
    showCancel: false,
  });
}

function onStepTap(step: number) {
  const tips: Record<number, string> = {
    3: '请到首页完成任意查询',
    4: '请前往充值页面完成首次充值',
    5: '请前往「我的-邀请好友」分享',
  };
  uni.showModal({
    title: `完成任务 ${step}`,
    content: tips[step] || '',
    confirmText: '去完成',
    success: (res) => {
      if (res.confirm) {
        if (step === 3) uni.switchTab({ url: '/pages/index/index' });
        else if (step === 4) uni.navigateTo({ url: '/pages/user/recharge' });
        else if (step === 5) uni.navigateTo({ url: '/pages/user/invite' });
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
  padding-bottom: 60rpx;
}

.header {
  background: linear-gradient(180deg, #FF6A00 0%, #E64A19 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 40rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* Hero卡 */
.hero-card {
  display: flex;
  align-items: center;
  margin: -20rpx 24rpx 0;
  background: linear-gradient(135deg, #FFB74D, #FF6A00);
  border-radius: $radius-lg;
  padding: 32rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 8rpx 24rpx rgba(255, 106, 0, 0.3);
}

.hero-prize {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-right: 24rpx;
  text-align: center;
  min-width: 180rpx;
}

.hero-prize-num {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 6rpx;
}

.hero-prize-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
}

.hero-content {
  flex: 1;
}

.hero-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.hero-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.hero-btn {
  display: inline-block;
  background: #fff;
  border-radius: 999rpx;
  padding: 12rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.hero-btn-text {
  font-size: 26rpx;
  color: #FF6A00;
  font-weight: 700;
}

/* 步骤 */
.step-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
}

.step-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.step-item {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 24rpx;
}

.step-num {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: $text-placeholder;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.step-num.done {
  background: $primary;
}

.step-info {
  flex: 1;
}

.step-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.step-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}

.step-reward {
  font-size: 26rpx;
  color: $warning;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 12rpx;
}

/* 专享 */
.exclusive-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
}

.ex-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $danger;
  line-height: 1;
}

.ex-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.ex-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
  border-radius: $radius-md;
}

.ex-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.ex-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.ex-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}
</style>
