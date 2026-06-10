<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👤</view>
        <text class="header-title">法人查询</text>
        <text class="header-desc">通过自然人姓名查找关联企业</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-title">查询法人</view>
      <view class="input-wrap">
        <input
          v-model="name"
          class="form-input"
          placeholder="请输入法人姓名"
          placeholder-class="placeholder"
        />
      </view>
      <view class="form-tip">提示：仅能查询到公开工商登记的法人信息</view>
      <view class="query-btn" :class="{ disabled: !name }" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-summary">
        <view class="summary-stat">
          <text class="stat-num">{{ result.total }}</text>
          <text class="stat-label">家关联企业</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-stat">
          <text class="stat-num">{{ result.active }}</text>
          <text class="stat-label">存续中</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-stat">
          <text class="stat-num">{{ result.avgCapital }}</text>
          <text class="stat-label">平均注册资本</text>
        </view>
      </view>

      <view class="result-list">
        <view
          v-for="c in result.companies"
          :key="c.name"
          class="company-row"
        >
          <view class="company-name-row">
            <text class="company-name">{{ c.name }}</text>
            <text :class="['status-tag', c.status === '存续' ? 'active' : 'inactive']">
              {{ c.status }}
            </text>
          </view>
          <text class="company-meta">法人代表 · 注册资本 {{ c.capital }}</text>
          <text class="company-meta">成立 {{ c.established }} · {{ c.industry }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-card">
      <text class="empty-icon">🔍</text>
      <text class="empty-title">输入法人姓名开始查询</text>
      <text class="empty-desc">可查询个人在所有工商登记中担任法人的企业</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const name = ref('');
const result = ref<any>(null);

function onQuery() {
  if (!name.value.trim()) {
    uni.showToast({ title: '请输入法人姓名', icon: 'none' });
    return;
  }
  result.value = {
    total: 5,
    active: 3,
    avgCapital: '8500万',
    companies: [
      { name: '北京某科技有限公司', status: '存续', capital: '5000万', established: '2015-03-12', industry: '科技/互联网' },
      { name: '上海某贸易有限公司', status: '存续', capital: '1亿', established: '2010-08-25', industry: '批发零售' },
      { name: '深圳某投资合伙企业', status: '存续', capital: '2亿', established: '2018-11-30', industry: '投资管理' },
      { name: '杭州某文化传媒有限公司', status: '注销', capital: '200万', established: '2012-06-15', industry: '文化传媒' },
      { name: '广州某餐饮管理有限公司', status: '吊销', capital: '100万', established: '2008-04-08', industry: '餐饮' },
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
  background: linear-gradient(180deg, #5C6BC0 0%, #3949AB 100%);
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
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.form-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
}

.query-btn {
  margin-top: 32rpx;
  height: 96rpx;
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
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-summary {
  display: flex;
  background: linear-gradient(135deg, #5C6BC0, #3949AB);
  padding: 28rpx 0;
}

.summary-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
}

.summary-divider {
  width: 1rpx;
  background: rgba(255, 255, 255, 0.2);
}

.result-list {
  padding: 8rpx 28rpx;
}

.company-row {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.company-row:last-child {
  border-bottom: none;
}

.company-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 6rpx;
}

.company-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  flex-shrink: 0;
}

.status-tag.active {
  color: $primary;
  background: rgba(7, 193, 96, 0.1);
}

.status-tag.inactive {
  color: $danger;
  background: rgba(255, 59, 48, 0.1);
}

.company-meta {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.6;
}

/* 空 */
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 24rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
  opacity: 0.5;
}

.empty-title {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 8rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
