<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📦</view>
        <text class="header-title">快递查询</text>
        <text class="header-desc">100+ 快递公司 · 实时跟踪</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入快递单号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
      <view v-if="isSF" class="sf-hint">
        <text class="sf-icon">💡</text>
        <text class="sf-text">顺丰需输入收件人手机尾号 4 位</text>
      </view>
      <view v-if="isSF" class="sf-input">
        <input v-model="phoneTail" class="sf-input-fld" placeholder="手机尾号 4 位" maxlength="4" type="number" />
      </view>
    </view>

    <view class="companies">
      <text class="section-title">支持的快递</text>
      <view class="company-list">
        <view v-for="c in companies" :key="c" class="company-item">{{ c }}</view>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询物流轨迹...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result && result.packages.length" class="result-card">
      <view v-for="(pkg, i) in result.packages" :key="i" class="package-block">
        <view class="result-top">
          <view class="rt-left">
            <text class="company-name">📦 {{ pkg.cpName }}</text>
            <text class="tracking-no">{{ pkg.trackingNo }}</text>
          </view>
          <text class="result-status">{{ stateText(pkg.state) }}</text>
        </view>
        <view v-if="pkg.operateMessage" class="operate-msg">
          <text>{{ pkg.operateMessage }}</text>
        </view>
        <view class="track-list">
          <view
            v-for="(t, j) in pkg.details"
            :key="j"
            class="track-item"
            :class="{ current: j === 0 }"
          >
            <view class="track-dot" />
            <view class="track-info">
              <text class="track-text">{{ t.context }}</text>
              <text class="track-time">{{ formatTime(t.time) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryExpress, queryShunfeng, type ExpressResult } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const phoneTail = ref('');
const loading = ref(false);
const error = ref('');
const result = ref<ExpressResult | null>(null);

const companies = ['顺丰', '圆通', '中通', '申通', '韵达', '邮政', '京东', '德邦', '极兔', '百世', '天天', '苏宁'];

const isSF = computed(() => /^SF/i.test(keyword.value.trim()) || /^\d{12,15}$/.test(keyword.value.trim()) === false && /^(7\d{11}|5\d{11})$/.test(keyword.value));

const stateText = (state: string) => {
  const map: Record<string, string> = {
    'CREATED': '已下单',
    'ACCEPT': '已揽收',
    'TRANSIT': '运输中',
    'DELIVERING': '派送中',
    'SIGN': '已签收',
    'FINISH': '已完成',
    'EXCEPTION': '异常',
  };
  return map[state] || state;
};

const formatTime = (s: string) => {
  if (!s) return '';
  if (s.length === 14) return `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)} ${s.substring(8, 10)}:${s.substring(10, 12)}:${s.substring(12, 14)}`;
  return s;
};

const onSearch = async () => {
  const kw = keyword.value.trim();
  if (kw.length < 8) {
    uni.showToast({ title: '请输入正确单号', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    if (isSF.value) {
      if (!/^\d{4}$/.test(phoneTail.value)) {
        uni.showToast({ title: '顺丰需输入手机尾号 4 位', icon: 'none' });
        loading.value = false;
        return;
      }
      const sf = await queryShunfeng(kw, phoneTail.value);
      if (!sf) {
        error.value = '未查询到此顺丰运单，请检查单号和手机尾号';
      } else {
        result.value = { serviceCode: 0, packages: [{ trackingNo: sf.mailNo, cp: 'SF', cpName: sf.comName, state: sf.state, details: sf.details }] };
      }
    } else {
      const r = await queryExpress(kw);
      if (!r || r.packages.length === 0) {
        error.value = '未查询到此快递单号';
      } else {
        result.value = r;
      }
    }
  } catch (e) {
    error.value = '查询失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF9800, #FFB74D); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.sf-hint { display: flex; align-items: center; padding: 16rpx 20rpx 0; }
.sf-icon { font-size: 24rpx; margin-right: 8rpx; }
.sf-text { font-size: 22rpx; color: $warning; }
.sf-input { padding: 12rpx 20rpx 0; }
.sf-input-fld { background: #fff; border-radius: 12rpx; padding: 16rpx 24rpx; font-size: 28rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.company-list { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: flex; flex-wrap: wrap; gap: 16rpx; }
.company-item { font-size: 24rpx; color: $text-secondary; background: $bg-page; padding: 12rpx 24rpx; border-radius: 10rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx 0; }
.package-block { background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 24rpx; }
.result-top { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx; display: flex; justify-content: space-between; align-items: center; }
.rt-left { display: flex; flex-direction: column; gap: 4rpx; }
.company-name { font-size: 30rpx; color: #fff; font-weight: 700; }
.tracking-no { font-size: 22rpx; color: rgba(255,255,255,0.9); font-family: monospace; }
.result-status { font-size: 24rpx; background: #fff; color: $warning; padding: 6rpx 20rpx; border-radius: 20rpx; font-weight: 600; }
.operate-msg { padding: 20rpx 30rpx; background: #FFF8E1; font-size: 24rpx; color: $text-primary; }
.track-list { padding: 30rpx 30rpx 30rpx 60rpx; position: relative; }
.track-list::before { content: ''; position: absolute; left: 30rpx; top: 30rpx; bottom: 30rpx; width: 2rpx; background: $border-color; }
.track-item { position: relative; padding: 0 0 30rpx; }
.track-item:last-child { padding-bottom: 0; }
.track-item.current .track-dot { background: $warning; box-shadow: 0 0 0 6rpx rgba(255,152,0,0.2); }
.track-dot { position: absolute; left: -36rpx; top: 10rpx; width: 16rpx; height: 16rpx; border-radius: 50%; background: $text-tertiary; }
.track-text { font-size: 26rpx; color: $text-primary; display: block; }
.track-time { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
</style>
