<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚄</view>
        <text class="header-title">12306 候车室</text>
        <text class="header-desc">实时车次 · 候车室 · 检票口</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="city" class="search-input" placeholder="输入城市（如 长春、上海）" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="hot-cities">
      <text class="hc-label">热门城市：</text>
      <view v-for="c in hotCities" :key="c" class="hc-item" @tap="quickQuery(c)">{{ c }}</view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询车次...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result && schedules.length" class="content">
      <view class="summary-card">
        <text class="sc-station">🚉 {{ result.station }}</text>
        <text class="sc-meta">当日车次：{{ result.totalTrains }} · 当前第 {{ result.page }} / {{ result.totalPages }} 页</text>
      </view>

      <view class="train-list">
        <view v-for="(t, i) in schedules" :key="i" class="train-item">
          <view class="train-top">
            <text class="t-no">{{ t.trainNo }}</text>
            <text class="t-status">{{ t.status }}</text>
          </view>
          <view class="train-route">
            <view class="route-col">
              <text class="r-station">{{ t.fromStation }}</text>
              <text class="r-time">{{ formatTime(t.departTime) }}</text>
            </view>
            <text class="route-arrow">→</text>
            <view class="route-col right">
              <text class="r-station">{{ t.toStation }}</text>
            </view>
          </view>
          <view v-if="t.waitingRoom" class="train-room">
            <text class="room-icon">🪪</text>
            <text class="room-text">{{ t.waitingRoom }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!loading && !error && searched && schedules.length === 0" class="empty">
      <text class="empty-icon">🚄</text>
      <text class="empty-text">未查询到该城市的当日车次</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryTrainBoard, type TrainStationResult, type TrainSchedule } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const city = ref('长春');
const loading = ref(false);
const error = ref('');
const result = ref<TrainStationResult | null>(null);
const schedules = ref<TrainSchedule[]>([]);
const searched = ref(false);

const hotCities = ['北京', '上海', '广州', '深圳', '成都', '武汉', '杭州', '南京', '西安', '重庆', '长春', '哈尔滨', '沈阳'];

const formatTime = (s: string) => {
  if (!s) return '';
  const m = s.match(/(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : s;
};

const loadData = async (c?: string) => {
  const queryCity = c || city.value.trim();
  if (!queryCity) {
    uni.showToast({ title: '请输入城市', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  schedules.value = [];
  result.value = null;
  searched.value = true;
  try {
    const r = await queryTrainBoard(queryCity);
    if (!r) error.value = '查询失败，请稍后重试';
    else {
      result.value = r;
      schedules.value = r.schedules;
    }
  } catch (e) {
    error.value = '查询异常';
  } finally {
    loading.value = false;
  }
};

const onSearch = () => loadData();
const quickQuery = (c: string) => { city.value = c; loadData(c); };
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #D32F2F, #F44336); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: 24rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #D32F2F, #F44336); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.hot-cities { display: flex; align-items: center; flex-wrap: wrap; gap: 12rpx; padding: 16rpx 24rpx 0; }
.hc-label { font-size: 22rpx; color: $text-tertiary; }
.hc-item { font-size: 22rpx; color: $info; background: rgba(26,108,255,0.08); padding: 6rpx 18rpx; border-radius: 18rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 24rpx 24rpx 0; }
.summary-card { background: linear-gradient(135deg, rgba(211,47,47,0.08), rgba(244,67,54,0.04)); border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; }
.sc-station { display: block; font-size: 30rpx; color: $text-primary; font-weight: 700; margin-bottom: 6rpx; }
.sc-meta { display: block; font-size: 22rpx; color: $text-tertiary; }
.train-list { display: flex; flex-direction: column; gap: 16rpx; }
.train-item { background: #fff; border-radius: 20rpx; padding: 24rpx; }
.train-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.t-no { font-size: 32rpx; color: #D32F2F; font-weight: 700; font-family: monospace; }
.t-status { font-size: 22rpx; color: $primary; background: rgba(7,193,96,0.12); padding: 4rpx 14rpx; border-radius: 14rpx; }
.train-route { display: flex; align-items: center; padding: 8rpx 0; gap: 16rpx; }
.route-col { flex: 1; display: flex; flex-direction: column; }
.route-col.right { align-items: flex-end; }
.r-station { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.r-time { font-size: 24rpx; color: $text-tertiary; margin-top: 4rpx; }
.route-arrow { font-size: 36rpx; color: $text-tertiary; }
.train-room { margin-top: 12rpx; padding: 12rpx 16rpx; background: $bg-page; border-radius: 10rpx; display: flex; align-items: center; }
.room-icon { font-size: 24rpx; margin-right: 8rpx; }
.room-text { font-size: 24rpx; color: $text-secondary; }
.empty { text-align: center; padding: 100rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 100rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
