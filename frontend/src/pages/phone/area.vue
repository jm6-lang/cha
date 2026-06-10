<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🗺️</view>
        <text class="header-title">地区号码</text>
        <text class="header-desc">按省份/城市查询号段</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索省份或城市"
          placeholder-class="placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="region-list">
      <view
        v-for="region in filteredRegions"
        :key="region.name"
        class="region-item"
        @tap="onPickRegion(region)"
      >
        <view class="region-flag" :style="{ background: region.color }">
          <text class="flag-text">{{ region.short }}</text>
        </view>
        <view class="region-info">
          <text class="region-name">{{ region.name }}</text>
          <text class="region-meta">{{ region.count }}号码 · {{ region.carriers }}</text>
        </view>
        <text class="region-arrow">›</text>
      </view>
    </view>

    <view v-if="filteredRegions.length === 0" class="empty-wrap">
      <text class="empty-icon">🔍</text>
      <text class="empty-text">未找到相关地区</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const keyword = ref('');

const regions = ref([
  { name: '北京', short: '京', color: '#E91E63', count: '3.2亿', carriers: '移动/联通/电信' },
  { name: '上海', short: '沪', color: '#9C27B0', count: '2.8亿', carriers: '移动/联通/电信' },
  { name: '天津', short: '津', color: '#673AB7', count: '1.5亿', carriers: '移动/联通/电信' },
  { name: '重庆', short: '渝', color: '#3F51B5', count: '1.8亿', carriers: '移动/联通/电信' },
  { name: '河北', short: '冀', color: '#2196F3', count: '2.4亿', carriers: '移动/联通/电信' },
  { name: '山西', short: '晋', color: '#03A9F4', count: '1.3亿', carriers: '移动/联通/电信' },
  { name: '内蒙古', short: '蒙', color: '#00BCD4', count: '9000万', carriers: '移动/联通/电信' },
  { name: '辽宁', short: '辽', color: '#009688', count: '1.6亿', carriers: '移动/联通/电信' },
  { name: '吉林', short: '吉', color: '#4CAF50', count: '8500万', carriers: '移动/联通/电信' },
  { name: '黑龙江', short: '黑', color: '#8BC34A', count: '1.1亿', carriers: '移动/联通/电信' },
  { name: '江苏', short: '苏', color: '#CDDC39', count: '3.0亿', carriers: '移动/联通/电信' },
  { name: '浙江', short: '浙', color: '#FFEB3B', count: '2.7亿', carriers: '移动/联通/电信' },
  { name: '安徽', short: '皖', color: '#FFC107', count: '1.7亿', carriers: '移动/联通/电信' },
  { name: '福建', short: '闽', color: '#FF9800', count: '1.5亿', carriers: '移动/联通/电信' },
  { name: '江西', short: '赣', color: '#FF5722', count: '1.2亿', carriers: '移动/联通/电信' },
  { name: '山东', short: '鲁', color: '#795548', count: '2.9亿', carriers: '移动/联通/电信' },
  { name: '河南', short: '豫', color: '#607D8B', count: '2.6亿', carriers: '移动/联通/电信' },
  { name: '湖北', short: '鄂', color: '#E91E63', count: '2.0亿', carriers: '移动/联通/电信' },
  { name: '湖南', short: '湘', color: '#9C27B0', count: '1.9亿', carriers: '移动/联通/电信' },
  { name: '广东', short: '粤', color: '#673AB7', count: '4.2亿', carriers: '移动/联通/电信' },
  { name: '广西', short: '桂', color: '#3F51B5', count: '1.4亿', carriers: '移动/联通/电信' },
  { name: '海南', short: '琼', color: '#2196F3', count: '5000万', carriers: '移动/联通/电信' },
  { name: '四川', short: '川', color: '#03A9F4', count: '2.8亿', carriers: '移动/联通/电信' },
  { name: '贵州', short: '黔', color: '#00BCD4', count: '1.0亿', carriers: '移动/联通/电信' },
  { name: '云南', short: '滇', color: '#009688', count: '1.3亿', carriers: '移动/联通/电信' },
  { name: '西藏', short: '藏', color: '#4CAF50', count: '1500万', carriers: '移动/联通/电信' },
  { name: '陕西', short: '陕', color: '#8BC34A', count: '1.4亿', carriers: '移动/联通/电信' },
  { name: '甘肃', short: '甘', color: '#CDDC39', count: '7500万', carriers: '移动/联通/电信' },
  { name: '青海', short: '青', color: '#FFEB3B', count: '2000万', carriers: '移动/联通/电信' },
  { name: '宁夏', short: '宁', color: '#FFC107', count: '3000万', carriers: '移动/联通/电信' },
  { name: '新疆', short: '新', color: '#FF9800', count: '8500万', carriers: '移动/联通/电信' },
]);

const filteredRegions = computed(() => {
  if (!keyword.value) return regions.value;
  const k = keyword.value.toLowerCase();
  return regions.value.filter(r =>
    r.name.includes(k) || r.short === k
  );
});

function onPickRegion(r: any) {
  uni.showToast({ title: `查询${r.name}号段`, icon: 'none' });
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

/* 列表 */
.region-list {
  margin: 20rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
}

.region-item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid $border-light;
}

.region-item:last-child {
  border-bottom: none;
}

.region-flag {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.flag-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.region-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.region-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.region-meta {
  font-size: 22rpx;
  color: $text-tertiary;
}

.region-arrow {
  font-size: 36rpx;
  color: $text-tertiary;
  font-weight: 300;
}

/* 空状态 */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: $text-tertiary;
}
</style>
