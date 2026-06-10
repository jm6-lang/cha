<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎰</view>
        <text class="header-title">幸运抽奖</text>
        <text class="header-desc">免费抽，赢取查询次数、优惠券</text>
      </view>
    </view>

    <view class="lottery-card">
      <view class="lottery-stats">
        <view class="stat-item">
          <text class="stat-num">5</text>
          <text class="stat-label">剩余次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">12</text>
          <text class="stat-label">累计中奖</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">VIP×2</text>
          <text class="stat-label">中奖加成</text>
        </view>
      </view>

      <view class="lottery-wheel">
        <view class="wheel-grid">
          <view
            v-for="(p, i) in prizes"
            :key="i"
            class="wheel-cell"
            :class="{
              active: activeIndex === i,
              win: winIndex === i,
              center: i === 4
            }"
            :style="{
              background: p.bg,
              color: p.color
            }"
          >
            <text v-if="i !== 4" class="wheel-icon">{{ p.icon }}</text>
            <text v-if="i !== 4" class="wheel-name">{{ p.name }}</text>
            <view v-else class="wheel-center">
              <text class="center-text">{{ spinning ? '抽奖中' : 'GO' }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="lottery-info">
        <text class="lottery-tip">点击中央 GO 按钮开始抽奖</text>
      </view>
    </view>

    <view class="my-prize-card">
      <text class="my-prize-title">我的奖品</text>
      <view
        v-for="(p, i) in myPrizes"
        :key="i"
        class="my-prize-row"
      >
        <view class="my-prize-icon" :style="{ background: p.color }">
          <text class="my-prize-icon-text">{{ p.icon }}</text>
        </view>
        <view class="my-prize-info">
          <text class="my-prize-name">{{ p.name }}</text>
          <text class="my-prize-time">{{ p.time }}</text>
        </view>
        <text class="my-prize-status">{{ p.status }}</text>
      </view>
    </view>

    <view class="rule-card">
      <text class="rule-title">抽奖规则</text>
      <text class="rule-text">1. 每日登录赠送 1 次免费抽奖次数</text>
      <text class="rule-text">2. 充值满 50 元额外赠送 5 次</text>
      <text class="rule-text">3. VIP 会员中奖概率 ×2</text>
      <text class="rule-text">4. 中奖所得自动发放到账户</text>
      <text class="rule-text">5. 实物奖品 7 个工作日内联系发货</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const prizes = ref([
  { name: '免费查询', icon: '🔍', bg: '#FFE0B2', color: '#E65100' },
  { name: '10元券', icon: '🎟️', bg: '#F8BBD0', color: '#AD1457' },
  { name: '免费查询', icon: '🔍', bg: '#C5E1A5', color: '#33691E' },
  { name: '谢谢参与', icon: '💭', bg: '#E0E0E0', color: '#424242' },
  { name: 'GO', icon: '', bg: 'linear-gradient(135deg, #FF6A00, #E91E63)', color: '#fff' },
  { name: '5元券', icon: '🎫', bg: '#B3E5FC', color: '#01579B' },
  { name: '谢谢参与', icon: '💭', bg: '#E0E0E0', color: '#424242' },
  { name: '100积分', icon: '⭐', bg: '#FFF59D', color: '#F57F17' },
]);

const myPrizes = ref([
  { name: '免费查询 1 次', time: '2024-11-25 19:30', status: '已使用', icon: '🔍', color: '#FFE0B2' },
  { name: '10 元查询券', time: '2024-11-20 15:42', status: '未使用', icon: '🎟️', color: '#F8BBD0' },
  { name: '100 积分', time: '2024-11-15 10:20', status: '已到账', icon: '⭐', color: '#FFF59D' },
]);

const spinning = ref(false);
const activeIndex = ref(-1);
const winIndex = ref(-1);

function onSpin() {
  if (spinning.value) return;
  spinning.value = true;
  winIndex.value = -1;
  let count = 0;
  const total = 30 + Math.floor(Math.random() * 10);
  const interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % 8;
    if (activeIndex.value === 4) activeIndex.value = 5;
    count++;
    if (count >= total) {
      clearInterval(interval);
      spinning.value = false;
      const finalIdx = activeIndex.value === 4 ? 5 : activeIndex.value;
      winIndex.value = finalIdx;
      const prize = prizes.value[finalIdx];
      if (prize.name === '谢谢参与') {
        uni.showToast({ title: '谢谢参与，再接再厉', icon: 'none' });
      } else {
        uni.showModal({
          title: '恭喜中奖 🎉',
          content: `您抽中了：${prize.name}`,
          confirmText: '立即查看',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/user/coupon' });
            }
          },
        });
      }
    }
  }, 80);
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
  background: linear-gradient(180deg, #E91E63 0%, #AD1457 100%);
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

/* 抽奖卡 */
.lottery-card {
  margin: -16rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.lottery-stats {
  display: flex;
  background: linear-gradient(90deg, rgba(255, 106, 0, 0.1), rgba(233, 30, 99, 0.1));
  border-radius: $radius-md;
  padding: 16rpx 0;
  margin-bottom: 24rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #E91E63;
  margin-bottom: 2rpx;
}

.stat-label {
  font-size: 20rpx;
  color: $text-tertiary;
}

/* 转盘 */
.lottery-wheel {
  padding: 0 16rpx;
}

.wheel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 200rpx);
  gap: 12rpx;
}

.wheel-cell {
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
  border: 4rpx solid transparent;
  transition: all 0.2s;
}

.wheel-cell.active {
  border-color: $danger;
  transform: scale(0.95);
  box-shadow: 0 0 16rpx rgba(233, 30, 99, 0.4);
}

.wheel-cell.win {
  border-color: gold;
  box-shadow: 0 0 24rpx gold;
  animation: win-shake 0.5s;
}

@keyframes win-shake {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(0.95) rotate(-2deg); }
  75% { transform: scale(0.95) rotate(2deg); }
}

.wheel-cell.center {
  background: linear-gradient(135deg, #FF6A00, #E91E63) !important;
  border: 4rpx solid #FFD700;
  box-shadow: 0 4rpx 16rpx rgba(233, 30, 99, 0.3);
  cursor: pointer;
}

.wheel-icon {
  font-size: 48rpx;
  margin-bottom: 6rpx;
}

.wheel-name {
  font-size: 22rpx;
  font-weight: 600;
  text-align: center;
}

.wheel-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.center-text {
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4rpx;
}

.lottery-info {
  text-align: center;
  padding: 24rpx 0 0;
}

.lottery-tip {
  font-size: 24rpx;
  color: $text-tertiary;
}

/* 我的奖品 */
.my-prize-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.my-prize-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid #E91E63;
  line-height: 1;
}

.my-prize-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.my-prize-row:last-child {
  border-bottom: none;
}

.my-prize-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.my-prize-icon-text {
  font-size: 32rpx;
}

.my-prize-info {
  flex: 1;
}

.my-prize-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.my-prize-time {
  font-size: 22rpx;
  color: $text-tertiary;
}

.my-prize-status {
  font-size: 24rpx;
  color: $primary;
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
