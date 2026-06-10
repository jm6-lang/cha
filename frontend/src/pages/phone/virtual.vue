<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌐</view>
        <text class="header-title">虚拟运营商</text>
        <text class="header-desc">识别虚拟号段及背后品牌</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">📱</text>
        <input
          v-model="phone"
          class="form-input"
          placeholder="请输入 11 位手机号"
          placeholder-class="placeholder"
          maxlength="11"
          type="number"
        />
        <text v-if="phone" class="search-clear" @tap="phone = ''">✕</text>
      </view>
      <view class="query-btn" :class="{ disabled: phone.length !== 11 }" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header" :style="{ background: result.isVirtual ? 'linear-gradient(135deg, #FF8A65, #E64A19)' : 'linear-gradient(135deg, #4FC3F7, #1976D2)' }">
        <view class="result-logo">
          <text class="result-logo-text">{{ result.isVirtual ? '虚' : '实' }}</text>
        </view>
        <view class="result-title-block">
          <text class="result-status">{{ result.isVirtual ? '虚拟运营商号段' : '三大基础运营商号段' }}</text>
          <text class="result-mask">{{ result.maskedPhone }}</text>
        </view>
      </view>

      <view class="result-list">
        <view class="result-row">
          <text class="row-label">实际运营商</text>
          <text class="row-value">{{ result.realCarrier }}</text>
        </view>
        <view class="result-row" v-if="result.isVirtual">
          <text class="row-label">虚拟商品牌</text>
          <text class="row-value highlight">{{ result.virtualBrand }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">所属号段</text>
          <text class="row-value mono">{{ result.segment }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">号段类型</text>
          <text class="row-value">{{ result.type }}</text>
        </view>
      </view>

      <view v-if="result.isVirtual" class="virtual-tip">
        <text class="tip-title">ℹ️ 虚拟号段说明</text>
        <text class="tip-text">• 虚拟运营商租用三大基础运营商网络</text>
        <text class="tip-text">• 虚拟号段常被用于营销、骚扰、诈骗</text>
        <text class="tip-text">• 接到来电需提高警惕，核实对方身份</text>
        <text class="tip-text">• 部分虚拟号段已支持携号转网</text>
      </view>
      <view v-else class="virtual-tip">
        <text class="tip-title">ℹ️ 基础号段说明</text>
        <text class="tip-text">• 此号段属于三大基础运营商之一</text>
        <text class="tip-text">• 通信安全有保障，可放心接听</text>
        <text class="tip-text">• 支持携号转网业务</text>
      </view>
    </view>

    <view class="brand-list-card">
      <text class="section-title">主流虚拟商品牌</text>
      <view class="brand-grid">
        <view
          v-for="b in virtualBrands"
          :key="b.name"
          class="brand-item"
        >
          <view class="brand-icon" :style="{ background: b.color }">
            <text class="brand-icon-text">{{ b.icon }}</text>
          </view>
          <text class="brand-name">{{ b.name }}</text>
          <text class="brand-segment">{{ b.segment }}</text>
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

const phone = ref('');
const result = ref<any>(null);

const virtualBrands = ref([
  { name: '阿里通信', icon: '阿', color: '#FF6A00', segment: '1700/1701/1702' },
  { name: '京东通信', icon: '京', color: '#E1251B', segment: '1703/1705/1706' },
  { name: '小米移动', icon: '米', color: '#FF6700', segment: '1704/1707/1708' },
  { name: '蜗牛移动', icon: '蜗', color: '#4CAF50', segment: '1709/171' },
  { name: '远特通信', icon: '远', color: '#9C27B0', segment: '162/165' },
  { name: '迪信通', icon: '迪', color: '#3F51B5', segment: '167' },
  { name: '乐语通信', icon: '乐', color: '#00BCD4', segment: '1709' },
  { name: '话机世界', icon: '话', color: '#795548', segment: '171' },
]);

const brandMap: Record<string, string> = {
  '1700': '阿里通信', '1701': '阿里通信', '1702': '阿里通信',
  '1703': '京东通信', '1705': '京东通信', '1706': '京东通信',
  '1704': '小米移动', '1707': '小米移动', '1708': '小米移动',
  '1709': '蜗牛移动', '171': '蜗牛移动',
  '162': '远特通信', '165': '远特通信',
  '167': '迪信通',
};

const virtualPrefixes = ['170', '171', '162', '165', '167'];
const realCarrierMap: Record<string, string> = {
  '13': '中国移动', '14[5-9]': '中国移动', '15[0-2]': '中国移动', '15[7-9]': '中国移动',
  '17[8]': '中国移动', '18[2-4]': '中国移动', '18[7-8]': '中国移动', '19[5-7]': '中国移动',
  '13[0-2]': '中国联通', '15[5-6]': '中国联通', '16[6]': '中国联通', '17[5-6]': '中国联通',
  '18[5-6]': '中国联通', '19[6]': '中国联通',
  '13[3]': '中国电信', '14[9]': '中国电信', '15[3]': '中国电信', '16[2]': '中国电信',
  '17[3]': '中国电信', '17[7]': '中国电信', '18[0-1]': '中国电信', '18[9]': '中国电信',
  '19[1]': '中国电信', '19[3]': '中国电信', '19[9]': '中国电信',
};

function getRealCarrier(prefix: string): string {
  for (const key in realCarrierMap) {
    const re = new RegExp('^' + key.replace(/\[/g, '[').replace(/\]/g, ']') + '');
    if (re.test(prefix)) {
      return realCarrierMap[key];
    }
  }
  return '中国移动';
}

function onQuery() {
  const p = phone.value.trim();
  if (p.length !== 11) {
    uni.showToast({ title: '请输入 11 位手机号', icon: 'none' });
    return;
  }
  if (!/^1\d{10}$/.test(p)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' });
    return;
  }

  const prefix4 = p.substring(0, 4);
  const prefix3 = p.substring(0, 3);
  const prefix4Digit = p.substring(0, 4);
  const segment = `${prefix3}xxxxxxx`;

  const isVirtual4 = virtualPrefixes.includes(prefix3);
  const isVirtualBy4 = brandMap[prefix4] !== undefined;

  const isVirtual = isVirtual4 || isVirtualBy4;
  let virtualBrand = '未知';
  if (brandMap[prefix4]) {
    virtualBrand = brandMap[prefix4];
  } else if (isVirtual4) {
    virtualBrand = '多家虚商共用号段';
  }

  result.value = {
    isVirtual,
    realCarrier: getRealCarrier(prefix3 + p[3]),
    virtualBrand,
    segment,
    maskedPhone: p.substring(0, 3) + '****' + p.substring(7),
    type: isVirtual ? '虚拟运营商' : '基础运营商',
  };
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
  background: linear-gradient(180deg, #FF8A65 0%, #E64A19 100%);
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

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.input-prefix {
  font-size: 32rpx;
  margin-right: 12rpx;
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

.query-btn {
  margin-top: 24rpx;
  height: 88rpx;
  background: $warning;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 138, 101, 0.3);
}

.query-btn.disabled {
  background: $text-placeholder;
  box-shadow: none;
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
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-header {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
}

.result-logo {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.result-logo-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.result-title-block {
  flex: 1;
}

.result-status {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.result-mask {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  font-family: monospace;
  letter-spacing: 1rpx;
}

.result-list {
  padding: 0 28rpx;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
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

.row-value.highlight {
  color: $warning;
  font-weight: 600;
}

.row-value.mono {
  font-family: monospace;
  letter-spacing: 1rpx;
}

.virtual-tip {
  margin: 16rpx 28rpx 28rpx;
  padding: 20rpx 24rpx;
  background: #FFF7E8;
  border-radius: $radius-md;
}

.tip-title {
  display: block;
  font-size: 26rpx;
  color: $warning;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.tip-text {
  display: block;
  font-size: 22rpx;
  color: $text-secondary;
  line-height: 1.8;
}

/* 品牌列表 */
.brand-list-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
  background: $bg-grey;
  border-radius: $radius-md;
}

.brand-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.brand-icon-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}

.brand-name {
  font-size: 22rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 2rpx;
}

.brand-segment {
  font-size: 18rpx;
  color: $text-tertiary;
  font-family: monospace;
}
</style>
