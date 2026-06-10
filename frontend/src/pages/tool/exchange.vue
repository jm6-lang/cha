<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💱</view>
        <text class="header-title">汇率换算</text>
        <text class="header-desc">100+ 货币实时汇率</text>
      </view>
    </view>

    <view class="convert-card">
      <view class="convert-row">
        <view class="convert-side">
          <view class="ccy-selector" @tap="onSelectCcy('from')">
            <text class="ccy-flag">{{ fromCcy.flag }}</text>
            <text class="ccy-code">{{ fromCcy.code }}</text>
            <text class="ccy-arrow">▾</text>
          </view>
          <input
            v-model="fromAmount"
            class="ccy-input"
            type="digit"
            placeholder="0"
            placeholder-class="placeholder"
            @input="convert"
          />
        </view>
        <view class="convert-switch" @tap="onSwitch">
          <text class="switch-icon">⇄</text>
        </view>
        <view class="convert-side">
          <view class="ccy-selector" @tap="onSelectCcy('to')">
            <text class="ccy-flag">{{ toCcy.flag }}</text>
            <text class="ccy-code">{{ toCcy.code }}</text>
            <text class="ccy-arrow">▾</text>
          </view>
          <input
            v-model="toAmount"
            class="ccy-input"
            type="digit"
            placeholder="0"
            placeholder-class="placeholder"
            disabled
          />
        </view>
      </view>
      <view class="rate-info">
        <text class="rate-text">1 {{ fromCcy.code }} ≈ {{ rate.toFixed(4) }} {{ toCcy.code }}</text>
        <text class="rate-update">数据更新于 {{ updateTime }}</text>
      </view>
    </view>

    <view class="quick-list">
      <text class="section-title">热门货币</text>
      <view class="quick-grid">
        <view
          v-for="c in quickCurrencies"
          :key="c.code"
          class="quick-item"
          @tap="onQuickPick(c)"
        >
          <text class="quick-flag">{{ c.flag }}</text>
          <text class="quick-code">{{ c.code }}</text>
          <text class="quick-name">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="rate-list">
      <text class="section-title">汇率表</text>
      <view class="rate-table">
        <view class="rate-row rate-head">
          <text class="rate-cell">货币</text>
          <text class="rate-cell">现汇买入</text>
          <text class="rate-cell">现钞卖出</text>
        </view>
        <view
          v-for="(c, i) in rateTable"
          :key="c.code"
          class="rate-row"
        >
          <text class="rate-cell">
            <text class="cell-flag">{{ c.flag }} </text>{{ c.code }} {{ c.name }}
          </text>
          <text class="rate-cell">{{ c.buy }}</text>
          <text class="rate-cell">{{ c.sell }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const fromCcy = ref({ code: 'CNY', name: '人民币', flag: '🇨🇳' });
const toCcy = ref({ code: 'USD', name: '美元', flag: '🇺🇸' });

const fromAmount = ref('100');
const toAmount = ref('');

// 模拟汇率(基于 1 CNY = 0.14 USD)
const rates: Record<string, number> = {
  USD: 0.1402, EUR: 0.1289, GBP: 0.1102, JPY: 21.32, HKD: 1.0952,
  KRW: 192.5, AUD: 0.2156, CAD: 0.1912, SGD: 0.1891, THB: 5.0123,
  RUB: 13.25, INR: 11.78, BRL: 0.7562, ZAR: 2.5421, MXN: 2.6891,
  CHF: 0.1245, NZD: 0.2312, SEK: 1.5231, NOK: 1.5231, DKK: 0.9651,
};

const rate = computed(() => {
  if (fromCcy.value.code === toCcy.value.code) return 1;
  if (fromCcy.value.code === 'CNY') return rates[toCcy.value.code] || 1;
  if (toCcy.value.code === 'CNY') return 1 / (rates[fromCcy.value.code] || 1);
  return (rates[toCcy.value.code] || 1) / (rates[fromCcy.value.code] || 1);
});

const updateTime = ref('2024-12-01 10:30');

function convert() {
  const a = parseFloat(fromAmount.value);
  if (isNaN(a)) {
    toAmount.value = '';
    return;
  }
  toAmount.value = (a * rate.value).toFixed(2);
}

function onSwitch() {
  const tmp = fromCcy.value;
  fromCcy.value = toCcy.value;
  toCcy.value = tmp;
  fromAmount.value = toAmount.value || '100';
  convert();
}

function onSelectCcy(type: string) {
  uni.showActionSheet({
    itemList: ['人民币 CNY', '美元 USD', '欧元 EUR', '英镑 GBP', '日元 JPY', '港币 HKD', '韩元 KRW', '澳元 AUD', '加元 CAD', '新币 SGD'],
    success: (res) => {
      const map: Record<number, any> = {
        0: { code: 'CNY', name: '人民币', flag: '🇨🇳' },
        1: { code: 'USD', name: '美元', flag: '🇺🇸' },
        2: { code: 'EUR', name: '欧元', flag: '🇪🇺' },
        3: { code: 'GBP', name: '英镑', flag: '🇬🇧' },
        4: { code: 'JPY', name: '日元', flag: '🇯🇵' },
        5: { code: 'HKD', name: '港币', flag: '🇭🇰' },
        6: { code: 'KRW', name: '韩元', flag: '🇰🇷' },
        7: { code: 'AUD', name: '澳元', flag: '🇦🇺' },
        8: { code: 'CAD', name: '加元', flag: '🇨🇦' },
        9: { code: 'SGD', name: '新币', flag: '🇸🇬' },
      };
      if (type === 'from') fromCcy.value = map[res.tapIndex];
      else toCcy.value = map[res.tapIndex];
      convert();
    },
  });
}

const quickCurrencies = ref([
  { code: 'USD', name: '美元', flag: '🇺🇸' },
  { code: 'EUR', name: '欧元', flag: '🇪🇺' },
  { code: 'JPY', name: '日元', flag: '🇯🇵' },
  { code: 'HKD', name: '港币', flag: '🇭🇰' },
  { code: 'GBP', name: '英镑', flag: '🇬🇧' },
  { code: 'KRW', name: '韩元', flag: '🇰🇷' },
]);

const rateTable = ref([
  { code: 'USD', name: '美元', flag: '🇺🇸', buy: '7.0920', sell: '7.1350' },
  { code: 'EUR', name: '欧元', flag: '🇪🇺', buy: '7.6589', sell: '7.7589' },
  { code: 'JPY', name: '日元', flag: '🇯🇵', buy: '0.0468', sell: '0.0471' },
  { code: 'HKD', name: '港币', flag: '🇭🇰', buy: '0.9078', sell: '0.9130' },
  { code: 'GBP', name: '英镑', flag: '🇬🇧', buy: '9.0132', sell: '9.0735' },
]);

function onQuickPick(c: any) {
  toCcy.value = c;
  convert();
}

convert();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #00897B 0%, #00695C 100%);
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

/* 转换 */
.convert-card {
  background: $bg-card;
  margin: -28rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.convert-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.convert-side {
  flex: 1;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx;
}

.ccy-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
  padding: 8rpx 12rpx;
  background: $bg-card;
  border-radius: $radius-sm;
  align-self: flex-start;
  display: inline-flex;
}

.ccy-flag {
  font-size: 28rpx;
}

.ccy-code {
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
}

.ccy-arrow {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-left: 4rpx;
}

.ccy-input {
  width: 100%;
  height: 60rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 1rpx;
}

.placeholder {
  color: $text-placeholder;
}

.convert-switch {
  width: 64rpx;
  height: 64rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
}

.switch-icon {
  font-size: 36rpx;
  color: #fff;
  font-weight: 700;
}

.rate-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-top: 1rpx solid $border-light;
}

.rate-text {
  font-size: 26rpx;
  color: $text-primary;
  font-weight: 500;
}

.rate-update {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 热门 */
.quick-list {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid #00897B;
  line-height: 1;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  background: $bg-grey;
  border-radius: $radius-md;
}

.quick-flag {
  font-size: 40rpx;
  margin-bottom: 6rpx;
}

.quick-code {
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 2rpx;
}

.quick-name {
  font-size: 20rpx;
  color: $text-tertiary;
}

/* 表格 */
.rate-list {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.rate-table {
  display: flex;
  flex-direction: column;
}

.rate-row {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.rate-row:last-child {
  border-bottom: none;
}

.rate-head {
  background: $bg-grey;
  border-radius: $radius-sm;
  padding: 12rpx 16rpx;
  margin: 0 -8rpx 8rpx;
  border-bottom: none;
}

.rate-cell {
  flex: 1;
  font-size: 24rpx;
  color: $text-primary;
}

.rate-cell:nth-child(1) {
  flex: 2;
}

.rate-head .rate-cell {
  font-size: 22rpx;
  color: $text-tertiary;
  font-weight: 500;
}

.cell-flag {
  font-size: 22rpx;
}
</style>
