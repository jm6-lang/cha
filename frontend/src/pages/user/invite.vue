<template>
  <view class="page">
    <!-- 奖励说明 -->
    <view class="reward-card">
      <text class="reward-icon">🎁</text>
      <view class="reward-info">
        <text class="reward-title">邀请好友得佣金</text>
        <text class="reward-desc">每成功邀请一位好友注册，即可获得佣金奖励</text>
      </view>
    </view>

    <!-- 邀请码 -->
    <view class="section">
      <text class="section-title">我的邀请码</text>
      <view class="invite-code-row">
        <text class="invite-code">SHU8A2K9</text>
        <button class="btn-copy" @tap="copyCode">复制</button>
      </view>
    </view>

    <!-- 邀请规则 -->
    <view class="section">
      <text class="section-title">邀请规则</text>
      <view class="rule-list">
        <view v-for="(r, i) in rules" :key="i" class="rule-item">
          <text class="rule-dot">•</text>
          <text class="rule-text">{{ r }}</text>
        </view>
      </view>
    </view>

    <!-- 邀请记录 -->
    <view class="section">
      <text class="section-title">邀请记录</text>
      <view class="empty-state">
        <text class="empty-icon">👥</text>
        <text class="empty-text">暂无邀请记录</text>
      </view>
    </view>

    <!-- 分享按钮 -->
    <view class="share-section">
      <button class="btn-share" @tap="onShare">邀请好友</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const rules = [
  '好友通过您的邀请码注册成功后，双方均可获得奖励',
  '邀请人数无上限，邀请越多奖励越多',
  '佣金将在好友完成首次查询后到账',
  '严禁恶意刷单，违者将取消资格',
];

function copyCode() {
  uni.setClipboardData({
    data: 'SHU8A2K9',
    success: () => {
      uni.showToast({ title: '邀请码已复制', icon: 'success' });
    },
  });
}

function onShare() {
  uni.showToast({ title: '分享功能 - 即将上线', icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 160rpx;
}

/* 奖励说明 */
.reward-card {
  background: $primary;
  margin: 24rpx;
  border-radius: $radius-lg;
  padding: 36rpx 32rpx;
  display: flex;
  align-items: center;
}

.reward-icon {
  font-size: 56rpx;
  margin-right: 20rpx;
}

.reward-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reward-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.reward-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 8rpx;
}

/* 通用section */
.section {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20rpx;
}

/* 邀请码 */
.invite-code-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 24rpx;
}

.invite-code {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
  letter-spacing: 4rpx;
}

.btn-copy {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 60rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
}

.btn-copy:active {
  opacity: 0.85;
}

/* 邀请规则 */
.rule-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.rule-item {
  display: flex;
  align-items: flex-start;
}

.rule-dot {
  color: $primary;
  font-size: 28rpx;
  margin-right: 12rpx;
  line-height: 40rpx;
}

.rule-text {
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 40rpx;
}

/* 邀请记录 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 72rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $text-tertiary;
}

/* 分享按钮 */
.share-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: $bg-card;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.btn-share {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
}

.btn-share:active {
  opacity: 0.85;
}
</style>
