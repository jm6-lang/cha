<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📅</view>
        <text class="header-title">万年历</text>
        <text class="header-desc">公历 · 农历 · 黄历 · 历史上的今天</text>
      </view>
    </view>

    <view class="date-banner">
      <text class="date-num">{{ todayDate }}</text>
      <text class="date-info">{{ weekDay }} · 农历{{ huangli.lunar || '加载中' }}</text>
    </view>

    <view class="date-picker">
      <picker mode="date" :value="selectedDate" @change="onDateChange">
        <view class="picker-text">📆 切换日期：{{ selectedDate }}</view>
      </picker>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在加载黄历...</text>
    </view>

    <view v-if="!loading && huangli.yi" class="huangli">
      <view class="hl-row yi">
        <text class="hl-label">✅ 宜</text>
        <text class="hl-content">{{ huangli.yi }}</text>
      </view>
      <view class="hl-row ji">
        <text class="hl-label">❌ 忌</text>
        <text class="hl-content">{{ huangli.ji }}</text>
      </view>
      <view class="hl-extra" v-if="huangli.ganzhi">
        <text class="extra-label">干支：</text><text class="extra-val">{{ huangli.ganzhi }}</text>
      </view>
      <view class="hl-extra" v-if="huangli.chong">
        <text class="extra-label">冲煞：</text><text class="extra-val">{{ huangli.chong }} {{ huangli.sha }}</text>
      </view>
      <view class="hl-extra" v-if="huangli.jiri">
        <text class="extra-label">吉日：</text><text class="extra-val">{{ huangli.jiri }} / {{ huangli.zhiri }}</text>
      </view>
    </view>

    <view class="section" v-if="events.length">
      <text class="section-title">📜 历史上的今天</text>
      <view class="event-list">
        <view v-for="(e, i) in events" :key="i" class="event-item" @tap="onOpenEvent(e)">
          <view class="event-year">
            <text class="y-num">{{ e.year }}</text>
            <text class="y-label">年</text>
          </view>
          <view class="event-body">
            <text class="event-title">{{ e.title }}</text>
            <text class="event-desc" v-if="e.desc">{{ e.desc.length > 60 ? e.desc.substring(0, 60) + '...' : e.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!loading && events.length === 0 && !huangli.yi" class="empty">
      <text class="empty-icon">📅</text>
      <text class="empty-text">选择日期查看</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { queryHistoryToday, queryHuangli, type HistoryEvent } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const loading = ref(false);
const events = ref<HistoryEvent[]>([]);
const huangli = reactive<{ lunar: string; ganzhi: string; yi: string; ji: string; chong: string; sha: string; jiri: string; zhiri: string }>({ lunar: '', ganzhi: '', yi: '', ji: '', chong: '', sha: '', jiri: '', zhiri: '' });

const d = new Date();
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const weekDay = `星期${WEEK[d.getDay()]}`;
const M = d.getMonth() + 1;
const D = d.getDate();
const todayDate = `${d.getFullYear()}年${M}月${D}日`;
const selectedDate = ref(`${d.getFullYear()}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`);

const onDateChange = (e: any) => {
  selectedDate.value = e.detail.value;
  loadHuangli();
};

const loadHuangli = async () => {
  loading.value = true;
  huangli.yi = ''; huangli.ji = ''; huangli.lunar = '';
  try {
    const r = await queryHuangli(selectedDate.value);
    if (r) {
      huangli.lunar = r.lunar;
      huangli.ganzhi = r.ganzhi;
      huangli.yi = r.yi;
      huangli.ji = r.ji;
      huangli.chong = r.chong;
      huangli.sha = r.sha;
      huangli.jiri = r.jiri;
      huangli.zhiri = r.zhiri;
    } else {
      // 兜底示例
      huangli.lunar = `${M}月${D}日`;
      huangli.ganzhi = '甲辰年';
      huangli.yi = '祭祀 出行 沐浴 扫舍 教牛马';
      huangli.ji = '嫁娶 入宅 移徙 安葬';
      huangli.chong = '冲鼠';
      huangli.sha = '煞北';
    }
  } catch (e) {
    // 兜底
    huangli.lunar = `${M}月${D}日`;
    huangli.yi = '祭祀 出行 沐浴';
    huangli.ji = '嫁娶 入宅';
  } finally {
    loading.value = false;
  }
};

const loadHistory = async () => {
  const r = await queryHistoryToday();
  if (r) events.value = r.events;
};

const onOpenEvent = (e: HistoryEvent) => {
  if (e.link) {
    uni.setClipboardData({ data: e.link });
    uni.showToast({ title: '链接已复制', icon: 'none' });
  }
};

loadHuangli();
loadHistory();
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #5E35B1, #7E57C2); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.date-banner { background: #fff; margin: 24rpx 24rpx 0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.date-num { font-size: 36rpx; font-weight: 700; color: #5E35B1; }
.date-info { font-size: 24rpx; color: $text-secondary; }
.date-picker { margin: 20rpx 24rpx 0; background: #fff; border-radius: 16rpx; padding: 24rpx; }
.picker-text { font-size: 28rpx; color: $text-primary; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.huangli { background: #fff; margin: 30rpx 24rpx 0; border-radius: 20rpx; padding: 24rpx; }
.hl-row { display: flex; align-items: flex-start; padding: 16rpx 0; border-bottom: 1rpx dashed $border-color; }
.hl-row:last-of-type { border-bottom: none; }
.hl-label { font-size: 30rpx; font-weight: 700; width: 80rpx; flex-shrink: 0; }
.hl-row.yi .hl-label { color: $primary; }
.hl-row.ji .hl-label { color: $danger; }
.hl-content { font-size: 26rpx; color: $text-primary; line-height: 1.7; flex: 1; }
.hl-extra { padding: 8rpx 0; }
.extra-label { font-size: 24rpx; color: $text-tertiary; }
.extra-val { font-size: 24rpx; color: $text-primary; }
.section { background: #fff; margin: 30rpx 24rpx 0; border-radius: 20rpx; padding: 24rpx; }
.section-title { display: block; font-size: 30rpx; font-weight: 700; color: $text-primary; margin-bottom: 20rpx; padding-left: 8rpx; border-left: 6rpx solid #5E35B1; line-height: 1; }
.event-list { display: flex; flex-direction: column; gap: 12rpx; }
.event-item { padding: 20rpx; background: $bg-page; border-radius: 14rpx; display: flex; gap: 20rpx; }
.event-year { display: flex; align-items: baseline; flex-shrink: 0; padding: 8rpx 16rpx; background: linear-gradient(135deg, #EDE7F6, #F3E5F5); border-radius: 12rpx; }
.y-num { font-size: 28rpx; font-weight: 700; color: #5E35B1; }
.y-label { font-size: 20rpx; color: $text-tertiary; margin-left: 2rpx; }
.event-body { flex: 1; min-width: 0; }
.event-title { display: block; font-size: 28rpx; color: $text-primary; font-weight: 600; line-height: 1.4; margin-bottom: 6rpx; }
.event-desc { display: block; font-size: 22rpx; color: $text-tertiary; line-height: 1.5; }
.empty { text-align: center; padding: 100rpx 0; display: flex; flex-direction: column; align-items: center; background: #fff; border-radius: 20rpx; margin: 0 24rpx; }
.empty-icon { font-size: 100rpx; opacity: 0.4; }
.empty-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
