<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💳</view>
        <text class="header-title">信用查询</text>
        <text class="header-desc">失信/逾期/黑名单/信用报告</text>
      </view>
    </view>

    <view class="quick-grid">
      <view v-for="f in funcs" :key="f.name" class="func-card" :style="{ background: f.bg }" @tap="goFunc(f)">
        <text class="func-emoji">{{ f.emoji }}</text>
        <text class="func-name">{{ f.name }}</text>
        <text class="func-price">¥{{ f.price }}起</text>
      </view>
    </view>

    <view class="hot-section">
      <text class="section-title">热门服务</text>
      <view class="hot-list">
        <view v-for="(h, i) in hotList" :key="i" class="hot-item">
          <view class="hot-rank" :class="{ top3: i < 3 }">{{ i + 1 }}</view>
          <view class="hot-info">
            <text class="hot-name">{{ h.name }}</text>
            <text class="hot-desc">{{ h.desc }}</text>
          </view>
          <text class="hot-views">{{ h.views }}人查询</text>
        </view>
      </view>
    </view>

    <view class="notice">
      <text class="notice-icon">ℹ️</text>
      <text class="notice-text">所有查询均通过权威数据源，结果仅供参考</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(44);
statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 44;

const funcs = [
  { name: '失信被执行人', emoji: '⚖️', price: '5.9', bg: 'linear-gradient(135deg, #FF5252, #FF7676)' },
  { name: '逾期黑名单', emoji: '📛', price: '2.9', bg: 'linear-gradient(135deg, #FF6B35, #FF9F66)' },
  { name: '网贷黑名单', emoji: '🚫', price: '2.9', bg: 'linear-gradient(135deg, #7B61FF, #A78BFA)' },
  { name: '信用报告', emoji: '📊', price: '5.9', bg: 'linear-gradient(135deg, #1A6CFF, #4A8FFF)' },
  { name: '多头借贷', emoji: '💰', price: '5.9', bg: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
  { name: '老赖查询', emoji: '😈', price: '5.9', bg: 'linear-gradient(135deg, #E91E63, #F06292)' }
];

const hotList = [
  { name: '网贷逾期黑名单', desc: '查询本人/他人是否在网贷逾期名单', views: '8.6w' },
  { name: '失信被执行人', desc: '最高法官方失信记录', views: '6.2w' },
  { name: '限高消费人员', desc: '被限制高消费记录查询', views: '4.1w' },
  { name: '信用卡逾期', desc: '央行征信报告简化版', views: '3.8w' },
  { name: 'P2P 黑名单', desc: '互联网金融失信人', views: '2.4w' }
];

const goFunc = (f: any) => {
  uni.showToast({ title: `进入${f.name}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 44rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20rpx; padding: 30rpx 24rpx; margin-top: -30rpx; }
.func-card { border-radius: 20rpx; padding: 30rpx 16rpx; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06); }
.func-emoji { font-size: 50rpx; margin-bottom: 10rpx; }
.func-name { font-size: 26rpx; color: #fff; font-weight: 600; }
.func-price { font-size: 22rpx; color: rgba(255,255,255,0.9); margin-top: 6rpx; }
.hot-section { padding: 20rpx 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; margin-bottom: 20rpx; }
.hot-list { background: #fff; border-radius: 20rpx; padding: 10rpx 24rpx; }
.hot-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.hot-item:last-child { border-bottom: none; }
.hot-rank { width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center; background: #f0f0f0; color: #999; border-radius: 50%; font-size: 22rpx; font-weight: 600; margin-right: 20rpx; }
.hot-rank.top3 { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; }
.hot-info { flex: 1; }
.hot-name { font-size: 28rpx; color: $text-primary; display: block; }
.hot-desc { font-size: 22rpx; color: $text-secondary; display: block; margin-top: 4rpx; }
.hot-views { font-size: 22rpx; color: $text-tertiary; }
.notice { margin: 30rpx 24rpx; padding: 20rpx 24rpx; background: #FFF7E6; border-radius: 16rpx; display: flex; align-items: center; }
.notice-icon { font-size: 28rpx; margin-right: 12rpx; }
.notice-text { font-size: 22rpx; color: $text-secondary; flex: 1; }
</style>
