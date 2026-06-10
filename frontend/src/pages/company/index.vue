<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏢</view>
        <text class="header-title">企业大全</text>
        <text class="header-desc">热门企业 行业分类 上市公司</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索企业名称"
          placeholder-class="placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="industry-list">
      <text class="section-title">行业分类</text>
      <view class="industry-grid">
        <view
          v-for="i in industries"
          :key="i.name"
          class="industry-item"
          :style="{ background: i.color }"
          @tap="onPickIndustry(i)"
        >
          <text class="industry-icon">{{ i.icon }}</text>
          <text class="industry-name">{{ i.name }}</text>
          <text class="industry-count">{{ i.count }}</text>
        </view>
      </view>
    </view>

    <view class="company-list">
      <text class="section-title">热门企业</text>
      <view
        v-for="c in filteredCompanies"
        :key="c.name"
        class="company-item"
        @tap="onPickCompany(c)"
      >
        <view class="company-logo" :style="{ background: c.color }">
          <text class="logo-text">{{ c.name.substring(0, 1) }}</text>
        </view>
        <view class="company-info">
          <view class="company-name-row">
            <text class="company-name">{{ c.name }}</text>
            <text v-if="c.verified" class="verified-tag">✓ 已认证</text>
          </view>
          <text class="company-meta">{{ c.legal }} · {{ c.capital }} · {{ c.status }}</text>
          <text class="company-meta">成立 {{ c.established }} · {{ c.industry }}</text>
        </view>
        <text class="arrow">›</text>
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

const industries = ref([
  { name: '互联网', icon: '💻', color: '#E3F2FD', count: '85万' },
  { name: '金融', icon: '💰', color: '#FFF3E0', count: '62万' },
  { name: '房地产', icon: '🏘️', color: '#FCE4EC', count: '78万' },
  { name: '制造', icon: '🏭', color: '#E8F5E9', count: '120万' },
  { name: '零售', icon: '🛍️', color: '#F3E5F5', count: '95万' },
  { name: '餐饮', icon: '🍜', color: '#FFF8E1', count: '68万' },
  { name: '医疗', icon: '💊', color: '#E0F7FA', count: '42万' },
  { name: '教育', icon: '📚', color: '#E1F5FE', count: '38万' },
  { name: '物流', icon: '🚚', color: '#F1F8E9', count: '55万' },
  { name: '建筑', icon: '🏗️', color: '#FFF3E0', count: '88万' },
  { name: '能源', icon: '⚡', color: '#FFFDE7', count: '25万' },
  { name: '文化', icon: '🎬', color: '#FCE4EC', count: '32万' },
]);

const companies = ref([
  { name: '阿里巴巴（中国）有限公司', legal: '张勇', capital: '1529.8亿', status: '存续', established: '2007-03-26', industry: '互联网/电商', verified: true, color: '#FF6A00' },
  { name: '腾讯科技（深圳）有限公司', legal: '马化腾', capital: '200亿', status: '存续', established: '2000-02-24', industry: '互联网/游戏', verified: true, color: '#1A6CFF' },
  { name: '华为技术有限公司', legal: '徐直军', capital: '404亿', status: '存续', established: '1987-09-15', industry: '通信设备', verified: true, color: '#E60012' },
  { name: '字节跳动有限公司', legal: '张一鸣', capital: '10亿', status: '存续', established: '2012-03-09', industry: '互联网/资讯', verified: true, color: '#000000' },
  { name: '美团点评集团', legal: '王兴', capital: '100亿', status: '存续', established: '2015-09-25', industry: '本地生活', verified: true, color: '#FFD200' },
  { name: '京东集团股份有限公司', legal: '刘强东', capital: '200亿', status: '存续', established: '2007-04-20', industry: '电商/物流', verified: true, color: '#E1251B' },
  { name: '百度在线网络技术（北京）有限公司', legal: '李彦宏', capital: '128亿', status: '存续', established: '2000-01-18', industry: '搜索引擎', verified: true, color: '#2932E1' },
  { name: '小米科技有限责任公司', legal: '雷军', capital: '185.6亿', status: '存续', established: '2010-03-03', industry: '智能硬件', verified: true, color: '#FF6700' },
  { name: '比亚迪股份有限公司', legal: '王传福', capital: '29.1亿', status: '存续', established: '1995-02-10', industry: '新能源汽车', verified: true, color: '#E60012' },
  { name: '宁德时代新能源科技股份有限公司', legal: '曾毓群', capital: '24.4亿', status: '存续', established: '2011-12-16', industry: '动力电池', verified: true, color: '#00B050' },
]);

const filteredCompanies = computed(() => {
  if (!keyword.value) return companies.value;
  const k = keyword.value.toLowerCase();
  return companies.value.filter(c =>
    c.name.toLowerCase().includes(k) || c.legal.includes(k) || c.industry.includes(k)
  );
});

function onPickIndustry(i: any) {
  uni.showToast({ title: `查看${i.name}行业企业`, icon: 'none' });
}

function onPickCompany(c: any) {
  uni.navigateTo({ url: `/pages/company/detail?name=${encodeURIComponent(c.name)}` });
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

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin: 24rpx 24rpx 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $primary;
  line-height: 1;
}

/* 行业 */
.industry-list {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  padding: 8rpx 0;
}

.industry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
  padding: 16rpx;
}

.industry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  border-radius: $radius-md;
}

.industry-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.industry-name {
  font-size: 24rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 2rpx;
}

.industry-count {
  font-size: 18rpx;
  color: $text-tertiary;
}

/* 企业列表 */
.company-list {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  overflow: hidden;
}

.company-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid $border-light;
}

.company-item:last-child {
  border-bottom: none;
}

.company-logo {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.logo-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.company-info {
  flex: 1;
  min-width: 0;
}

.company-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 6rpx;
}

.company-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  max-width: 380rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verified-tag {
  font-size: 18rpx;
  color: $primary;
  background: rgba(7, 193, 96, 0.1);
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  flex-shrink: 0;
}

.company-meta {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.6;
}

.arrow {
  font-size: 36rpx;
  color: $text-tertiary;
  font-weight: 300;
  flex-shrink: 0;
  margin-left: 12rpx;
}
</style>
