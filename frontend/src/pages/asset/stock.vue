<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📊</view>
        <text class="header-title">股票基金</text>
        <text class="header-desc">实时行情 · 基金净值</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入股票/基金代码" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="market-bar">
      <view class="market-item" :class="{ up: true }">
        <text class="market-name">上证指数</text>
        <text class="market-num">3,256.78</text>
        <text class="market-change">+18.32 (+0.57%)</text>
      </view>
      <view class="market-item" :class="{ up: true }">
        <text class="market-name">深证成指</text>
        <text class="market-num">10,348.21</text>
        <text class="market-change">+62.45 (+0.61%)</text>
      </view>
      <view class="market-item" :class="{ down: true }">
        <text class="market-name">创业板指</text>
        <text class="market-num">2,058.45</text>
        <text class="market-change">-8.32 (-0.40%)</text>
      </view>
    </view>

    <view v-if="searched" class="stock-card">
      <view class="stock-top">
        <view>
          <text class="stock-name">{{ result.name }}</text>
          <text class="stock-code">{{ result.code }}</text>
        </view>
        <view class="stock-price-wrap">
          <text class="stock-price">¥{{ result.price }}</text>
          <text class="stock-change" :class="{ up: result.change > 0, down: result.change < 0 }">
            {{ result.change > 0 ? '+' : '' }}{{ result.change }} ({{ result.changePercent }}%)
          </text>
        </view>
      </view>
      <view class="stock-info">
        <view class="info-cell">
          <text class="cell-lbl">今开</text>
          <text class="cell-val">{{ result.open }}</text>
        </view>
        <view class="info-cell">
          <text class="cell-lbl">昨收</text>
          <text class="cell-val">{{ result.lastClose }}</text>
        </view>
        <view class="info-cell">
          <text class="cell-lbl">最高</text>
          <text class="cell-val">{{ result.high }}</text>
        </view>
        <view class="info-cell">
          <text class="cell-lbl">最低</text>
          <text class="cell-val">{{ result.low }}</text>
        </view>
        <view class="info-cell">
          <text class="cell-lbl">成交量</text>
          <text class="cell-val">{{ result.volume }}</text>
        </view>
        <view class="info-cell">
          <text class="cell-lbl">市值</text>
          <text class="cell-val">{{ result.mv }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="hot-section">
      <text class="section-title">热门股票</text>
      <view v-for="(s, i) in hot" :key="i" class="hot-item">
        <text class="hot-rank">{{ i + 1 }}</text>
        <view class="hot-info">
          <text class="hot-name">{{ s.name }}</text>
          <text class="hot-code">{{ s.code }}</text>
        </view>
        <view class="hot-price">
          <text class="price">{{ s.price }}</text>
          <text class="change" :class="{ up: s.change > 0 }">{{ s.change }}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const searched = ref(false);
const result = ref({
  name: '贵州茅台',
  code: '600519',
  price: '1680.50',
  change: 12.30,
  changePercent: 0.74,
  open: '1668.20',
  lastClose: '1668.20',
  high: '1692.00',
  low: '1660.00',
  volume: '2.3万手',
  mv: '21100亿'
});
const hot = [
  { name: '贵州茅台', code: '600519', price: '1680.50', change: 0.74 },
  { name: '宁德时代', code: '300750', price: '218.30', change: 1.25 },
  { name: '中国平安', code: '601318', price: '48.20', change: -0.36 },
  { name: '招商银行', code: '600036', price: '32.50', change: 0.58 },
  { name: '比亚迪', code: '002594', price: '258.30', change: 2.15 }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入代码', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF5252, #FF7676); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -30rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF5252, #FF7676); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.market-bar { display: flex; padding: 30rpx 24rpx 0; gap: 16rpx; }
.market-item { flex: 1; background: #fff; border-radius: 16rpx; padding: 20rpx 0; text-align: center; }
.market-item.up { border-top: 4rpx solid #07C160; }
.market-item.down { border-top: 4rpx solid #FF5252; }
.market-name { font-size: 22rpx; color: $text-tertiary; display: block; }
.market-num { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; margin: 6rpx 0; }
.market-change { font-size: 20rpx; }
.market-item.up .market-change { color: $primary; }
.market-item.down .market-change { color: $danger; }
.stock-card { background: #fff; margin: 24rpx; border-radius: 20rpx; padding: 24rpx; }
.stock-top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24rpx; border-bottom: 1rpx solid $border-color; }
.stock-name { font-size: 32rpx; color: $text-primary; font-weight: 700; display: block; }
.stock-code { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.stock-price-wrap { text-align: right; }
.stock-price { font-size: 40rpx; color: $danger; font-weight: 700; display: block; }
.stock-change { font-size: 24rpx; font-weight: 600; }
.stock-change.up { color: $primary; }
.stock-change.down { color: $danger; }
.stock-info { display: flex; flex-wrap: wrap; padding-top: 24rpx; }
.info-cell { width: 33.33%; padding: 16rpx 0; text-align: center; }
.cell-lbl { font-size: 22rpx; color: $text-tertiary; display: block; }
.cell-val { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-top: 6rpx; }
.hot-section { background: #fff; margin: 24rpx; border-radius: 20rpx; padding: 10rpx 24rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.hot-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.hot-item:last-child { border-bottom: none; }
.hot-rank { width: 50rpx; font-size: 30rpx; color: $warning; font-weight: 700; }
.hot-info { flex: 1; }
.hot-name { font-size: 28rpx; color: $text-primary; display: block; }
.hot-code { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.hot-price { text-align: right; }
.price { font-size: 28rpx; color: $text-primary; font-weight: 700; display: block; }
.change { font-size: 22rpx; }
.change.up { color: $primary; }
.change.down { color: $danger; }
</style>
