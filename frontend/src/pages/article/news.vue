<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📰</view>
        <text class="header-title">热点资讯</text>
        <text class="header-desc">全网热搜 · 实时榜单</text>
      </view>
    </view>

    <view class="tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view
          v-for="(t, k) in HOT_BOARD_TYPES"
          :key="k"
          class="tab"
          :class="{ active: type === k }"
          @tap="onSwitchType(k)"
        >
          {{ t }}
        </view>
      </scroll-view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在获取最新榜单...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error" class="content">
      <view class="board-title">
        <text class="bt-icon">🔥</text>
        <text class="bt-text">{{ boardTitle }}</text>
        <text class="bt-time" @tap="onRefresh">🔄 刷新</text>
      </view>

      <view v-if="!items.length" class="empty">
        <text class="empty-text">暂无数据</text>
      </view>

      <view class="rank-list">
        <view
          v-for="(item, i) in items"
          :key="i"
          class="rank-item"
          @tap="onOpenItem(item)"
        >
          <text class="rank-no" :class="`top-${i + 1}`">{{ i < 9 ? '0' + (i + 1) : i + 1 }}</text>
          <view class="rank-content">
            <text class="rank-text">{{ item.text }}</text>
            <view v-if="item.hot" class="rank-extra">
              <text class="rank-hot">🔥 {{ item.hot }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryHotBoard, HOT_BOARD_TYPES, type HotItem } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const type = ref('111');
const loading = ref(false);
const error = ref('');
const boardTitle = ref('');
const items = ref<HotItem[]>([]);

const loadData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const r = await queryHotBoard(type.value);
    if (!r) error.value = '加载失败，请稍后重试';
    else {
      boardTitle.value = r.title;
      items.value = r.items;
    }
  } catch (e) {
    error.value = '加载异常';
  } finally {
    loading.value = false;
  }
};

const onSwitchType = (k: string) => {
  type.value = k;
  loadData();
};

const onRefresh = () => loadData();

const onOpenItem = (item: HotItem) => {
  if (item.url) {
    uni.setClipboardData({ data: item.url });
    uni.showToast({ title: '链接已复制', icon: 'none' });
  } else {
    uni.showModal({ title: item.text, content: item.desc || '暂无详情', showCancel: false });
  }
};

loadData();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF5252, #FF7676); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.tabs { background: #fff; padding: 12rpx 0; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.tabs-scroll { white-space: nowrap; }
.tab { display: inline-block; padding: 14rpx 30rpx; margin: 0 8rpx; font-size: 26rpx; color: $text-secondary; border-radius: 30rpx; background: $bg-page; }
.tab.active { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; font-weight: 600; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 30rpx 24rpx 0; }
.board-title { display: flex; align-items: center; gap: 12rpx; margin-bottom: 24rpx; }
.bt-icon { font-size: 36rpx; }
.bt-text { font-size: 32rpx; font-weight: 700; color: $text-primary; flex: 1; }
.bt-time { font-size: 24rpx; color: $info; padding: 8rpx 16rpx; background: rgba(26,108,255,0.08); border-radius: 20rpx; }
.empty { text-align: center; padding: 60rpx 0; }
.empty-text { font-size: 28rpx; color: $text-tertiary; }
.rank-list { background: #fff; border-radius: 20rpx; overflow: hidden; }
.rank-item { display: flex; align-items: center; padding: 24rpx; border-bottom: 1rpx solid $border-color; gap: 20rpx; }
.rank-item:last-child { border-bottom: none; }
.rank-no { font-size: 32rpx; font-weight: 700; color: $text-tertiary; width: 50rpx; text-align: center; flex-shrink: 0; font-family: monospace; }
.rank-no.top-1 { color: #FF5252; }
.rank-no.top-2 { color: #FF9800; }
.rank-no.top-3 { color: #FFC107; }
.rank-content { flex: 1; min-width: 0; }
.rank-text { display: block; font-size: 28rpx; color: $text-primary; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.rank-extra { margin-top: 8rpx; }
.rank-hot { font-size: 22rpx; color: $text-tertiary; }
</style>
