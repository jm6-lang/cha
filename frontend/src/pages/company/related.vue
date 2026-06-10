<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🔗</view>
        <text class="header-title">关联企业</text>
        <text class="header-desc">股权穿透/实控人/对外投资</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">🏢</text>
        <input
          v-model="company"
          class="form-input"
          placeholder="输入企业名称"
          placeholder-class="placeholder"
        />
      </view>
      <view class="query-btn" :class="{ disabled: !company }" @tap="onQuery">
        <text class="query-btn-text">查询关联图谱</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="graph-section">
        <text class="section-title">股权穿透图</text>
        <view class="graph">
          <view class="graph-row top">
            <view class="node main">
              <text class="node-name">{{ result.target }}</text>
              <text class="node-tag">目标企业</text>
            </view>
          </view>
          <view class="graph-line" />
          <view class="graph-row mid">
            <view class="node parent">
              <text class="node-name">{{ result.parent }}</text>
              <text class="node-tag">100% 控股</text>
            </view>
          </view>
          <view class="graph-line" />
          <view class="graph-row mid">
            <view class="node parent">
              <text class="node-name">{{ result.actual }}</text>
              <text class="node-tag">实际控制人</text>
            </view>
          </view>
        </view>
      </view>

      <view class="info-section">
        <text class="section-title">对外投资</text>
        <view
          v-for="(s, i) in result.subsidiaries"
          :key="i"
          class="sub-row"
        >
          <view class="sub-dot" />
          <view class="sub-info">
            <text class="sub-name">{{ s.name }}</text>
            <text class="sub-meta">持股 {{ s.percent }}% · 注册资本 {{ s.capital }}</text>
          </view>
        </view>
      </view>

      <view class="info-section">
        <text class="section-title">控股结构</text>
        <view class="structure-card">
          <view class="str-row">
            <text class="str-label">控股股东</text>
            <text class="str-value">{{ result.parent }}</text>
          </view>
          <view class="str-row">
            <text class="str-label">实际控制人</text>
            <text class="str-value">{{ result.actual }}</text>
          </view>
          <view class="str-row">
            <text class="str-label">最终受益人</text>
            <text class="str-value">{{ result.actual }}</text>
          </view>
          <view class="str-row">
            <text class="str-label">持股比例</text>
            <text class="str-value">{{ result.stake }}%</text>
          </view>
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

const company = ref('');
const result = ref<any>(null);

function onQuery() {
  if (!company.value.trim()) {
    uni.showToast({ title: '请输入企业名称', icon: 'none' });
    return;
  }
  result.value = {
    target: company.value,
    parent: '某集团有限公司',
    actual: '张某',
    stake: 100,
    subsidiaries: [
      { name: '北京某科技子公司', percent: 100, capital: '5000万' },
      { name: '上海某贸易子公司', percent: 80, capital: '1亿' },
      { name: '深圳某投资公司', percent: 60, capital: '3000万' },
      { name: '广州某服务公司', percent: 51, capital: '2000万' },
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

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.input-prefix {
  font-size: 32rpx;
  margin-right: 12rpx;
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
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.graph-section,
.info-section {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.graph {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.graph-row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 4rpx 0;
}

.graph-line {
  width: 2rpx;
  height: 32rpx;
  background: $text-placeholder;
}

.node {
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 32rpx;
  text-align: center;
  min-width: 320rpx;
  max-width: 90%;
}

.node.main {
  background: $info;
}

.node.parent {
  background: rgba(26, 108, 255, 0.1);
  border: 1rpx solid $info;
}

.node-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.node.main .node-name {
  color: #fff;
}

.node-tag {
  font-size: 22rpx;
  color: $text-tertiary;
}

.node.main .node-tag {
  color: rgba(255, 255, 255, 0.85);
}

.node.parent .node-tag {
  color: $info;
}

/* 子公司 */
.sub-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.sub-row:last-child {
  border-bottom: none;
}

.sub-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $info;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.sub-info {
  flex: 1;
}

.sub-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.sub-meta {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 结构卡 */
.structure-card {
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 24rpx;
}

.str-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}

.str-row + .str-row {
  border-top: 1rpx solid $border-light;
}

.str-label {
  font-size: 26rpx;
  color: $text-tertiary;
}

.str-value {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 500;
  text-align: right;
}
</style>
