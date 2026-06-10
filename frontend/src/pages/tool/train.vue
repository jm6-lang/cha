<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚂</view>
        <text class="header-title">火车票</text>
        <text class="header-desc">车次查询 · 余票 · 时刻</text>
      </view>
    </view>

    <view class="search-card">
      <view class="route-row">
        <view class="station">
          <text class="station-name">北京</text>
        </view>
        <text class="route-arrow">⇄</text>
        <view class="station right">
          <text class="station-name">上海</text>
        </view>
      </view>
      <view class="date-row">
        <text class="date-text">2026-06-15</text>
        <text class="date-text">周一</text>
      </view>
      <view class="search-btn" @tap="onSearch">查 询</view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tab" :class="{ active: activeTab === t }" @tap="activeTab = t">
        <text class="tab-text">{{ t }}</text>
      </view>
    </view>

    <view class="train-list">
      <view v-for="(tr, i) in trains" :key="i" class="train-card">
        <view class="train-top">
          <view class="train-name-wrap">
            <text class="train-num">{{ tr.num }}</text>
            <text class="train-type">{{ tr.type }}</text>
          </view>
          <text class="train-time">{{ tr.depart }} - {{ tr.arrive }}</text>
        </view>
        <view class="train-mid">
          <view class="mid-station">
            <text class="mid-time">{{ tr.departTime }}</text>
            <text class="mid-name">{{ tr.from }}</text>
          </view>
          <view class="mid-arrow">
            <text class="arrow-line">──────</text>
            <text class="arrow-dur">{{ tr.dur }}</text>
          </view>
          <view class="mid-station">
            <text class="mid-time">{{ tr.arriveTime }}</text>
            <text class="mid-name">{{ tr.to }}</text>
          </view>
        </view>
        <view class="train-bottom">
          <text class="seats">余票：{{ tr.seats }}</text>
          <text class="price">¥{{ tr.price }}起</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeTab = ref('全部');
const tabs = ['全部', '高铁', '动车', '特快', '快速'];
const trains = [
  { num: 'G1', type: '高铁', depart: '北京南', arrive: '上海虹桥', departTime: '09:00', arriveTime: '13:28', dur: '4h28m', seats: '有', price: '553' },
  { num: 'G3', type: '高铁', depart: '北京南', arrive: '上海虹桥', departTime: '11:00', arriveTime: '15:28', dur: '4h28m', seats: '有', price: '553' },
  { num: 'G5', type: '高铁', depart: '北京南', arrive: '上海虹桥', departTime: '13:00', arriveTime: '17:28', dur: '4h28m', seats: '无', price: '553' },
  { num: 'D701', type: '动车', depart: '北京南', arrive: '上海', departTime: '20:00', arriveTime: '次日 07:35', dur: '11h35m', seats: '有', price: '309' }
];

const onSearch = () => uni.showToast({ title: '查询中', icon: 'loading' });
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 30rpx 40rpx 30rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 60rpx; margin-bottom: 12rpx; }
.header-title { font-size: 36rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 6rpx; }
.search-card { margin: -20rpx 24rpx 0; background: #fff; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.route-row { display: flex; align-items: center; justify-content: space-between; }
.station { flex: 1; }
.station.right { text-align: right; }
.station-name { font-size: 50rpx; color: $text-primary; font-weight: 700; }
.route-arrow { font-size: 50rpx; color: $info; margin: 0 30rpx; }
.date-row { display: flex; gap: 20rpx; margin-top: 16rpx; padding: 16rpx; background: $bg-page; border-radius: 12rpx; }
.date-text { font-size: 26rpx; color: $text-secondary; }
.search-btn { margin-top: 20rpx; background: linear-gradient(135deg, #1976D2, #42A5F5); color: #fff; font-size: 30rpx; font-weight: 700; text-align: center; padding: 24rpx; border-radius: 16rpx; }
.tabs { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; }
.tab { padding: 12rpx 30rpx; background: #fff; border-radius: 30rpx; }
.tab.active { background: linear-gradient(135deg, #1976D2, #42A5F5); }
.tab-text { font-size: 24rpx; color: $text-secondary; }
.tab.active .tab-text { color: #fff; }
.train-list { padding: 24rpx; }
.train-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.train-top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20rpx; border-bottom: 1rpx dashed $border-color; }
.train-name-wrap { display: flex; align-items: center; gap: 10rpx; }
.train-num { font-size: 32rpx; color: $text-primary; font-weight: 700; }
.train-type { font-size: 20rpx; color: #fff; background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 4rpx 12rpx; border-radius: 6rpx; }
.train-time { font-size: 24rpx; color: $text-tertiary; }
.train-mid { display: flex; align-items: center; padding: 24rpx 0; }
.mid-station { flex: 1; }
.mid-station:last-child { text-align: right; }
.mid-time { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.mid-name { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
.mid-arrow { flex: 1; text-align: center; padding: 0 20rpx; }
.arrow-line { font-size: 22rpx; color: $text-tertiary; display: block; }
.arrow-dur { font-size: 20rpx; color: $text-tertiary; }
.train-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16rpx; border-top: 1rpx solid $border-color; }
.seats { font-size: 24rpx; color: $text-secondary; }
.price { font-size: 32rpx; color: $danger; font-weight: 700; }
</style>
