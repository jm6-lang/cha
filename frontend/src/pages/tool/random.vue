<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎲</view>
        <text class="header-title">随机生成</text>
        <text class="header-desc">笑话 · 段子 · KFC · 怼人</text>
      </view>
    </view>

    <view class="mode-grid">
      <view class="mode-card" :class="{ active: mode === 'joke' }" @tap="onSwitch('joke')">
        <text class="mc-icon">🌟</text>
        <text class="mc-name">冷笑话</text>
      </view>
      <view class="mode-card" :class="{ active: mode === 'duanzi' }" @tap="onSwitch('duanzi')">
        <text class="mc-icon">🎉</text>
        <text class="mc-name">段子</text>
      </view>
      <view class="mode-card" :class="{ active: mode === 'kfc' }" @tap="onSwitch('kfc')">
        <text class="mc-icon">🍗</text>
        <text class="mc-name">KFC</text>
      </view>
      <view class="mode-card" :class="{ active: mode === 'duiren' }" @tap="onSwitch('duiren')">
        <text class="mc-icon">😏</text>
        <text class="mc-name">怼人</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在生成...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error" class="content">
      <view class="quote-card">
        <text class="quote-icon">{{ modeIcon }}</text>
        <text class="quote-text">{{ content }}</text>
      </view>
      <view class="action-row">
        <view class="action-btn primary" @tap="onRefresh">
          <text>🎲 换一条</text>
        </view>
        <view class="action-btn" @tap="onCopy">
          <text>📋 复制</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryDadJoke, queryDuanzi, queryKFC, queryDuiren } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const mode = ref<'joke' | 'duanzi' | 'kfc' | 'duiren'>('joke');
const loading = ref(false);
const error = ref('');
const content = ref('');

const MODE_ICON: Record<string, string> = { joke: '🌟', duanzi: '🎉', kfc: '🍗', duiren: '😏' };
const modeIcon = computed(() => MODE_ICON[mode.value]);

const loadData = async () => {
  loading.value = true;
  error.value = '';
  try {
    let r: string | null = null;
    if (mode.value === 'joke') r = await queryDadJoke();
    else if (mode.value === 'duanzi') r = await queryDuanzi();
    else if (mode.value === 'kfc') r = await queryKFC();
    else r = await queryDuiren();
    if (!r) error.value = '生成失败';
    else content.value = r;
  } catch (e) {
    error.value = '生成异常';
  } finally {
    loading.value = false;
  }
};

const onSwitch = (m: 'joke' | 'duanzi' | 'kfc' | 'duiren') => { mode.value = m; loadData(); };
const onRefresh = () => loadData();
const onCopy = () => uni.setClipboardData({ data: content.value });

loadData();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF6B35, #FFAB91); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.mode-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; margin: 24rpx; }
.mode-card { background: #fff; padding: 30rpx 0; text-align: center; border-radius: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.mode-card.active { background: linear-gradient(135deg, #FF6B35, #FFAB91); }
.mc-icon { display: block; font-size: 50rpx; margin-bottom: 8rpx; }
.mc-name { font-size: 24rpx; color: $text-secondary; }
.mode-card.active .mc-name { color: #fff; font-weight: 600; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 0 24rpx; }
.quote-card { background: #fff; border-radius: 20rpx; padding: 60rpx 40rpx; text-align: center; }
.quote-icon { display: block; font-size: 80rpx; margin-bottom: 20rpx; }
.quote-text { display: block; font-size: 32rpx; color: $text-primary; line-height: 1.8; font-weight: 500; }
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; margin-top: 30rpx; }
.action-btn { background: #fff; padding: 20rpx 0; text-align: center; border-radius: 16rpx; font-size: 28rpx; color: $text-primary; }
.action-btn.primary { background: linear-gradient(135deg, #FF6B35, #FFAB91); color: #fff; font-weight: 600; }
</style>
