<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👔</view>
        <text class="header-title">企业详情</text>
        <text class="header-desc">{{ name }}</text>
      </view>
    </view>

    <view class="company-hero">
      <view class="hero-logo">{{ name.substring(0, 1) }}</view>
      <view class="hero-info">
        <text class="hero-name">{{ name }}</text>
        <text class="hero-status">● 存续 · 经营正常</text>
      </view>
    </view>

    <view class="tab-bar">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeTab === t.key }"
        @tap="activeTab = t.key"
      >
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view v-if="activeTab === 'basic'" class="content-card">
      <view class="info-row">
        <text class="row-label">统一社会信用代码</text>
        <text class="row-value mono">91330100799655058B</text>
      </view>
      <view class="info-row">
        <text class="row-label">法定代表人</text>
        <text class="row-value">徐直军</text>
      </view>
      <view class="info-row">
        <text class="row-label">注册资本</text>
        <text class="row-value">4044113.5万人民币</text>
      </view>
      <view class="info-row">
        <text class="row-label">实缴资本</text>
        <text class="row-value">4044113.5万人民币</text>
      </view>
      <view class="info-row">
        <text class="row-label">成立日期</text>
        <text class="row-value">1987-09-15</text>
      </view>
      <view class="info-row">
        <text class="row-label">营业期限</text>
        <text class="row-value">长期</text>
      </view>
      <view class="info-row">
        <text class="row-label">企业类型</text>
        <text class="row-value">有限责任公司</text>
      </view>
      <view class="info-row">
        <text class="row-label">所属行业</text>
        <text class="row-value">信息传输、软件和信息技术服务业</text>
      </view>
      <view class="info-row">
        <text class="row-label">注册地址</text>
        <text class="row-value">深圳市龙岗区坂田华为基地</text>
      </view>
      <view class="info-row">
        <text class="row-label">经营范围</text>
        <text class="row-value block">程控交换机、传输设备、数据通信设备、宽带多媒体设备、电源、无线通信设备、微电子产品、软件、系统集成工程、计算机及配套设备、终端设备及相关的技术开发、技术咨询、技术服务、技术培训等。</text>
      </view>
    </view>

    <!-- 股东信息 -->
    <view v-else-if="activeTab === 'shareholders'" class="content-card">
      <view
        v-for="s in shareholders"
        :key="s.name"
        class="shareholder-row"
      >
        <text class="sh-name">{{ s.name }}</text>
        <text class="sh-stake">{{ s.stake }} · 持股 {{ s.percent }}%</text>
        <text class="sh-cap">认缴出资 {{ s.amount }}</text>
      </view>
    </view>

    <!-- 风险信息 -->
    <view v-else-if="activeTab === 'risk'" class="content-card">
      <view class="risk-item success">
        <text class="risk-icon">✓</text>
        <view class="risk-info">
          <text class="risk-title">经营状态正常</text>
          <text class="risk-desc">未被列入经营异常名录</text>
        </view>
      </view>
      <view class="risk-item success">
        <text class="risk-icon">✓</text>
        <view class="risk-info">
          <text class="risk-title">无失信记录</text>
          <text class="risk-desc">未被列入失信被执行人名单</text>
        </view>
      </view>
      <view class="risk-item success">
        <text class="risk-icon">✓</text>
        <view class="risk-info">
          <text class="risk-title">无行政处罚</text>
          <text class="risk-desc">近 3 年无重大行政处罚记录</text>
        </view>
      </view>
      <view class="risk-item warning">
        <text class="risk-icon">⚠</text>
        <view class="risk-info">
          <text class="risk-title">存在少量诉讼</text>
          <text class="risk-desc">共 12 起诉讼，其中 3 起作为被告</text>
        </view>
      </view>
    </view>

    <!-- 年报信息 -->
    <view v-else-if="activeTab === 'report'" class="content-card">
      <view class="report-summary">
        <view class="summary-item">
          <text class="summary-label">参保人数</text>
          <text class="summary-value">10万+</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">营业收入</text>
          <text class="summary-value">7041亿</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">纳税总额</text>
          <text class="summary-value">320亿</text>
        </view>
      </view>
      <view class="report-timeline">
        <text class="section-sub">年报披露</text>
        <view
          v-for="y in reports"
          :key="y.year"
          class="timeline-row"
        >
          <view class="timeline-dot" />
          <view class="timeline-content">
            <text class="tl-year">{{ y.year }} 年报</text>
            <text class="tl-desc">营业收入 {{ y.revenue }} · 净利润 {{ y.profit }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const name = ref('华为技术有限公司');
const activeTab = ref('basic');

const tabs = [
  { key: 'basic', name: '基本信息' },
  { key: 'shareholders', name: '股东' },
  { key: 'risk', name: '风险' },
  { key: 'report', name: '年报' },
];

const shareholders = ref([
  { name: '华为投资控股有限公司工会委员会', stake: '第一大股东', percent: '99.42', amount: '401.8亿' },
  { name: '任正非', stake: '个人股东', percent: '0.58', amount: '2.4亿' },
]);

const reports = ref([
  { year: 2023, revenue: '7041.74亿', profit: '869.5亿' },
  { year: 2022, revenue: '6369.9亿', profit: '356.6亿' },
  { year: 2021, revenue: '6306.4亿', profit: '1137.2亿' },
  { year: 2020, revenue: '8913.7亿', profit: '643.9亿' },
]);

onLoad((q: any) => {
  if (q?.name) name.value = decodeURIComponent(q.name);
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
  background: linear-gradient(180deg, #5C6BC0 0%, #3949AB 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 32rpx;
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
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 头部卡 */
.company-hero {
  display: flex;
  align-items: center;
  margin: -16rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.hero-logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  background: $info;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  margin-right: 24rpx;
}

.hero-info {
  flex: 1;
  min-width: 0;
}

.hero-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-status {
  font-size: 26rpx;
  color: $primary;
  font-weight: 500;
}

/* Tab */
.tab-bar {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-md;
  padding: 8rpx;
  gap: 4rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: $radius-sm;
}

.tab.active {
  background: $info;
}

.tab-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.tab.active .tab-text {
  color: #fff;
  font-weight: 600;
}

/* 内容 */
.content-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
  gap: 16rpx;
}

.info-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 26rpx;
  color: $text-tertiary;
  flex-shrink: 0;
}

.row-value {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
}

.row-value.mono {
  font-family: monospace;
  letter-spacing: 1rpx;
}

.row-value.block {
  text-align: left;
  line-height: 1.6;
}

/* 股东 */
.shareholder-row {
  display: flex;
  flex-direction: column;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.shareholder-row:last-child {
  border-bottom: none;
}

.sh-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.sh-stake {
  font-size: 24rpx;
  color: $info;
  font-weight: 500;
  margin-bottom: 2rpx;
}

.sh-cap {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 风险 */
.risk-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.risk-item:last-child {
  border-bottom: none;
}

.risk-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.risk-item.success .risk-icon {
  background: $primary;
}

.risk-item.warning .risk-icon {
  background: $warning;
}

.risk-info {
  flex: 1;
}

.risk-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.risk-desc {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 年报 */
.report-summary {
  display: flex;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx 0;
  margin-bottom: 24rpx;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 4rpx;
}

.summary-value {
  font-size: 32rpx;
  font-weight: 700;
  color: $info;
}

.report-timeline {
  display: flex;
  flex-direction: column;
}

.section-sub {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 16rpx;
}

.timeline-row {
  display: flex;
  align-items: flex-start;
  padding: 12rpx 0;
  position: relative;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: $info;
  margin-right: 16rpx;
  margin-top: 12rpx;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid $border-light;
}

.timeline-row:last-child .timeline-content {
  border-bottom: none;
}

.tl-year {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.tl-desc {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}
</style>
