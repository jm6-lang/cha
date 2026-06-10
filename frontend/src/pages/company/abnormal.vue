<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚨</view>
        <text class="header-title">经营异常</text>
        <text class="header-desc">被列入经营异常名录的企业</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">🔍</text>
        <input
          v-model="keyword"
          class="form-input"
          placeholder="输入企业名称"
          placeholder-class="placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="stats-bar">
      <view class="stat-item">
        <text class="stat-num">2,856</text>
        <text class="stat-label">本月新增</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">32,158</text>
        <text class="stat-label">当前存续</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">1,234</text>
        <text class="stat-label">已移出</text>
      </view>
    </view>

    <view class="reason-list">
      <text class="section-title">列入原因</text>
      <view
        v-for="r in reasons"
        :key="r.type"
        class="reason-row"
      >
        <view class="reason-bar" :style="{ background: r.color }" />
        <view class="reason-info">
          <text class="reason-name">{{ r.type }}</text>
          <text class="reason-desc">{{ r.desc }}</text>
        </view>
        <text class="reason-count">{{ r.count }}</text>
      </view>
    </view>

    <view class="abnormal-list">
      <text class="section-title">最近列入</text>
      <view
        v-for="(c, i) in abnormalList"
        :key="i"
        class="abnormal-item"
      >
        <view class="abnormal-name-row">
          <text class="abnormal-name">{{ c.name }}</text>
          <text class="abnormal-date">{{ c.date }}</text>
        </view>
        <text class="abnormal-reason">列入原因：{{ c.reason }}</text>
        <text class="abnormal-dept">决定机关：{{ c.dept }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const keyword = ref('');

const reasons = ref([
  { type: '未按规定公示年报', desc: '企业未在规定时间内公示年度报告', count: '12,580', color: '#FF6A00' },
  { type: '登记地址失联', desc: '通过登记的住所或经营场所无法联系', count: '8,720', color: '#1976D2' },
  { type: '未公示即时信息', desc: '未依法公示应当公示的即时信息', count: '5,632', color: '#388E3C' },
  { type: '公示信息隐瞒', desc: '公示信息隐瞒真实情况、弄虚作假', count: '2,180', color: '#E91E63' },
  { type: '其他原因', desc: '其他违反工商行政管理法律法规行为', count: '3,046', color: '#795548' },
]);

const abnormalList = ref([
  { name: '北京某科技有限公司', date: '2024-11-20', reason: '未按规定公示年报', dept: '北京市市场监督管理局' },
  { name: '上海某贸易有限公司', date: '2024-11-18', reason: '登记地址失联', dept: '上海市市场监督管理局' },
  { name: '深圳某文化传播有限公司', date: '2024-11-15', reason: '未公示即时信息', dept: '深圳市市场监督管理局' },
  { name: '广州某餐饮管理有限公司', date: '2024-11-12', reason: '未按规定公示年报', dept: '广州市市场监督管理局' },
  { name: '杭州某电子商务有限公司', date: '2024-11-10', reason: '公示信息隐瞒真实情况', dept: '杭州市市场监督管理局' },
]);
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #FF8A65 0%, #D84315 100%);
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
  padding: 20rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 80rpx;
  padding: 0 20rpx;
}

.input-prefix {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
}

.search-clear {
  width: 36rpx;
  height: 36rpx;
  background: $text-tertiary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

/* 统计 */
.stats-bar {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1rpx solid $border-light;
}

.stat-item:last-child {
  border-right: none;
}

.stat-num {
  font-size: 32rpx;
  font-weight: 700;
  color: $warning;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: $text-tertiary;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin: 24rpx 24rpx 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

/* 原因 */
.reason-list {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  padding: 16rpx 24rpx;
}

.reason-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.reason-row:last-child {
  border-bottom: none;
}

.reason-bar {
  width: 8rpx;
  height: 56rpx;
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.reason-info {
  flex: 1;
}

.reason-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.reason-desc {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}

.reason-count {
  font-size: 28rpx;
  font-weight: 700;
  color: $warning;
  flex-shrink: 0;
}

/* 列表 */
.abnormal-list {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  padding: 16rpx 24rpx;
  overflow: hidden;
}

.abnormal-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.abnormal-item:last-child {
  border-bottom: none;
}

.abnormal-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.abnormal-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.abnormal-date {
  font-size: 22rpx;
  color: $text-tertiary;
  flex-shrink: 0;
  margin-left: 12rpx;
}

.abnormal-reason {
  display: block;
  font-size: 24rpx;
  color: $warning;
  margin-bottom: 4rpx;
}

.abnormal-dept {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}
</style>
