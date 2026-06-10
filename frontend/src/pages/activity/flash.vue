<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⚡</view>
        <text class="header-title">限时秒杀</text>
        <text class="header-desc">低至 1 元 限时抢购</text>
      </view>
    </view>

    <view class="countdown-bar">
      <text class="cd-label">距活动结束</text>
      <view class="cd-blocks">
        <text class="cd-block">{{ cdHours }}</text>
        <text class="cd-colon">:</text>
        <text class="cd-block">{{ cdMinutes }}</text>
        <text class="cd-colon">:</text>
        <text class="cd-block">{{ cdSeconds }}</text>
      </view>
    </view>

    <view class="flash-list">
      <view
        v-for="(g, i) in goods"
        :key="i"
        class="flash-item"
      >
        <view class="flash-img">
          <text class="flash-img-icon">{{ g.icon }}</text>
          <view class="flash-tag">
            <text class="flash-tag-text">{{ g.tag }}</text>
          </view>
        </view>
        <view class="flash-info">
          <text class="flash-name">{{ g.name }}</text>
          <text class="flash-desc">{{ g.desc }}</text>
          <view class="flash-progress">
            <view class="fp-bar">
              <view class="fp-fill" :style="{ width: g.percent + '%' }" />
            </view>
            <text class="fp-text">已抢 {{ g.percent }}%</text>
          </view>
          <view class="flash-bottom">
            <view class="flash-price">
              <text class="price-num">¥{{ g.price }}</text>
              <text class="price-origin">¥{{ g.origin }}</text>
            </view>
            <view class="flash-btn" :class="{ disabled: g.percent >= 100 }" @tap="onBuy(g)">
              <text class="flash-btn-text">{{ g.percent >= 100 ? '已抢光' : '立即抢' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="rule-card">
      <text class="rule-title">活动规则</text>
      <text class="rule-text">1. 秒杀商品数量有限，先到先得</text>
      <text class="rule-text">2. 每个用户每款商品限购 1 次</text>
      <text class="rule-text">3. 秒杀成功后 30 分钟内未支付，订单自动取消</text>
      <text class="rule-text">4. 秒杀商品不支持退换</text>
      <text class="rule-text">5. 最终解释权归数查平台所有</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const cdHours = ref('00');
const cdMinutes = ref('00');
const cdSeconds = ref('00');

let timer: any;

const goods = ref([
  { name: '个人征信报告', desc: '全面征信查询', icon: '💳', tag: '5折', price: '1.0', origin: '9.9', percent: 78 },
  { name: '企业工商信息', desc: '工商详情报告', icon: '🏢', tag: '爆款', price: '1.9', origin: '5.9', percent: 92 },
  { name: '失信被执行人', desc: '失信信息查询', icon: '⚖️', tag: '推荐', price: '1.5', origin: '5.9', percent: 56 },
  { name: '车辆违章查询', desc: '违章记录详情', icon: '🚗', tag: '5折', price: '1.5', origin: '5.9', percent: 100 },
  { name: '号码深度报告', desc: '深度背景调查', icon: '🔍', tag: '推荐', price: '2.9', origin: '9.9', percent: 45 },
  { name: '婚姻状态查询', desc: '婚姻记录核验', icon: '💑', tag: '5折', price: '1.9', origin: '5.9', percent: 67 },
]);

function updateCountdown() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const diff = endOfDay.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  cdHours.value = String(h).padStart(2, '0');
  cdMinutes.value = String(m).padStart(2, '0');
  cdSeconds.value = String(s).padStart(2, '0');
}

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function onBuy(g: any) {
  if (g.percent >= 100) return;
  uni.showModal({
    title: '确认抢购',
    content: `抢购「${g.name}」\n价格：¥${g.price}\n请在 30 分钟内完成支付`,
    confirmText: '立即抢购',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({ url: `/pages/pay/index?name=${encodeURIComponent(g.name)}&price=${g.price}` });
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
  background: linear-gradient(180deg, #E53935 0%, #B71C1C 100%);
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

/* 倒计时 */
.countdown-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin: -16rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-md;
  padding: 16rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.cd-label {
  font-size: 26rpx;
  color: $text-secondary;
  font-weight: 500;
}

.cd-blocks {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.cd-block {
  display: inline-block;
  background: $danger;
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.cd-colon {
  font-size: 28rpx;
  color: $danger;
  font-weight: 700;
}

/* 商品 */
.flash-list {
  padding: 20rpx 24rpx 0;
}

.flash-item {
  display: flex;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.flash-img {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  position: relative;
  flex-shrink: 0;
}

.flash-img-icon {
  font-size: 96rpx;
}

.flash-tag {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  background: $danger;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.flash-tag-text {
  font-size: 18rpx;
  color: #fff;
  font-weight: 700;
}

.flash-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.flash-name {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.flash-desc {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 12rpx;
}

.flash-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.fp-bar {
  flex: 1;
  height: 12rpx;
  background: $bg-grey;
  border-radius: 6rpx;
  overflow: hidden;
}

.fp-fill {
  height: 100%;
  background: linear-gradient(90deg, $warning, $danger);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.fp-text {
  font-size: 20rpx;
  color: $danger;
  font-weight: 500;
  flex-shrink: 0;
}

.flash-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.flash-price {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.price-num {
  font-size: 36rpx;
  font-weight: 800;
  color: $danger;
}

.price-origin {
  font-size: 22rpx;
  color: $text-tertiary;
  text-decoration: line-through;
}

.flash-btn {
  background: $danger;
  border-radius: 999rpx;
  padding: 12rpx 28rpx;
}

.flash-btn.disabled {
  background: $text-placeholder;
}

.flash-btn-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
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
