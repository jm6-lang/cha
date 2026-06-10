<template>
  <view class="page">
    <!-- 绿色头部区域 -->
    <view class="header-section">
      <!-- 状态栏占位 -->
      <view :style="{ height: statusBarHeight + 'px' }" />
      <!-- 品牌栏 -->
      <view class="brand-bar">
        <view class="brand-left">
          <view class="brand-logo">数</view>
          <view class="brand-info">
            <text class="brand-name">数查</text>
            <text class="brand-domain">shucha.com</text>
          </view>
        </view>
        <view class="brand-right">
          <view class="brand-tag">大家都在用</view>
        </view>
      </view>
      <!-- 标语 -->
      <view class="tag-lines">
        <text class="tag-line">大家都在用的号码标记查询工具</text>
      </view>
      <!-- 搜索Tab切换 -->
      <view class="search-tabs">
        <view
          v-for="(tab, i) in searchTabs"
          :key="i"
          class="search-tab"
          :class="{ active: activeTab === i }"
          @tap="activeTab = i"
        >
          <text class="search-tab-text">{{ tab.name }}</text>
          <view v-if="activeTab === i" class="search-tab-indicator" />
        </view>
      </view>
      <!-- 搜索框 -->
      <view class="search-area">
        <view class="search-box">
          <view class="search-icon-wrap">
            <text class="search-icon">&#128269;</text>
          </view>
          <input
            v-model="searchValue"
            class="search-input"
            :placeholder="searchTabs[activeTab].placeholder"
            placeholder-class="search-placeholder"
            :maxlength="activeTab === 0 ? 13 : 30"
            confirm-type="search"
            @confirm="onSearch"
          />
          <view v-if="searchValue" class="search-clear" @tap="searchValue = ''">
            <text class="clear-icon">&#10005;</text>
          </view>
          <view class="search-btn" @tap="onSearch">
            <text class="search-btn-text">查询</text>
          </view>
        </view>
      </view>
      <!-- 底部圆角过渡 -->
      <view class="header-bottom" />
    </view>

    <!-- 功能分类宫格 -->
    <view class="func-section">
      <view class="func-grid">
        <view
          v-for="(cat, i) in categories"
          :key="i"
          class="func-item"
          @tap="onCategoryTap(cat)"
        >
          <view class="func-icon-wrap" :style="{ background: cat.bgColor }">
            <text class="func-icon">{{ cat.icon }}</text>
          </view>
          <text class="func-name">{{ cat.name }}</text>
        </view>
      </view>
    </view>

    <!-- 热门服务 -->
    <view class="service-section">
      <view class="section-header">
        <text class="section-title">热门服务</text>
        <text class="section-more" @tap="showAllServices = !showAllServices">
          {{ showAllServices ? '收起' : '全部' }} ›
        </text>
      </view>
      <view class="service-list">
        <view
          v-for="(svc, i) in displayServices"
          :key="i"
          class="service-item"
          @tap="onServiceTap(svc)"
        >
          <view class="svc-left">
            <view class="svc-icon-wrap" :style="{ background: svc.bgColor }">
              <text class="svc-icon">{{ svc.icon }}</text>
            </view>
            <view class="svc-info">
              <view class="svc-name-row">
                <text class="svc-name">{{ svc.name }}</text>
                <view v-if="svc.tag" class="svc-tag" :style="{ background: svc.tagBg, color: svc.tagColor }">
                  <text class="svc-tag-text">{{ svc.tag }}</text>
                </view>
              </view>
              <text class="svc-desc">{{ svc.desc }}</text>
            </view>
          </view>
          <view class="svc-right">
            <text class="svc-price" v-if="svc.price">¥{{ svc.price }}</text>
            <text class="svc-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 实用工具 -->
    <view class="tool-section">
      <view class="section-header">
        <text class="section-title">实用工具</text>
      </view>
      <view class="tool-list">
        <view class="tool-item" @tap="goTool('ip')">
          <view class="tool-icon" style="background: #E3F2FD">🌐</view>
          <text class="tool-name">IP 归属地</text>
          <text class="tool-desc">免费查询</text>
        </view>
        <view class="tool-item" @tap="goTool('idcard')">
          <view class="tool-icon" style="background: #E8F5E9">🪪</view>
          <text class="tool-name">身份证查询</text>
          <text class="tool-desc">免费查询</text>
        </view>
        <view class="tool-item" @tap="goTool('weather')">
          <view class="tool-icon" style="background: #E0F7FA">☀️</view>
          <text class="tool-name">天气查询</text>
          <text class="tool-desc">免费查询</text>
        </view>
        <view class="tool-item" @tap="onShare">
          <view class="tool-icon" style="background: #FFF3E0">📤</view>
          <text class="tool-name">分享好友</text>
          <text class="tool-desc">邀请有奖</text>
        </view>
      </view>
    </view>

    <!-- 公告栏 -->
    <view class="notice-bar">
      <text class="notice-icon">&#128227;</text>
      <view class="notice-scroll">
        <text class="notice-text">{{ noticeText }}</text>
      </view>
    </view>

    <!-- 查询历史快捷入口 -->
    <view class="history-section" v-if="recentQueries.length > 0">
      <view class="section-header">
        <text class="section-title">最近查询</text>
        <text class="section-more" @tap="goHistory">更多 ›</text>
      </view>
      <view class="history-list">
        <view
          v-for="(q, i) in recentQueries.slice(0, 3)"
          :key="i"
          class="history-item"
          @tap="reQuery(q)"
        >
          <text class="history-number">{{ q.number }}</text>
          <text class="history-info">{{ q.province }} {{ q.carrier }}</text>
        </view>
      </view>
    </view>

    <!-- 底部安全距离 -->
    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { queryPhoneLocation, queryPhoneLabels } from '@/api/free-apis';

const statusBarHeight = ref(44);
const searchValue = ref('');
const activeTab = ref(0);
const showAllServices = ref(false);
const noticeText = ref('数查 - 专业号码标记查询平台，查号码用数查');
const recentQueries = ref<Array<{ number: string; province: string; carrier: string }>>([]);

// 获取状态栏高度
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

// 搜索Tab
const searchTabs = [
  { name: '查标记', placeholder: '请输入手机号码', bizType: 'PHONE_LABEL' },
  { name: '查关系', placeholder: '请输入公司名称', bizType: 'COMPANY_INFO' },
];

// 8大功能分类 - 完全对标号查查
const categories = [
  { name: '身份核验', icon: '🛡️', bgColor: '#E8F5E9', typeCode: 'identity' },
  { name: '号码服务', icon: '📱', bgColor: '#E3F2FD', typeCode: 'carrier' },
  { name: '婚姻情感', icon: '💍', bgColor: '#FCE4EC', typeCode: 'marriage' },
  { name: '司法涉诉', icon: '⚖️', bgColor: '#F3E5F5', typeCode: 'risk' },
  { name: '金融风控', icon: '💳', bgColor: '#E0F7FA', typeCode: 'finance' },
  { name: '车辆查询', icon: '🚗', bgColor: '#FFF3E0', typeCode: 'car' },
  { name: '企业查询', icon: '🏢', bgColor: '#E8EAF6', typeCode: 'package' },
  { name: '专业报告', icon: '📊', bgColor: '#F1F8E9', typeCode: 'report' },
];

// 热门服务列表
const allServices = [
  // 号码服务
  { name: '号码标记查询', icon: '📱', bgColor: '#E3F2FD', desc: '查询手机号码的标记信息', price: '', tag: '免费', tagBg: '#E8F8EF', tagColor: '#07C160', typeCode: 'carrier' },
  { name: '号码归属地', icon: '📍', bgColor: '#E3F2FD', desc: '查询手机号码归属地信息', price: '', tag: '免费', tagBg: '#E8F8EF', tagColor: '#07C160', typeCode: 'carrier' },
  { name: '清除标记', icon: '✅', bgColor: '#E8F5E9', desc: '消除错误标记，恢复号码信誉', price: '5-28', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'carrier' },
  { name: '号码估值', icon: '💎', bgColor: '#FFF3E0', desc: '靓号评估与价值分析', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
  // 身份核验
  { name: '实名核验', icon: '🪪', bgColor: '#E8F5E9', desc: '验证姓名与身份证号是否匹配', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
  { name: '人像比对', icon: '📷', bgColor: '#E8F5E9', desc: '身份证照片与本人人脸比对', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
  // 婚姻情感
  { name: '婚姻状态查询', icon: '💍', bgColor: '#FCE4EC', desc: '查询个人婚姻登记状态', price: '2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'marriage' },
  { name: '婚恋交友核验', icon: '💑', bgColor: '#FCE4EC', desc: '核实对方真实身份与婚姻状况', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
  // 司法涉诉
  { name: '司法诉讼查询', icon: '⚖️', bgColor: '#F3E5F5', desc: '查询个人或企业涉诉信息', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
  { name: '失信被执行人', icon: '🚫', bgColor: '#FFEBEE', desc: '查询老赖失信被执行人信息', price: '2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'risk' },
  { name: '限制高消费', icon: '⛔', bgColor: '#FFEBEE', desc: '查询限制高消费人员信息', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
  // 金融风控
  { name: '个人信用报告', icon: '📊', bgColor: '#E0F7FA', desc: '全面个人信用风险评估报告', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
  { name: '多头借贷检测', icon: '🔍', bgColor: '#E0F7FA', desc: '检测是否存在多头借贷行为', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
  // 车辆查询
  { name: '车辆信息查询', icon: '🚗', bgColor: '#FFF3E0', desc: '查询车辆基本信息与状态', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
  { name: '车辆违章查询', icon: '🚕', bgColor: '#FFF3E0', desc: '查询车辆违章记录', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
  // 企业查询
  { name: '企业工商信息', icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业工商注册详细信息', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
  { name: '企业关联关系', icon: '🔗', bgColor: '#E8EAF6', desc: '查询企业股东与投资关系', price: '2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
  // 专业报告
  { name: '深度背调报告', icon: '📋', bgColor: '#F1F8E9', desc: '全面个人背景调查报告', price: '5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'report' },
  { name: '企业尽调报告', icon: '📊', bgColor: '#F1F8E9', desc: '企业尽职调查深度报告', price: '5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'report' },
];

const displayServices = computed(() => {
  return showAllServices.value ? allServices : allServices.slice(0, 6);
});

function onSearch() {
  const val = searchValue.value.trim();
  if (!val) {
    uni.showToast({ title: '请输入查询内容', icon: 'none' });
    return;
  }
  if (activeTab.value === 0) {
    // 查标记 - 手机号码
    if (val.length < 7 || val.length > 13) {
      uni.showToast({ title: '请输入7-13位号码', icon: 'none' });
      return;
    }
    // 直接调用本地查询（免费服务，零延迟）
    const result = queryPhoneLabels(val);
    // 保存到本地历史
    saveHistory(val, result.province, result.carrier, result.labels.length);
    uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(val)}&_t=${Date.now()}` });
  } else {
    // 查关系 - 公司名称
    const info = queryCompanyInfo(val);
    uni.navigateTo({ url: `/pages/hcc/company-result?companyName=${encodeURIComponent(val)}&_t=${Date.now()}` });
  }
}

function saveHistory(number: string, province: string, carrier: string, labelCount: number) {
  try {
    const list: any[] = uni.getStorageSync('shucha_history') || [];
    // 去重
    const filtered = list.filter(x => x.number !== number);
    filtered.unshift({
      id: Date.now(),
      number,
      province,
      city: '',
      carrier,
      labelCount,
      createTime: new Date().toISOString(),
    });
    uni.setStorageSync('shucha_history', filtered.slice(0, 50));
    // 同步更新首页显示
    recentQueries.value = filtered.slice(0, 3);
  } catch (e) {
    console.error('save history failed', e);
  }
}

function onCategoryTap(cat: any) {
  uni.navigateTo({ url: `/pages/hcc/func-category?typeCode=${cat.typeCode}` });
}

function onServiceTap(svc: any) {
  if (svc.typeCode === 'carrier' && (svc.name === '号码标记查询' || svc.name === '号码归属地')) {
    // 聚焦搜索框
    activeTab.value = 0;
    return;
  }
  uni.navigateTo({ url: `/pages/hcc/func-query?typeCode=${svc.typeCode}&name=${encodeURIComponent(svc.name)}` });
}

function goHistory() {
  uni.navigateTo({ url: '/pages/hcc/history' });
}

function goTool(type: string) {
  const map: Record<string, string> = {
    ip: '/pages/tool/ip-query',
    idcard: '/pages/tool/idcard-query',
    weather: '/pages/tool/weather-query',
  };
  const url = map[type];
  if (url) uni.navigateTo({ url });
}

function onShare() {
  uni.navigateTo({ url: '/pages/share/poster' });
}

function reQuery(q: any) {
  uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(q.number)}` });
}

onShow(() => {
  // 加载最近查询
  try {
    const h = uni.getStorageSync('shucha_history');
    if (h) {
      const list = JSON.parse(h);
      recentQueries.value = list.slice(0, 3);
    }
  } catch (e) {}
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* ===== 绿色头部区域 ===== */
.header-section {
  background: linear-gradient(180deg, #07C160 0%, #06AD56 100%);
  padding-bottom: 0;
  position: relative;
}

.brand-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 32rpx 8rpx;
}

.brand-left {
  display: flex;
  align-items: center;
}

.brand-logo {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  margin-right: 16rpx;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2rpx;
}

.brand-domain {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2rpx;
}

.brand-right {
  display: flex;
  align-items: center;
}

.brand-tag {
  background: #FF3B30;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-weight: 500;
}

.tag-lines {
  padding: 8rpx 32rpx 16rpx;
}

.tag-line {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 搜索Tab */
.search-tabs {
  display: flex;
  padding: 0 32rpx;
  gap: 48rpx;
}

.search-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12rpx;
  position: relative;
}

.search-tab-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.search-tab.active .search-tab-text {
  color: #fff;
  font-weight: 700;
}

.search-tab-indicator {
  width: 40rpx;
  height: 6rpx;
  background: #fff;
  border-radius: 3rpx;
  margin-top: 8rpx;
}

/* 搜索框 */
.search-area {
  padding: 16rpx 32rpx 32rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  padding: 0 8rpx 0 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.search-icon-wrap {
  margin-right: 12rpx;
}

.search-icon {
  font-size: 32rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  font-size: 30rpx;
  color: $text-primary;
}

.search-placeholder {
  color: $text-tertiary;
  font-size: 28rpx;
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
}

.clear-icon {
  font-size: 24rpx;
  color: $text-tertiary;
}

.search-btn {
  background: #00b35e;
  border-radius: 999rpx;
  padding: 0 40rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

/* 头部底部圆角过渡 */
.header-bottom {
  height: 32rpx;
  background: $bg-page;
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -1rpx;
}

/* ===== 功能分类宫格 ===== */
.func-section {
  margin: -16rpx 24rpx 0;
  position: relative;
  z-index: 10;
}

.func-grid {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx 16rpx 24rpx;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.func-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.func-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.func-icon {
  font-size: 44rpx;
}

.func-name {
  font-size: 24rpx;
  color: $text-primary;
  font-weight: 500;
}

/* ===== 热门服务 ===== */
.service-section {
  margin: 24rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.section-more {
  font-size: 24rpx;
  color: $text-tertiary;
}

.service-list {
  display: flex;
  flex-direction: column;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;
}

.service-item:last-child {
  border-bottom: none;
}

.svc-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.svc-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.svc-icon {
  font-size: 36rpx;
}

.svc-info {
  flex: 1;
  min-width: 0;
}

.svc-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.svc-name {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
}

.svc-tag {
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.svc-tag-text {
  font-size: 20rpx;
  font-weight: 500;
}

.svc-desc {
  font-size: 24rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.svc-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.svc-price {
  font-size: 28rpx;
  color: $danger;
  font-weight: 600;
  margin-right: 8rpx;
}

.svc-arrow {
  color: $text-tertiary;
  font-size: 32rpx;
}

/* 实用工具 */
.tool-section {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.tool-list {
  display: flex;
  margin-top: 16rpx;
}

.tool-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 0;
}

.tool-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-bottom: 4rpx;
}

.tool-name {
  font-size: 26rpx;
  font-weight: 500;
  color: $text-primary;
}

.tool-desc {
  font-size: 20rpx;
  color: $text-tertiary;
}

/* ===== 公告栏 ===== */
.notice-bar {
  display: flex;
  align-items: center;
  margin: 24rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-md;
  padding: 16rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.notice-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.notice-scroll {
  flex: 1;
  overflow: hidden;
}

.notice-text {
  font-size: 24rpx;
  color: $text-secondary;
}

/* ===== 查询历史 ===== */
.history-section {
  margin: 24rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border;
}

.history-item:last-child {
  border-bottom: none;
}

.history-number {
  font-size: 30rpx;
  color: $primary;
  font-weight: 500;
}

.history-info {
  font-size: 24rpx;
  color: $text-tertiary;
}

/* 底部安全距离 */
.safe-bottom {
  height: 120rpx;
}
</style>
