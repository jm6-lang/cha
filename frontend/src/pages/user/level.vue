<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏆</view>
        <text class="header-title">我的等级</text>
        <text class="header-desc">等级越高 享越多特权</text>
      </view>
    </view>

    <view class="level-card">
      <view class="level-icon-wrap">
        <text class="level-icon">{{ currentLevel.icon }}</text>
      </view>
      <view class="level-info">
        <text class="level-name">{{ currentLevel.name }}</text>
        <text class="level-tip">距离下一级还需 {{ pointsToNext }} 成长值</text>
        <view class="level-progress">
          <view class="lp-fill" :style="{ width: progressPercent + '%' }" />
        </view>
        <view class="level-range">
          <text class="range-num">{{ currentLevel.min }}</text>
          <text class="range-num">{{ currentLevel.max }}</text>
        </view>
      </view>
    </view>

    <view class="benefit-card">
      <text class="benefit-title">当前等级特权</text>
      <view class="benefit-list">
        <view
          v-for="b in currentLevel.benefits"
          :key="b"
          class="benefit-item"
        >
          <text class="benefit-check">✓</text>
          <text class="benefit-text">{{ b }}</text>
        </view>
      </view>
    </view>

    <view class="all-levels">
      <text class="section-title">全部等级</text>
      <view
        v-for="l in levels"
        :key="l.name"
        class="level-row"
        :class="{ active: l.name === currentLevel.name }"
      >
        <view class="level-row-icon" :style="{ background: l.color }">
          <text class="lri-text">{{ l.icon }}</text>
        </view>
        <view class="level-row-info">
          <text class="lr-name">{{ l.name }}</text>
          <text class="lr-range">成长值 {{ l.min }} - {{ l.max }}</text>
        </view>
        <text v-if="l.name === currentLevel.name" class="lr-tag">当前</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const myPoints = ref(680);

const levels = ref([
  { name: '青铜会员', icon: '🥉', color: '#CD7F32', min: 0, max: 999, benefits: ['基础查询 8 折', '每日 1 次免费抽奖'] },
  { name: '白银会员', icon: '🥈', color: '#C0C0C0', min: 1000, max: 2999, benefits: ['基础查询 7 折', '每日 2 次免费抽奖', '生日礼包'] },
  { name: '黄金会员', icon: '🥇', color: '#FFD700', min: 3000, max: 5999, benefits: ['基础查询 6 折', '每日 5 次免费抽奖', '生日礼包', '专属客服'] },
  { name: '铂金会员', icon: '💎', color: '#E5E4E2', min: 6000, max: 9999, benefits: ['基础查询 5 折', '每日 10 次免费抽奖', '生日礼包', '专属客服', '免费报告 2 份/月'] },
  { name: '钻石会员', icon: '👑', color: '#B9F2FF', min: 10000, max: 99999, benefits: ['基础查询 4 折', '不限次免费抽奖', '生日礼包', '专属客服', '免费报告 5 份/月', 'VIP 标识'] },
  { name: '至尊会员', icon: '⚜️', color: '#FF6A00', min: 100000, max: 999999, benefits: ['基础查询 3 折', '不限次免费抽奖', '生日礼包', '专属客服', '免费报告 10 份/月', 'VIP 标识', '线下活动邀请'] },
]);

const currentLevel = computed(() => {
  return levels.value.find(l => myPoints.value >= l.min && myPoints.value <= l.max) || levels.value[0];
});

const pointsToNext = computed(() => {
  const next = levels.value.find(l => l.min > myPoints.value);
  return next ? next.min - myPoints.value : 0;
});

const progressPercent = computed(() => {
  const total = currentLevel.value.max - currentLevel.value.min;
  const current = myPoints.value - currentLevel.value.min;
  return Math.round((current / total) * 100);
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 60rpx;
}

.header {
  background: linear-gradient(180deg, #FFD700 0%, #FFA000 100%);
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

/* 等级卡 */
.level-card {
  display: flex;
  align-items: center;
  margin: -20rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.level-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #FFD700, #FFA000);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 215, 0, 0.3);
}

.level-icon {
  font-size: 64rpx;
}

.level-info {
  flex: 1;
}

.level-name {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.level-tip {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 12rpx;
}

.level-progress {
  height: 16rpx;
  background: $bg-grey;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 6rpx;
}

.lp-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FF6A00);
  border-radius: 8rpx;
}

.level-range {
  display: flex;
  justify-content: space-between;
}

.range-num {
  font-size: 20rpx;
  color: $text-tertiary;
  font-family: monospace;
}

/* 特权 */
.benefit-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
}

.benefit-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid #FFD700;
  line-height: 1;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 12rpx 16rpx;
  background: $bg-grey;
  border-radius: $radius-md;
}

.benefit-check {
  width: 36rpx;
  height: 36rpx;
  background: #FFD700;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.benefit-text {
  font-size: 28rpx;
  color: $text-primary;
}

/* 全部 */
.all-levels {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid #FFA000;
  line-height: 1;
}

.level-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.level-row:last-child {
  border-bottom: none;
}

.level-row.active {
  background: rgba(255, 215, 0, 0.05);
  margin: 0 -16rpx;
  padding: 16rpx;
  border-radius: $radius-md;
  border-bottom: none;
}

.level-row-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.lri-text {
  font-size: 36rpx;
}

.level-row-info {
  flex: 1;
}

.lr-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.lr-range {
  font-size: 22rpx;
  color: $text-tertiary;
}

.lr-tag {
  font-size: 22rpx;
  color: #fff;
  background: $warning;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-weight: 500;
}
</style>
