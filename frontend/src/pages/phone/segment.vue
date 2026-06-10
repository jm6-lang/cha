<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📊</view>
        <text class="header-title">号段归属地</text>
        <text class="header-desc">输入手机号段（前7位）查询</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-title">查询号段</view>
      <view class="input-wrap">
        <input
          v-model="segment"
          class="form-input"
          placeholder="请输入前 3-7 位号段"
          placeholder-class="placeholder"
          maxlength="7"
        />
        <text v-if="segment" class="search-clear" @tap="segment = ''">✕</text>
      </view>
      <view class="form-tip">支持输入 3-7 位号段，位数越精确结果越准</view>
      <view class="quick-segments">
        <text class="quick-tip">试试：</text>
        <text class="quick-item" @tap="segment = '138'">138</text>
        <text class="quick-item" @tap="segment = '1390'">1390</text>
        <text class="quick-item" @tap="segment = '155'">155</text>
        <text class="quick-item" @tap="segment = '177'">177</text>
        <text class="quick-item" @tap="segment = '186'">186</text>
      </view>
      <view class="query-btn" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header">
        <view class="segment-tag">
          <text class="segment-tag-text">{{ result.num }}</text>
        </view>
        <text class="result-status">✓ 归属地已确认</text>
      </view>
      <view class="result-list">
        <view class="result-row">
          <text class="row-label">运营商</text>
          <text class="row-value">{{ result.carrier }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">品牌系列</text>
          <text class="row-value">{{ result.brand }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">归属省份</text>
          <text class="row-value">{{ result.province }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">归属城市</text>
          <text class="row-value">{{ result.city }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">号段类型</text>
          <text class="row-value">{{ result.type }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">启用时间</text>
          <text class="row-value">{{ result.startTime }}</text>
        </view>
      </view>

      <view class="hint-block">
        <text class="hint-title">使用提示</text>
        <text class="hint-text">• 输入 3 位号段（如 138）查询全国分布</text>
        <text class="hint-text">• 输入 4-7 位号段查询具体城市归属</text>
        <text class="hint-text">• 携号转网可能影响运营商归属</text>
        <text class="hint-text">• 实际归属以运营商系统查询为准</text>
      </view>
    </view>

    <view v-if="history.length > 0" class="history-card">
      <text class="history-title">最近查询</text>
      <view class="history-list">
        <view
          v-for="(h, i) in history"
          :key="i"
          class="history-item"
          @tap="segment = h.num; onQuery();"
        >
          <text class="history-num">{{ h.num }}</text>
          <text class="history-area">{{ h.area }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const segment = ref('');
const result = ref<any>(null);
const history = ref([
  { num: '138', area: '全国' },
  { num: '1390', area: '北京' },
]);

function onQuery() {
  const s = segment.value.trim();
  if (!s || s.length < 3) {
    uni.showToast({ title: '请输入至少 3 位号段', icon: 'none' });
    return;
  }
  if (!/^\d+$/.test(s)) {
    uni.showToast({ title: '只能输入数字', icon: 'none' });
    return;
  }

  // 模拟号段数据
  const data: any = {
    num: s,
    carrier: '中国移动',
    brand: '全球通',
    province: '北京',
    city: '北京',
    type: s.startsWith('13') ? 'GSM/4G/5G' : '4G/5G',
    startTime: '1999-07-22',
  };

  const map: Record<string, any> = {
    '138': { carrier: '中国移动', brand: '全球通', province: '全国', city: '全国', type: 'GSM/4G/5G', startTime: '1999-07-22' },
    '139': { carrier: '中国移动', brand: '全球通', province: '全国', city: '全国', type: 'GSM/4G/5G', startTime: '1999-07-22' },
    '155': { carrier: '中国联通', brand: '如意通', province: '全国', city: '全国', type: 'GSM/4G/5G', startTime: '2002-01-08' },
    '177': { carrier: '中国电信', brand: '天翼', province: '全国', city: '全国', type: '4G/5G', startTime: '2014-09-01' },
    '186': { carrier: '中国联通', brand: '如意通', province: '全国', city: '全国', type: '3G/4G/5G', startTime: '2008-12-22' },
  };

  // 4位号段
  if (s.length === 4) {
    const cityMap: Record<string, string> = {
      '1380': '北京', '1381': '上海', '1382': '天津', '1383': '重庆',
      '1390': '北京', '1391': '上海', '1392': '广州', '1393': '深圳',
    };
    const city = cityMap[s] || '北京';
    data.province = city;
    data.city = city;
  }

  // 7位号段
  if (s.length === 7) {
    data.province = '北京';
    data.city = '北京';
  }

  Object.assign(data, map[s.substring(0, 3)] || {});

  result.value = data;
  // 记录历史
  const exist = history.value.findIndex(h => h.num === s);
  if (exist === -1) {
    history.value.unshift({ num: s, area: data.province });
    if (history.value.length > 5) history.value = history.value.slice(0, 5);
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #1A6CFF 0%, #0D47A1 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 40rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 表单 */
.form-card {
  margin: -28rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.form-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 32rpx;
  color: $text-primary;
  letter-spacing: 2rpx;
  font-family: monospace;
}

.placeholder {
  color: $text-tertiary;
  font-family: sans-serif;
  letter-spacing: 0;
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
}

.quick-segments {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}

.quick-tip {
  font-size: 24rpx;
  color: $text-tertiary;
}

.quick-item {
  font-size: 24rpx;
  color: $info;
  background: rgba(26, 108, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  font-family: monospace;
}

.query-btn {
  margin-top: 32rpx;
  height: 96rpx;
  background: $info;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 108, 255, 0.3);
}

.query-btn:active {
  opacity: 0.85;
}

.query-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 结果 */
.result-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid $border;
}

.segment-tag {
  background: $info;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
}

.segment-tag-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.result-status {
  font-size: 26rpx;
  color: $primary;
  font-weight: 500;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.result-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 28rpx;
  color: $text-tertiary;
}

.row-value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

.hint-block {
  margin-top: 24rpx;
  padding: 20rpx 24rpx;
  background: #F0F7FF;
  border-radius: $radius-md;
}

.hint-title {
  display: block;
  font-size: 26rpx;
  color: $info;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.hint-text {
  display: block;
  font-size: 22rpx;
  color: $text-secondary;
  line-height: 1.8;
}

/* 历史 */
.history-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
}

.history-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background: $bg-grey;
  border-radius: $radius-md;
}

.history-num {
  font-size: 28rpx;
  color: $info;
  font-family: monospace;
  font-weight: 600;
}

.history-area {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
