<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏢</view>
        <text class="header-title">运营商介绍</text>
        <text class="header-desc">三大运营商及虚拟运营商</text>
      </view>
    </view>

    <view class="carrier-tabs">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="carrier-tab"
        :class="{ active: activeTab === t.key }"
        @tap="activeTab = t.key"
      >
        <text class="tab-name">{{ t.name }}</text>
      </view>
    </view>

    <view v-if="activeCarrier" class="carrier-detail">
      <view class="detail-header" :style="{ background: activeCarrier.gradient }">
        <view class="detail-logo">
          <text class="detail-logo-text">{{ activeCarrier.short }}</text>
        </view>
        <view class="detail-title-block">
          <text class="detail-name">{{ activeCarrier.name }}</text>
          <text class="detail-slogan">{{ activeCarrier.slogan }}</text>
        </view>
      </view>

      <view class="detail-section">
        <text class="section-title">品牌简介</text>
        <text class="section-content">{{ activeCarrier.intro }}</text>
      </view>

      <view class="detail-section">
        <text class="section-title">主要号段</text>
        <view class="num-list">
          <view
            v-for="n in activeCarrier.numbers"
            :key="n.num"
            class="num-item"
          >
            <text class="num-tag">{{ n.num }}</text>
            <text class="num-desc">{{ n.desc }}</text>
          </view>
        </view>
      </view>

      <view class="detail-section">
        <text class="section-title">业务特色</text>
        <view
          v-for="(f, i) in activeCarrier.features"
          :key="i"
          class="feature-row"
        >
          <view class="feature-icon-wrap">
            <text class="feature-icon">{{ f.icon }}</text>
          </view>
          <view class="feature-info">
            <text class="feature-name">{{ f.name }}</text>
            <text class="feature-desc">{{ f.desc }}</text>
          </view>
        </view>
      </view>

      <view class="detail-section">
        <text class="section-title">客服热线</text>
        <view class="hotline-block">
          <text class="hotline-num">{{ activeCarrier.hotline }}</text>
          <text class="hotline-tip">全国统一服务热线</text>
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

const activeTab = ref('mobile');

const tabs = [
  { key: 'mobile', name: '中国移动' },
  { key: 'unicom', name: '中国联通' },
  { key: 'telecom', name: '中国电信' },
  { key: 'virtual', name: '虚拟运营商' },
];

const carriers = ref({
  mobile: {
    name: '中国移动 China Mobile',
    short: '移',
    slogan: '移动改变生活',
    gradient: 'linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%)',
    intro: '中国移动通信集团有限公司是国内规模最大的电信运营商，提供移动通信、宽带和数字化服务。覆盖范围最广，基站数量最多，4G/5G 网络全面覆盖城乡。',
    numbers: [
      { num: '134-139', desc: '全球通主号段，覆盖全部地区' },
      { num: '147', desc: '数据卡专用号段' },
      { num: '150-152', desc: '动感地带品牌' },
      { num: '157-159', desc: '动感地带品牌' },
      { num: '178', desc: '4G 飞享系列' },
      { num: '182-184', desc: '4G 飞享系列' },
      { num: '187-188', desc: '全球通高端系列' },
      { num: '195', desc: '5G 专享号段' },
      { num: '197', desc: '5G 专享号段' },
    ],
    features: [
      { icon: '📡', name: '网络覆盖', desc: '基站数量超 500 万，覆盖全国 99% 人口' },
      { icon: '📱', name: '5G 领先', desc: '5G 基站数全球第一，速率行业领先' },
      { icon: '🌍', name: '国际漫游', desc: '覆盖 200+ 国家和地区，资费透明' },
      { icon: '💎', name: '全球通 VIP', desc: '高端客户服务，专属经理' },
    ],
    hotline: '10086',
  },
  unicom: {
    name: '中国联通 China Unicom',
    short: '通',
    slogan: '联通世界 创享美好',
    gradient: 'linear-gradient(135deg, #FF8A65 0%, #E64A19 100%)',
    intro: '中国联合网络通信集团有限公司是国内三大基础电信运营商之一，主营移动通信、宽带互联网和 ICT 服务。iPhone 长期合作运营商，3G 网络速度业内领先。',
    numbers: [
      { num: '130-132', desc: '如意通主号段' },
      { num: '155-156', desc: '如意通品牌' },
      { num: '166', desc: '4G 沃系列' },
      { num: '167', desc: '虚商合作号段' },
      { num: '1704/1707/1709', desc: '虚商专用' },
      { num: '171', desc: '虚商专用' },
      { num: '175-176', desc: '4G 沃系列' },
      { num: '185-186', desc: '如意通高端' },
      { num: '196', desc: '5G 专享号段' },
    ],
    features: [
      { icon: '📡', name: '网络覆盖', desc: '基站数量超 250 万，覆盖城乡' },
      { icon: '🚀', name: '网速优势', desc: 'WCDMA/FDD-LTE 速率业内领先' },
      { icon: '🍎', name: 'iPhone 友好', desc: 'iPhone 长期合作运营商' },
      { icon: '🎮', name: '腾讯王卡', desc: '腾讯应用免流服务' },
    ],
    hotline: '10010',
  },
  telecom: {
    name: '中国电信 China Telecom',
    short: '电',
    slogan: '用户至上 用心服务',
    gradient: 'linear-gradient(135deg, #9575CD 0%, #5E35B1 100%)',
    intro: '中国电信集团有限公司是国内领先的综合信息服务提供商，主营移动通信、宽带互联网和云服务。宽带业务覆盖最广，5G 建设速度行业领先。',
    numbers: [
      { num: '133', desc: '天翼主号段' },
      { num: '149', desc: '数据卡专用' },
      { num: '153', desc: '天翼主号段' },
      { num: '162', desc: '虚商合作' },
      { num: '1700/1701/1702', desc: '虚商专用' },
      { num: '173', desc: '4G 翼系列' },
      { num: '17400-17405', desc: '卫星电话' },
      { num: '177', desc: '4G 翼系列' },
      { num: '180-181', desc: '天翼高端' },
      { num: '189-191', desc: '天翼高端' },
      { num: '193', desc: '5G 专享号段' },
    ],
    features: [
      { icon: '📡', name: '网络覆盖', desc: '基站数量超 280 万，覆盖城乡' },
      { icon: '☁️', name: '云服务', desc: '天翼云行业领先' },
      { icon: '📺', name: 'IPTV', desc: '全国 IPTV 业务' },
      { icon: '🏠', name: '智慧家庭', desc: '全屋智能解决方案' },
    ],
    hotline: '10000',
  },
  virtual: {
    name: '虚拟运营商',
    short: '虚',
    slogan: '民营资本入局通信',
    gradient: 'linear-gradient(135deg, #81C784 0%, #388E3C 100%)',
    intro: '虚拟运营商（MVNO）租用三大基础运营商网络，提供个性化通信服务。资费灵活，套餐创新，但号码资源相对有限，主要面向细分市场。',
    numbers: [
      { num: '1700/1701/1702', desc: '中国电信合作' },
      { num: '1703/1705/1706', desc: '中国移动合作' },
      { num: '1704/1707/1708/1709', desc: '中国联通合作' },
      { num: '171', desc: '中国联通合作' },
      { num: '162', desc: '中国电信合作' },
      { num: '165', desc: '中国移动合作' },
      { num: '167', desc: '中国联通合作' },
      { num: '191', desc: '中国电信合作' },
    ],
    features: [
      { icon: '💡', name: '套餐灵活', desc: '资费定制，满足细分需求' },
      { icon: '🎁', name: '创新业务', desc: '如阿里、京东、小米等品牌号' },
      { icon: '⚠️', name: '注意识别', desc: '骚扰电话多发号段，需谨慎' },
      { icon: '📋', name: '实名要求', desc: '需严格实名认证使用' },
    ],
    hotline: '视具体品牌而定',
  },
});

const activeCarrier = computed(() => carriers.value[activeTab.value as keyof typeof carriers.value]);
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

/* Tab */
.carrier-tabs {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-md;
  padding: 8rpx;
  gap: 4rpx;
}

.carrier-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: $radius-sm;
}

.carrier-tab.active {
  background: $info;
}

.tab-name {
  font-size: 24rpx;
  color: $text-secondary;
}

.carrier-tab.active .tab-name {
  color: #fff;
  font-weight: 600;
}

/* 详情 */
.carrier-detail {
  margin: 20rpx 24rpx 0;
}

.detail-header {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
  border-radius: $radius-lg;
  margin-bottom: 16rpx;
}

.detail-logo {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.detail-logo-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.detail-title-block {
  flex: 1;
}

.detail-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.detail-slogan {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.detail-section {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  margin-bottom: 16rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.section-content {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.8;
}

.num-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.num-item {
  display: flex;
  flex-direction: column;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 14rpx 16rpx;
}

.num-tag {
  font-size: 24rpx;
  color: $info;
  font-weight: 600;
  font-family: monospace;
  margin-bottom: 4rpx;
}

.num-desc {
  font-size: 20rpx;
  color: $text-tertiary;
  line-height: 1.4;
}

.feature-row {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.feature-row:last-child {
  border-bottom: none;
}

.feature-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  background: $bg-grey;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 32rpx;
}

.feature-info {
  flex: 1;
}

.feature-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.feature-desc {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.5;
}

.hotline-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  background: $bg-grey;
  border-radius: $radius-md;
}

.hotline-num {
  font-size: 48rpx;
  font-weight: 700;
  color: $info;
  font-family: monospace;
  letter-spacing: 2rpx;
  margin-bottom: 4rpx;
}

.hotline-tip {
  font-size: 22rpx;
  color: $text-tertiary;
}
</style>
