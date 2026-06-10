<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⚠️</view>
        <text class="header-title">失信企业</text>
        <text class="header-desc">被列入失信被执行人的企业</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">🔍</text>
        <input
          v-model="keyword"
          class="form-input"
          placeholder="输入企业名称或法人"
          placeholder-class="placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="filter-bar">
      <view
        v-for="f in filters"
        :key="f.key"
        class="filter-chip"
        :class="{ active: activeFilter === f.key }"
        @tap="activeFilter = f.key"
      >
        <text class="chip-text">{{ f.name }}</text>
      </view>
    </view>

    <view class="dis-list">
      <view
        v-for="(c, i) in filteredList"
        :key="i"
        class="dis-item"
      >
        <view class="dis-header">
          <view class="dis-no">
            <text class="dis-no-text">失信 {{ c.caseNo }}</text>
          </view>
          <text class="dis-date">{{ c.date }}</text>
        </view>
        <text class="dis-name">{{ c.name }}</text>
        <view class="dis-meta-row">
          <text class="dis-meta-label">法人</text>
          <text class="dis-meta-value">{{ c.legal }}</text>
        </view>
        <view class="dis-meta-row">
          <text class="dis-meta-label">执行法院</text>
          <text class="dis-meta-value">{{ c.court }}</text>
        </view>
        <view class="dis-meta-row">
          <text class="dis-meta-label">执行标的</text>
          <text class="dis-meta-value amount">{{ c.amount }}</text>
        </view>
        <view class="dis-reason">
          <text class="reason-label">失信行为：</text>
          <text class="reason-text">{{ c.reason }}</text>
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

const keyword = ref('');
const activeFilter = ref('all');

const filters = [
  { key: 'all', name: '全部' },
  { key: 'high', name: '高金额' },
  { key: 'recent', name: '最近' },
];

const list = ref([
  { caseNo: '2024-001', date: '2024-11-15', name: '某科技股份有限公司', legal: '张某', court: '北京市第一中级人民法院', amount: '3.2亿', reason: '有履行能力而拒不履行生效法律文书确定义务', tag: 'high' },
  { caseNo: '2024-002', date: '2024-11-08', name: '某房地产开发有限公司', legal: '李某', court: '上海市浦东新区人民法院', amount: '8500万', reason: '违反财产报告制度', tag: 'high' },
  { caseNo: '2024-003', date: '2024-10-22', name: '某商贸有限公司', legal: '王某', court: '深圳市中级人民法院', amount: '1200万', reason: '被执行人无正当理由拒不履行执行和解协议', tag: '' },
  { caseNo: '2024-004', date: '2024-10-15', name: '某建设集团有限公司', legal: '赵某', court: '杭州市中级人民法院', amount: '5600万', reason: '有履行能力而拒不履行生效法律文书确定义务', tag: 'high' },
  { caseNo: '2024-005', date: '2024-09-28', name: '某教育咨询有限公司', legal: '刘某', court: '广州市天河区人民法院', amount: '380万', reason: '违反财产报告制度', tag: '' },
]);

const filteredList = computed(() => {
  let result = list.value;
  if (keyword.value) {
    const k = keyword.value.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(k) || c.legal.includes(k)
    );
  }
  if (activeFilter.value === 'high') {
    result = result.filter(c => c.tag === 'high');
  } else if (activeFilter.value === 'recent') {
    result = result.slice(0, 3);
  }
  return result;
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #EF5350 0%, #C62828 100%);
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

/* 筛选 */
.filter-bar {
  display: flex;
  gap: 12rpx;
  padding: 20rpx 24rpx 0;
}

.filter-chip {
  padding: 10rpx 24rpx;
  background: $bg-card;
  border-radius: 999rpx;
}

.filter-chip.active {
  background: $danger;
}

.chip-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.filter-chip.active .chip-text {
  color: #fff;
  font-weight: 500;
}

/* 列表 */
.dis-list {
  padding: 16rpx 24rpx 0;
}

.dis-item {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  border-left: 6rpx solid $danger;
}

.dis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.dis-no {
  background: rgba(255, 59, 48, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.dis-no-text {
  font-size: 20rpx;
  color: $danger;
  font-weight: 500;
  font-family: monospace;
}

.dis-date {
  font-size: 22rpx;
  color: $text-tertiary;
}

.dis-name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12rpx;
}

.dis-meta-row {
  display: flex;
  padding: 6rpx 0;
}

.dis-meta-label {
  font-size: 24rpx;
  color: $text-tertiary;
  width: 140rpx;
  flex-shrink: 0;
}

.dis-meta-value {
  font-size: 24rpx;
  color: $text-primary;
  flex: 1;
}

.dis-meta-value.amount {
  color: $danger;
  font-weight: 600;
}

.dis-reason {
  margin-top: 12rpx;
  padding: 12rpx 16rpx;
  background: #FFF5F5;
  border-radius: 8rpx;
}

.reason-label {
  font-size: 22rpx;
  color: $danger;
  font-weight: 500;
}

.reason-text {
  font-size: 22rpx;
  color: $text-secondary;
}
</style>
