<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📅</view>
        <text class="header-title">历史上的今天</text>
        <text class="header-desc">回顾历史 · 了解过去</text>
      </view>
    </view>

    <view class="date-banner">
      <text class="date-num">{{ todayDate }}</text>
      <text class="date-info">📜 历史上的今天</text>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在加载历史事件...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error && events.length" class="content">
      <view class="event-list">
        <view v-for="(e, i) in events" :key="i" class="event-item" @tap="onOpenEvent(e)">
          <view class="event-year">
            <text class="y-num">{{ e.year }}</text>
            <text class="y-label">年</text>
          </view>
          <view class="event-body">
            <text class="event-title">{{ e.title }}</text>
            <text class="event-desc" v-if="e.desc">{{ e.desc.length > 80 ? e.desc.substring(0, 80) + '...' : e.desc }}</text>
            <view v-if="e.link" class="event-link">
              <text class="link-text">📖 百科详情</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!loading && !error && events.length === 0" class="empty">
      <text class="empty-icon">📅</text>
      <text class="empty-text">今天暂无历史事件记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryHistoryToday, type HistoryEvent } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const loading = ref(false);
const error = ref('');
const events = ref<HistoryEvent[]>([]);
const todayDate = ref('');

const loadData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const r = await queryHistoryToday();
    if (!r) error.value = '加载历史事件失败';
    else {
      events.value = r.events;
      todayDate.value = r.date;
    }
  } catch (e) {
    error.value = '加载异常';
  } finally {
    loading.value = false;
  }
};

const onOpenEvent = (e: HistoryEvent) => {
  if (e.link) {
    uni.setClipboardData({ data: e.link });
    uni.showToast({ title: '链接已复制', icon: 'none' });
  } else {
    uni.showModal({ title: e.title, content: e.desc || '暂无详情', showCancel: false });
  }
};

loadData();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #5E35B1, #7E57C2); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.date-banner { background: #fff; margin: 24rpx 24rpx 0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.date-num { font-size: 36rpx; font-weight: 700; color: #5E35B1; }
.date-info { font-size: 24rpx; color: $text-tertiary; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 30rpx 24rpx 0; }
.event-list { display: flex; flex-direction: column; gap: 16rpx; }
.event-item { background: #fff; border-radius: 20rpx; padding: 24rpx; display: flex; gap: 20rpx; }
.event-year { display: flex; align-items: baseline; flex-shrink: 0; padding: 8rpx 16rpx; background: linear-gradient(135deg, #EDE7F6, #F3E5F5); border-radius: 12rpx; }
.y-num { font-size: 30rpx; font-weight: 700; color: #5E35B1; }
.y-label { font-size: 20rpx; color: $text-tertiary; margin-left: 2rpx; }
.event-body { flex: 1; min-width: 0; }
.event-title { display: block; font-size: 30rpx; color: $text-primary; font-weight: 700; line-height: 1.4; margin-bottom: 8rpx; }
.event-desc { display: block; font-size: 24rpx; color: $text-secondary; line-height: 1.6; margin-bottom: 8rpx; }
.event-link { padding: 4rpx 0; }
.link-text { font-size: 22rpx; color: $info; }
.empty { text-align: center; padding: 100rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 100rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
