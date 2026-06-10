<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💰</view>
        <text class="header-title">车辆估值</text>
        <text class="header-desc">二手车估值 残值分析</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-row">
        <text class="input-label">品牌车型</text>
        <input
          v-model="model"
          class="form-input"
          placeholder="如 奥迪A6L 2020款"
          placeholder-class="placeholder"
        />
      </view>
      <view class="input-row">
        <text class="input-label">上牌时间</text>
        <picker mode="date" :value="regDate" @change="onDateChange">
          <view class="picker-value">{{ regDate || '请选择' }}</view>
        </picker>
      </view>
      <view class="input-row">
        <text class="input-label">行驶里程</text>
        <input
          v-model="mileage"
          class="form-input"
          placeholder="单位：万公里"
          placeholder-class="placeholder"
          type="digit"
        />
      </view>
      <view class="input-row">
        <text class="input-label">车辆颜色</text>
        <view class="color-list">
          <view
            v-for="c in colors"
            :key="c"
            class="color-dot"
            :class="{ active: color === c }"
            @tap="color = c"
          >
            <text class="cd-text">{{ c }}</text>
          </view>
        </view>
      </view>
      <view class="form-tip">基于大数据分析，估值仅供参考</view>
      <view class="query-btn" :class="{ disabled: !canQuery }" @tap="onQuery">
        <text class="query-btn-text">立即估值</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header">
        <text class="r-label">估值结果</text>
        <text class="r-update">更新于 2024-12-01</text>
      </view>
      <view class="price-display">
        <text class="price-num">¥{{ result.price }}</text>
        <text class="price-unit">万</text>
        <text class="price-range">估值范围 ¥{{ result.min }} - ¥{{ result.max }} 万</text>
      </view>
      <view class="trend">
        <text class="trend-label">近一年价格趋势</text>
        <view class="trend-bar">
          <view
            v-for="(t, i) in result.trend"
            :key="i"
            class="trend-item"
          >
            <view class="trend-fill" :style="{ height: t + '%' }" />
            <text class="trend-month">{{ ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][i] }}月</text>
          </view>
        </view>
      </view>

      <view class="factor-list">
        <text class="section-title">估值因素</text>
        <view
          v-for="f in result.factors"
          :key="f.name"
          class="factor-row"
        >
          <text class="factor-name">{{ f.name }}</text>
          <view class="factor-bar">
            <view class="factor-fill" :style="{ width: f.percent + '%', background: f.color }" />
          </view>
          <text class="factor-percent">{{ f.percent }}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const model = ref('');
const regDate = ref('');
const mileage = ref('');
const color = ref('');

const colors = ['黑', '白', '银', '灰', '红', '蓝'];

const result = ref<any>(null);

const canQuery = computed(() => model.value && regDate.value && mileage.value);

function onDateChange(e: any) {
  regDate.value = e.detail.value;
}

function onQuery() {
  if (!canQuery.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  const m = parseFloat(mileage.value) || 5;
  // 模拟估值
  const base = 35;
  const ageFactor = Math.max(0.5, 1 - (new Date().getFullYear() - new Date(regDate.value).getFullYear()) * 0.08);
  const kmFactor = Math.max(0.7, 1 - m * 0.04);
  const price = (base * ageFactor * kmFactor).toFixed(2);
  const min = (parseFloat(price) * 0.92).toFixed(2);
  const max = (parseFloat(price) * 1.08).toFixed(2);

  result.value = {
    price,
    min,
    max,
    trend: [80, 78, 76, 75, 74, 72, 70, 68, 66, 64, 62, 60],
    factors: [
      { name: '车况评分', percent: 85, color: '#07C160' },
      { name: '行驶里程', percent: Math.round(kmFactor * 100), color: '#1A6CFF' },
      { name: '上牌年限', percent: Math.round(ageFactor * 100), color: '#FF9800' },
      { name: '市场热度', percent: 75, color: '#E91E63' },
      { name: '地域因素', percent: 80, color: '#9C27B0' },
    ],
  };
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #5C6BC0 0%, #283593 100%);
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

/* 表单 */
.form-card {
  margin: -28rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.input-row {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 88rpx;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
}

.input-label {
  font-size: 26rpx;
  color: $text-tertiary;
  width: 160rpx;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
}

.picker-value {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: $text-primary;
}

.color-list {
  flex: 1;
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.color-dot {
  width: 64rpx;
  height: 64rpx;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid transparent;
}

.color-dot.active {
  border-color: $primary;
  background: rgba(7, 193, 96, 0.1);
}

.cd-text {
  font-size: 24rpx;
  color: $text-primary;
  font-weight: 500;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
  text-align: center;
}

.query-btn {
  margin-top: 24rpx;
  height: 88rpx;
  background: $info;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 108, 255, 0.3);
}

.query-btn.disabled {
  background: $text-placeholder;
  box-shadow: none;
}

.query-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 结果 */
.result-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.r-label {
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
}

.r-update {
  font-size: 22rpx;
  color: $text-tertiary;
}

.price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  padding: 24rpx 0;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  border-radius: $radius-md;
  margin-bottom: 20rpx;
}

.price-num {
  font-size: 64rpx;
  font-weight: 800;
  color: $info;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.price-unit {
  font-size: 28rpx;
  font-weight: 600;
  color: $info;
  margin-left: 4rpx;
  margin-right: 12rpx;
}

.price-range {
  font-size: 24rpx;
  color: $text-secondary;
}

/* 趋势 */
.trend {
  margin-bottom: 20rpx;
}

.trend-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.trend-bar {
  display: flex;
  align-items: flex-end;
  height: 120rpx;
  gap: 4rpx;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 8rpx;
}

.trend-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.trend-fill {
  width: 100%;
  background: linear-gradient(180deg, $info, #0D47A1);
  border-radius: 4rpx 4rpx 0 0;
  min-height: 4rpx;
}

.trend-month {
  font-size: 16rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

/* 因素 */
.factor-list {
  padding-top: 8rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.factor-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  gap: 16rpx;
}

.factor-name {
  font-size: 26rpx;
  color: $text-primary;
  width: 160rpx;
  flex-shrink: 0;
}

.factor-bar {
  flex: 1;
  height: 12rpx;
  background: $bg-grey;
  border-radius: 6rpx;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s;
}

.factor-percent {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 600;
  width: 80rpx;
  text-align: right;
  flex-shrink: 0;
}
</style>
