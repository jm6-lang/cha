<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📞</view>
        <text class="header-title">号码大全</text>
        <text class="header-desc">号段归属、运营商、地区查询</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="输入号段或地区"
          placeholder-class="placeholder"
          @input="onSearch"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="quick-tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="quick-tab"
        :class="{ active: activeTab === t.key }"
        @tap="activeTab = t.key"
      >
        <text class="quick-tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view class="segment-list">
      <view
        v-for="(s, i) in filteredSegments"
        :key="i"
        class="segment-item"
        @tap="onPick(s)"
      >
        <view class="segment-num">
          <text class="num-text">{{ s.num }}</text>
        </view>
        <view class="segment-info">
          <text class="info-name">{{ s.name }}</text>
          <text class="info-meta">{{ s.carrier }} · {{ s.area }} · {{ s.count }}号码</text>
        </view>
        <text class="segment-arrow">›</text>
      </view>
    </view>

    <view class="hot-areas">
      <text class="section-title">热门地区</text>
      <view class="area-grid">
        <view
          v-for="a in hotAreas"
          :key="a.name"
          class="area-item"
          @tap="onAreaPick(a)"
        >
          <text class="area-name">{{ a.name }}</text>
          <text class="area-count">{{ a.count }}</text>
        </view>
      </view>
    </view>

    <view class="feature-entries">
      <text class="section-title">号码安全</text>
      <view class="feature-card" @tap="goMark">
        <view class="feature-icon">🚨</view>
        <view class="feature-info">
          <text class="feature-name">号码标记查询</text>
          <text class="feature-desc">10 大平台综合检测（腾讯/360/小米/华为/搜狗/电话邦/百度/联通/泰迪熊/移动）</text>
          <view class="feature-tags">
            <text class="ft-tag">防骚扰</text>
            <text class="ft-tag">防诈骗</text>
            <text class="ft-tag">企业风控</text>
          </view>
        </view>
        <text class="feature-arrow">›</text>
      </view>

      <view class="feature-card" @tap="onPick({ num: '138', name: '归属地查询' })">
        <view class="feature-icon">📍</view>
        <view class="feature-info">
          <text class="feature-name">手机归属地</text>
          <text class="feature-desc">支持全国 300+ 城市精确查询，识别运营商与号段</text>
          <view class="feature-tags">
            <text class="ft-tag">精确到城市</text>
            <text class="ft-tag">三网覆盖</text>
          </view>
        </view>
        <text class="feature-arrow">›</text>
      </view>

      <view class="feature-card" @tap="goMobile">
        <view class="feature-icon">📱</view>
        <view class="feature-info">
          <text class="feature-name">手机号码详情</text>
          <text class="feature-desc">输入 11 位手机号，查询归属地/运营商/区号/邮编</text>
        </view>
        <text class="feature-arrow">›</text>
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
const activeTab = ref('all');

const tabs = [
  { key: 'all', name: '全部' },
  { key: '移动', name: '中国移动' },
  { key: '联通', name: '中国联通' },
  { key: '电信', name: '中国电信' },
  { key: '虚拟', name: '虚拟运营商' },
];

const segments = ref([
  { num: '138', name: '全球通', carrier: '移动', area: '全国', count: '2.1亿' },
  { num: '139', name: '全球通', carrier: '移动', area: '全国', count: '2.0亿' },
  { num: '150', name: '动感地带', carrier: '移动', area: '全国', count: '1.2亿' },
  { num: '151', name: '动感地带', carrier: '移动', area: '全国', count: '9000万' },
  { num: '152', name: '动感地带', carrier: '移动', area: '全国', count: '8000万' },
  { num: '158', name: '动感地带', carrier: '移动', area: '全国', count: '1.1亿' },
  { num: '159', name: '动感地带', carrier: '移动', area: '全国', count: '1.0亿' },
  { num: '186', name: '全球通', carrier: '移动', area: '全国', count: '1.5亿' },
  { num: '188', name: '全球通', carrier: '移动', area: '全国', count: '1.3亿' },
  { num: '130', name: '如意通', carrier: '联通', area: '全国', count: '1.4亿' },
  { num: '131', name: '如意通', carrier: '联通', area: '全国', count: '1.3亿' },
  { num: '132', name: '如意通', carrier: '联通', area: '全国', count: '1.2亿' },
  { num: '155', name: '如意通', carrier: '联通', area: '全国', count: '9000万' },
  { num: '156', name: '如意通', carrier: '联通', area: '全国', count: '8500万' },
  { num: '185', name: '如意通', carrier: '联通', area: '全国', count: '7500万' },
  { num: '186', name: '如意通', carrier: '联通', area: '全国', count: '1.1亿' },
  { num: '133', name: '天翼', carrier: '电信', area: '全国', count: '1.2亿' },
  { num: '153', name: '天翼', carrier: '电信', area: '全国', count: '8500万' },
  { num: '173', name: '天翼', carrier: '电信', area: '全国', count: '5000万' },
  { num: '177', name: '天翼', carrier: '电信', area: '全国', count: '4500万' },
  { num: '180', name: '天翼', carrier: '电信', area: '全国', count: '6000万' },
  { num: '181', name: '天翼', carrier: '电信', area: '全国', count: '5500万' },
  { num: '189', name: '天翼', carrier: '电信', area: '全国', count: '8000万' },
  { num: '170', name: '虚商', carrier: '虚拟', area: '全国', count: '3000万' },
  { num: '171', name: '虚商', carrier: '虚拟', area: '全国', count: '2500万' },
  { num: '165', name: '虚商', carrier: '虚拟', area: '全国', count: '800万' },
  { num: '167', name: '虚商', carrier: '虚拟', area: '全国', count: '600万' },
]);

const filteredSegments = computed(() => {
  let list = segments.value;
  if (activeTab.value !== 'all') {
    list = list.filter(s => s.carrier === activeTab.value);
  }
  if (keyword.value) {
    const k = keyword.value.toLowerCase();
    list = list.filter(s =>
      s.num.includes(k) || s.name.includes(k) || s.area.includes(k)
    );
  }
  return list;
});

const hotAreas = [
  { name: '北京', count: '3.2亿' },
  { name: '上海', count: '2.8亿' },
  { name: '广州', count: '2.5亿' },
  { name: '深圳', count: '2.3亿' },
  { name: '杭州', count: '1.8亿' },
  { name: '成都', count: '1.6亿' },
  { name: '武汉', count: '1.4亿' },
  { name: '南京', count: '1.3亿' },
];

function onSearch() {
  // reactive by computed
}

function onPick(s: any) {
  uni.showToast({ title: `${s.num}号段 - ${s.name}`, icon: 'none' });
}

function onAreaPick(a: any) {
  uni.showToast({ title: `查询${a.name}号码`, icon: 'none' });
}

function goMark() {
  uni.navigateTo({ url: '/pages/phone/mark' });
}

function goMobile() {
  uni.navigateTo({ url: '/pages/phone/mobile' });
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
  background: linear-gradient(180deg, #1A6CFF 0%, #0D47A1 100%);
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

/* 搜索 */
.search-bar {
  margin: -28rpx 24rpx 0;
  position: relative;
  z-index: 10;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: 999rpx;
  padding: 0 24rpx;
  height: 88rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
}

/* Tab */
.quick-tabs {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-md;
  padding: 8rpx;
  gap: 4rpx;
}

.quick-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: $radius-sm;
}

.quick-tab.active {
  background: $primary;
}

.quick-tab-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.quick-tab.active .quick-tab-text {
  color: #fff;
  font-weight: 600;
}

/* 号段列表 */
.segment-list {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  overflow: hidden;
}

.segment-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $border-light;
}

.segment-item:last-child {
  border-bottom: none;
}

.segment-num {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.num-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  font-family: monospace;
}

.segment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.info-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.info-meta {
  font-size: 22rpx;
  color: $text-tertiary;
}

.segment-arrow {
  font-size: 36rpx;
  color: $text-tertiary;
  font-weight: 300;
}

/* 热门地区 */
.hot-areas {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $primary;
  line-height: 1;
}

.area-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.area-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  background: $bg-grey;
  border-radius: $radius-md;
}

.area-name {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.area-count {
  font-size: 20rpx;
  color: $text-tertiary;
}

/* 特色入口 */
.feature-entries {
  margin: 20rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
}
.feature-card {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $border-light;
}
.feature-card:last-child {
  border-bottom: none;
}
.feature-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #D84315 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.feature-name {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
}
.feature-desc {
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.5;
}
.feature-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 6rpx;
}
.ft-tag {
  font-size: 20rpx;
  color: #FF6B35;
  background: rgba(255, 107, 53, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
}
.feature-arrow {
  font-size: 40rpx;
  color: $text-tertiary;
  font-weight: 300;
  margin-left: 12rpx;
}
</style>
