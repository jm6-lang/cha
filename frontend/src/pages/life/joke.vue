<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">😂</view>
        <text class="header-title">开心一笑</text>
        <text class="header-desc">笑话 · 段子 · KFC · 怼人</text>
      </view>
    </view>

    <view class="mode-tabs">
      <view class="mt-item" :class="{ active: mode === 'joke' }" @tap="onSwitch('joke')">🌟 冷笑话</view>
      <view class="mt-item" :class="{ active: mode === 'duanzi' }" @tap="onSwitch('duanzi')">🎉 段子</view>
      <view class="mt-item" :class="{ active: mode === 'kfc' }" @tap="onSwitch('kfc')">🍗 KFC</view>
      <view class="mt-item" :class="{ active: mode === 'duiren' }" @tap="onSwitch('duiren')">😏 怼人</view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在加载新内容...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error" class="content">
      <view class="quote-card">
        <text class="quote-icon">{{ modeIcon }}</text>
        <text class="quote-text">{{ content }}</text>
        <text class="quote-tip">—— {{ modeName }}</text>
      </view>
      <view class="action-row">
        <view class="action-btn primary" @tap="onRefresh">
          <text>🔄 换一条</text>
        </view>
        <view class="action-btn" @tap="onCopy">
          <text>📋 复制</text>
        </view>
        <view class="action-btn" @tap="onShare">
          <text>📤 分享</text>
        </view>
      </view>
    </view>

    <view class="history">
      <text class="hist-title">最近浏览</text>
      <view v-if="history.length === 0" class="hist-empty">暂无历史</view>
      <view v-else class="hist-list">
        <view v-for="(h, i) in history" :key="i" class="hist-item" @tap="content = h.text">
          <text class="hist-text">{{ h.text.length > 30 ? h.text.substring(0, 30) + '...' : h.text }}</text>
          <text class="hist-type">{{ h.mode }}</text>
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
const history = ref<{ text: string; mode: string; time: number }[]>([]);

const MODE_NAME: Record<string, string> = { joke: '冷笑话', duanzi: '段子', kfc: 'KFC 疯狂星期四', duiren: '怼人语录' };
const MODE_ICON: Record<string, string> = { joke: '🌟', duanzi: '🎉', kfc: '🍗', duiren: '😏' };
const modeName = computed(() => MODE_NAME[mode.value]);
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
    if (!r) error.value = '加载失败，请稍后重试';
    else {
      content.value = r;
      history.value = [{ text: r, mode: modeName.value, time: Date.now() }, ...history.value].slice(0, 10);
      uni.setStorageSync('joke_history', history.value);
    }
  } catch (e) {
    error.value = '加载异常';
  } finally {
    loading.value = false;
  }
};

const onSwitch = (m: 'joke' | 'duanzi' | 'kfc' | 'duiren') => {
  mode.value = m;
  loadData();
};

const onRefresh = () => loadData();
const onCopy = () => uni.setClipboardData({ data: content.value });
const onShare = () => {
  uni.showToast({ title: '请使用浏览器分享', icon: 'none' });
};

const stored = uni.getStorageSync('joke_history');
if (Array.isArray(stored)) history.value = stored;
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
.mode-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12rpx; margin: 24rpx; }
.mt-item { background: #fff; padding: 20rpx 0; text-align: center; font-size: 26rpx; color: $text-secondary; border-radius: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.mt-item.active { background: linear-gradient(135deg, #FF6B35, #FFAB91); color: #fff; font-weight: 600; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 0 24rpx; }
.quote-card { background: #fff; border-radius: 20rpx; padding: 60rpx 40rpx; text-align: center; position: relative; }
.quote-icon { display: block; font-size: 80rpx; margin-bottom: 20rpx; }
.quote-text { display: block; font-size: 32rpx; color: $text-primary; line-height: 1.8; font-weight: 500; }
.quote-tip { display: block; font-size: 24rpx; color: $text-tertiary; margin-top: 30rpx; }
.action-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16rpx; margin-top: 30rpx; }
.action-btn { background: #fff; padding: 20rpx 0; text-align: center; border-radius: 16rpx; font-size: 28rpx; color: $text-primary; }
.action-btn.primary { background: linear-gradient(135deg, #FF6B35, #FFAB91); color: #fff; font-weight: 600; }
.history { margin: 30rpx 24rpx 0; background: #fff; border-radius: 20rpx; padding: 24rpx; }
.hist-title { display: block; font-size: 28rpx; font-weight: 700; color: $text-primary; margin-bottom: 16rpx; }
.hist-empty { font-size: 24rpx; color: $text-tertiary; text-align: center; padding: 30rpx 0; }
.hist-list { display: flex; flex-direction: column; gap: 12rpx; }
.hist-item { display: flex; justify-content: space-between; align-items: center; padding: 16rpx 20rpx; background: $bg-page; border-radius: 12rpx; }
.hist-text { font-size: 24rpx; color: $text-primary; flex: 1; }
.hist-type { font-size: 20rpx; color: $text-tertiary; background: #fff; padding: 4rpx 12rpx; border-radius: 10rpx; margin-left: 12rpx; }
</style>
