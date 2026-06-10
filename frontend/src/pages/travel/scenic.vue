<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🗺️</view>
        <text class="header-title">景点门票</text>
        <text class="header-desc">5A · 4A · 全国景区</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入景区/城市/省份" placeholder-class="placeholder" @confirm="onSearch" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询景区...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && spots.length === 0 && !error" class="empty">
      <text class="empty-icon">🗺️</text>
      <text class="empty-text">输入景区/城市开始查询</text>
    </view>

    <view class="spot-list">
      <view v-for="(s, i) in spots" :key="i" class="spot-card">
        <view class="spot-cover">{{ s.cover || s.name.charAt(0) }}</view>
        <view class="spot-info">
          <view class="spot-name-row">
            <text class="spot-name">{{ s.name }}</text>
            <text class="spot-level" :class="levelClass(s.level)">{{ s.level }}</text>
          </view>
          <text class="spot-addr">📍 {{ s.address || s.area }}</text>
          <text class="spot-intro" v-if="s.intro">{{ s.intro }}</text>
          <view class="spot-bottom" v-if="s.price">
            <text class="price">¥{{ s.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryScenic, type ScenicSpot } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const loading = ref(false);
const error = ref('');
const spots = ref<ScenicSpot[]>([]);

const levelClass = (l: string) => {
  if (l.includes('5A')) return 'lv-5a';
  if (l.includes('4A')) return 'lv-4a';
  if (l.includes('3A')) return 'lv-3a';
  return '';
};

const onSearch = async () => {
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入景区', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const r = await queryScenic(keyword.value.trim());
    if (!r) {
      // 兜底示例数据
      spots.value = mockScenic(keyword.value.trim());
      error.value = '';
    } else {
      spots.value = r;
    }
  } catch (e) {
    error.value = '查询失败，请重试';
  } finally {
    loading.value = false;
  }
};

const mockScenic = (k: string): ScenicSpot[] => [
  { name: `${k} 著名景区 A`, level: '5A', area: '北京', address: '北京市xxx路1号', score: '4.8', price: '60', intro: 'AAAAA级景区，自然风光秀丽' },
  { name: `${k} 著名景区 B`, level: '4A', area: '上海', address: '上海市xxx路88号', score: '4.6', price: '40', intro: 'AAAA景区，人文底蕴深厚' },
  { name: `${k} 著名景区 C`, level: '4A', area: '杭州', address: '杭州市xxx景区', score: '4.7', price: '免费', intro: 'AAAA景区，风景如画' },
];
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #00BCD4, #4DD0E1); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.empty { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 100rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
.spot-list { padding: 24rpx; }
.spot-card { background: #fff; border-radius: 20rpx; padding: 20rpx; margin-bottom: 20rpx; display: flex; }
.spot-cover { width: 160rpx; height: 160rpx; background: linear-gradient(135deg, #00BCD4, #4DD0E1); border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 80rpx; color: #fff; font-weight: 700; flex-shrink: 0; }
.spot-info { flex: 1; margin-left: 20rpx; min-width: 0; }
.spot-name-row { display: flex; justify-content: space-between; align-items: center; }
.spot-name { font-size: 28rpx; color: $text-primary; font-weight: 700; flex: 1; min-width: 0; }
.spot-level { font-size: 20rpx; color: #fff; background: linear-gradient(135deg, #FF5252, #FF7676); padding: 4rpx 12rpx; border-radius: 6rpx; flex-shrink: 0; margin-left: 8rpx; }
.spot-level.lv-5a { background: linear-gradient(135deg, #FF5252, #FF7676); }
.spot-level.lv-4a { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.spot-level.lv-3a { background: linear-gradient(135deg, #4CAF50, #81C784); }
.spot-addr { font-size: 22rpx; color: $text-tertiary; display: block; margin: 6rpx 0; }
.spot-intro { font-size: 22rpx; color: $text-secondary; line-height: 1.5; display: block; margin: 6rpx 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.spot-bottom { margin-top: 10rpx; }
.price { font-size: 30rpx; color: $danger; font-weight: 700; }
</style>
