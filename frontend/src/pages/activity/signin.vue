<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📅</view>
        <text class="header-title">每日签到</text>
        <text class="header-desc">连续签到赢取积分和优惠券</text>
      </view>
    </view>

    <view class="streak-card">
      <view class="streak-info">
        <text class="streak-num">已连续签到 {{ streak }} 天</text>
        <text class="streak-tip">连续签到 7 天可获 200 积分</text>
      </view>
      <view class="streak-fire">🔥</view>
    </view>

    <view class="signin-card">
      <view class="signin-header">
        <text class="signin-title">本周签到</text>
        <text class="signin-status">{{ signedToday ? '今日已签' : '今日未签' }}</text>
      </view>
      <view class="day-list">
        <view
          v-for="(d, i) in weekDays"
          :key="i"
          class="day-item"
          :class="{
            signed: d.signed,
            today: d.isToday,
            rewarded: d.signed && d.reward > 0
          }"
          @tap="onDayTap(d, i)"
        >
          <text class="day-label">{{ d.label }}</text>
          <view class="day-circle">
            <text v-if="d.signed" class="day-check">✓</text>
            <text v-else class="day-num">{{ d.day }}</text>
          </view>
          <text class="day-reward">+{{ d.reward }}</text>
        </view>
      </view>
      <view class="signin-btn-wrap">
        <view
          class="signin-btn"
          :class="{ signed: signedToday, disabled: signedToday }"
          @tap="onSignin"
        >
          <text class="signin-btn-text">{{ signedToday ? '今日已签到' : '立即签到' }}</text>
        </view>
      </view>
    </view>

    <view class="reward-card">
      <text class="reward-title">签到奖励</text>
      <view class="reward-list">
        <view
          v-for="(r, i) in rewards"
          :key="i"
          class="reward-row"
        >
          <view class="reward-icon-wrap" :style="{ background: r.color }">
            <text class="reward-icon">{{ r.icon }}</text>
          </view>
          <view class="reward-info">
            <text class="reward-name">{{ r.name }}</text>
            <text class="reward-desc">{{ r.desc }}</text>
          </view>
          <view class="reward-btn" @tap="onClaim(r)">
            <text class="reward-btn-text">{{ r.claimed ? '已领取' : '领取' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="rule-card">
      <text class="rule-title">签到规则</text>
      <text class="rule-text">1. 每日签到可获得 5-200 积分，连续签到奖励更多</text>
      <text class="rule-text">2. 连续签到 7 天可获 200 积分 + 10 元优惠券</text>
      <text class="rule-text">3. 中断签到连续天数会重置</text>
      <text class="rule-text">4. 积分可兑换查询次数、优惠券等</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const streak = ref(3);
const signedToday = ref(false);

const weekDays = ref([
  { label: '周一', day: 1, reward: 5, signed: true, isToday: false },
  { label: '周二', day: 2, reward: 10, signed: true, isToday: false },
  { label: '周三', day: 3, reward: 20, signed: true, isToday: false },
  { label: '周四', day: 4, reward: 30, signed: false, isToday: false },
  { label: '周五', day: 5, reward: 50, signed: false, isToday: true },
  { label: '周六', day: 6, reward: 80, signed: false, isToday: false },
  { label: '周日', day: 7, reward: 200, signed: false, isToday: false },
]);

const rewards = ref([
  { name: '10 元查询抵扣券', desc: '单次查询满 30 元可用', icon: '🎟️', color: '#FFE0B2', claimed: true },
  { name: '5 元抵扣券', desc: '充值满 50 元可用', icon: '🎫', color: '#E0F7FA', claimed: false },
  { name: '100 积分', desc: '积分可兑换查询次数', icon: '⭐', color: '#FFF8E1', claimed: false },
  { name: '免费查询 1 次', desc: '任选付费查询 1 次', icon: '🎁', color: '#F8BBD0', claimed: false },
]);

function onDayTap(d: any, i: number) {
  if (d.isToday && !d.signed) onSignin();
}

function onSignin() {
  if (signedToday.value) {
    uni.showToast({ title: '今天已签到', icon: 'none' });
    return;
  }
  signedToday.value = true;
  streak.value++;
  const idx = weekDays.value.findIndex(d => d.isToday);
  if (idx >= 0) {
    weekDays.value[idx].signed = true;
  }
  uni.showToast({ title: '签到成功 +20 积分', icon: 'success' });
}

function onClaim(r: any) {
  if (r.claimed) {
    uni.showToast({ title: '已领取', icon: 'none' });
    return;
  }
  r.claimed = true;
  uni.showToast({ title: `已领取 ${r.name}`, icon: 'success' });
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
  background: linear-gradient(180deg, #FF9800 0%, #F57C00 100%);
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

/* 连续签到 */
.streak-card {
  display: flex;
  align-items: center;
  margin: -16rpx 24rpx 0;
  background: linear-gradient(135deg, #FFB74D, #FF9800);
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.25);
}

.streak-info {
  flex: 1;
}

.streak-num {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.streak-tip {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.streak-fire {
  font-size: 96rpx;
}

/* 签到卡 */
.signin-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.signin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.signin-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
}

.signin-status {
  font-size: 24rpx;
  color: $text-tertiary;
}

.day-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.day-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 0;
}

.day-label {
  font-size: 22rpx;
  color: $text-tertiary;
}

.day-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $bg-grey;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid transparent;
}

.day-item.signed .day-circle {
  background: $primary;
  border-color: $primary;
}

.day-item.today .day-circle {
  border-color: $primary;
  background: rgba(7, 193, 96, 0.1);
}

.day-item.signed.today .day-circle {
  background: $primary;
}

.day-check {
  font-size: 40rpx;
  color: #fff;
  font-weight: 700;
}

.day-num {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-secondary;
}

.day-item.today .day-num {
  color: $primary;
}

.day-reward {
  font-size: 20rpx;
  color: $warning;
  font-weight: 600;
}

.day-item.signed .day-reward {
  color: $primary;
}

.signin-btn-wrap {
  display: flex;
  justify-content: center;
}

.signin-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 20rpx 64rpx;
  box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.3);
}

.signin-btn:active {
  opacity: 0.85;
}

.signin-btn.signed {
  background: $text-placeholder;
  box-shadow: none;
}

.signin-btn-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: 600;
}

/* 奖励 */
.reward-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
}

.reward-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.reward-row {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 24rpx;
}

.reward-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.reward-icon {
  font-size: 40rpx;
}

.reward-info {
  flex: 1;
}

.reward-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.reward-desc {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}

.reward-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 12rpx 32rpx;
}

.reward-btn:active {
  opacity: 0.85;
}

.reward-btn-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

/* 规则 */
.rule-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.rule-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.rule-text {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.8;
}
</style>
