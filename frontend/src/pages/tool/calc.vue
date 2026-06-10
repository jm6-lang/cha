<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🧮</view>
        <text class="header-title">计算器</text>
        <text class="header-desc">科学计算/单位换算/汇率换算</text>
      </view>
    </view>

    <view class="calc-card">
      <view class="calc-display">
        <text class="display-formula">{{ display }}</text>
        <text class="display-result">{{ result }}</text>
      </view>

      <view class="calc-pad">
        <view class="calc-row">
          <view class="key func" @tap="onKey('C')">
            <text class="key-text">C</text>
          </view>
          <view class="key func" @tap="onKey('±')">
            <text class="key-text">±</text>
          </view>
          <view class="key func" @tap="onKey('%')">
            <text class="key-text">%</text>
          </view>
          <view class="key op" @tap="onKey('÷')">
            <text class="key-text">÷</text>
          </view>
        </view>
        <view class="calc-row">
          <view class="key num" @tap="onKey('7')">
            <text class="key-text">7</text>
          </view>
          <view class="key num" @tap="onKey('8')">
            <text class="key-text">8</text>
          </view>
          <view class="key num" @tap="onKey('9')">
            <text class="key-text">9</text>
          </view>
          <view class="key op" @tap="onKey('×')">
            <text class="key-text">×</text>
          </view>
        </view>
        <view class="calc-row">
          <view class="key num" @tap="onKey('4')">
            <text class="key-text">4</text>
          </view>
          <view class="key num" @tap="onKey('5')">
            <text class="key-text">5</text>
          </view>
          <view class="key num" @tap="onKey('6')">
            <text class="key-text">6</text>
          </view>
          <view class="key op" @tap="onKey('-')">
            <text class="key-text">-</text>
          </view>
        </view>
        <view class="calc-row">
          <view class="key num" @tap="onKey('1')">
            <text class="key-text">1</text>
          </view>
          <view class="key num" @tap="onKey('2')">
            <text class="key-text">2</text>
          </view>
          <view class="key num" @tap="onKey('3')">
            <text class="key-text">3</text>
          </view>
          <view class="key op" @tap="onKey('+')">
            <text class="key-text">+</text>
          </view>
        </view>
        <view class="calc-row">
          <view class="key zero num" @tap="onKey('0')">
            <text class="key-text">0</text>
          </view>
          <view class="key num" @tap="onKey('.')">
            <text class="key-text">.</text>
          </view>
          <view class="key op" @tap="onKey('=')">
            <text class="key-text">=</text>
          </view>
        </view>
      </view>
    </view>

    <view class="tool-list">
      <text class="section-title">更多计算工具</text>
      <view
        v-for="t in tools"
        :key="t.name"
        class="tool-item"
        @tap="onToolTap(t)"
      >
        <view class="tool-icon" :style="{ background: t.color }">
          <text class="ti-text">{{ t.icon }}</text>
        </view>
        <view class="tool-info">
          <text class="tool-name">{{ t.name }}</text>
          <text class="tool-desc">{{ t.desc }}</text>
        </view>
        <text class="tool-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const display = ref('');
const result = ref('0');

const tools = ref([
  { name: '汇率换算', desc: '100+ 货币实时汇率', icon: '💱', color: '#E0F7FA' },
  { name: '单位换算', desc: '长度重量面积温度', icon: '📏', color: '#FFF3E0' },
  { name: '进制转换', desc: '二进制/八进制/十六进制', icon: '🔢', color: '#F3E5F5' },
  { name: '房贷计算', desc: '月供总额利息计算', icon: '🏠', color: '#E8F5E9' },
  { name: '个税计算', desc: '税前税后工资计算', icon: '💰', color: '#FCE4EC' },
  { name: '年龄计算', desc: '虚岁周岁生肖星座', icon: '🎂', color: '#FFF8E1' },
]);

function onKey(k: string) {
  if (k === 'C') {
    display.value = '';
    result.value = '0';
    return;
  }
  if (k === '±') {
    if (display.value.startsWith('-')) display.value = display.value.substring(1);
    else display.value = '-' + display.value;
    return;
  }
  if (k === '%') {
    try {
      const r = (eval(display.value.replace(/×/g, '*').replace(/÷/g, '/')) / 100).toString();
      display.value = r;
      result.value = r;
    } catch { result.value = '错误'; }
    return;
  }
  if (k === '=') {
    try {
      const r = eval(display.value.replace(/×/g, '*').replace(/÷/g, '/')).toString();
      result.value = r;
      display.value = r;
    } catch { result.value = '错误'; }
    return;
  }
  if (display.value === '0' && /[0-9]/.test(k)) {
    display.value = k;
  } else {
    display.value += k;
  }
}

function onToolTap(t: any) {
  uni.showToast({ title: `${t.name} - 即将上线`, icon: 'none' });
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
  background: linear-gradient(180deg, #5C6BC0 0%, #283593 100%);
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

/* 计算器 */
.calc-card {
  background: $bg-card;
  margin: -28rpx 24rpx 0;
  border-radius: $radius-lg;
  overflow: hidden;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.calc-display {
  background: $bg-grey;
  padding: 32rpx 28rpx;
  min-height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.display-formula {
  font-size: 28rpx;
  color: $text-tertiary;
  font-family: monospace;
  margin-bottom: 8rpx;
  min-height: 36rpx;
}

.display-result {
  font-size: 64rpx;
  font-weight: 700;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 2rpx;
}

.calc-pad {
  display: flex;
  flex-direction: column;
}

.calc-row {
  display: flex;
}

.key {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  border: 1rpx solid $border-light;
  margin: -1rpx 0 0 -1rpx;
}

.key:active {
  background: $bg-grey;
}

.key.zero {
  flex: 2;
}

.key.func {
  background: $bg-grey;
}

.key.op {
  background: $primary;
}

.key.op:active {
  opacity: 0.85;
}

.key-text {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-primary;
}

.key.func .key-text {
  color: $text-primary;
}

.key.op .key-text {
  color: #fff;
  font-size: 40rpx;
}

/* 工具列表 */
.tool-list {
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
  border-left: 6rpx solid $info;
  line-height: 1;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.ti-text {
  font-size: 40rpx;
}

.tool-info {
  flex: 1;
}

.tool-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.tool-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}

.tool-arrow {
  font-size: 36rpx;
  color: $text-tertiary;
  font-weight: 300;
  flex-shrink: 0;
  margin-left: 12rpx;
}
</style>
