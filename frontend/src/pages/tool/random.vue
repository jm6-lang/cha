<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🎲</view>
        <text class="header-title">随机工具</text>
        <text class="header-desc">号码 · 数字 · 颜色 · 决策</text>
      </view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tab" :class="{ active: activeTab === t }" @tap="activeTab = t">
        <text class="tab-text">{{ t }}</text>
      </view>
    </view>

    <view class="content">
      <view v-if="activeTab === '号码'" class="card">
        <text class="card-label">生成手机号</text>
        <view class="number-display">
          <text class="num-text">{{ phoneNum }}</text>
        </view>
        <view class="card-actions">
          <view class="action" @tap="genPhone">🎲 生成</view>
          <view class="action">📋 复制</view>
        </view>
      </view>

      <view v-if="activeTab === '数字'" class="card">
        <text class="card-label">随机数字</text>
        <view class="range-bar">
          <view class="range-cell">
            <text class="r-lbl">最小</text>
            <text class="r-val">{{ rangeMin }}</text>
          </view>
          <text class="range-sep">~</text>
          <view class="range-cell">
            <text class="r-lbl">最大</text>
            <text class="r-val">{{ rangeMax }}</text>
          </view>
        </view>
        <view class="number-display">
          <text class="num-text">{{ randomNum }}</text>
        </view>
        <view class="card-actions">
          <view class="action" @tap="genNum">🎲 生成</view>
        </view>
      </view>

      <view v-if="activeTab === '颜色'" class="card">
        <text class="card-label">随机颜色</text>
        <view class="color-display" :style="{ background: colorHex }">
          <text class="color-text">{{ colorHex }}</text>
        </view>
        <view class="card-actions">
          <view class="action" @tap="genColor">🎲 生成</view>
        </view>
      </view>

      <view v-if="activeTab === '决策'" class="card">
        <text class="card-label">帮我决定</text>
        <input v-model="decision" class="decision-input" placeholder="输入选项，逗号分隔" />
        <view class="decision-display">
          <text class="decision-text">{{ decisionResult || '点击下方按钮' }}</text>
        </view>
        <view class="card-actions">
          <view class="action" @tap="genDecision">🎯 决定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeTab = ref('号码');
const tabs = ['号码', '数字', '颜色', '决策'];
const phoneNum = ref('138 0013 8000');
const rangeMin = ref(1);
const rangeMax = ref(100);
const randomNum = ref(50);
const colorHex = ref('#07C160');
const decision = ref('吃饭,睡觉,打游戏,看剧');
const decisionResult = ref('');

const genPhone = () => {
  const prefix = ['138', '139', '150', '186', '188', '199'][Math.floor(Math.random() * 6)];
  let rest = '';
  for (let i = 0; i < 8; i++) rest += Math.floor(Math.random() * 10);
  phoneNum.value = `${prefix} ${rest.slice(0, 4)} ${rest.slice(4)}`;
};

const genNum = () => {
  randomNum.value = Math.floor(Math.random() * (rangeMax.value - rangeMin.value + 1)) + rangeMin.value;
};

const genColor = () => {
  const h = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  colorHex.value = h.toUpperCase();
};

const genDecision = () => {
  const list = decision.value.split(/[,，]/).filter(s => s.trim());
  if (list.length === 0) {
    uni.showToast({ title: '请输入选项', icon: 'none' });
    return;
  }
  decisionResult.value = list[Math.floor(Math.random() * list.length)];
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.tabs { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; }
.tab { flex: 1; padding: 20rpx 0; text-align: center; background: #fff; border-radius: 16rpx; }
.tab.active { background: linear-gradient(135deg, #7B61FF, #A78BFA); }
.tab-text { font-size: 28rpx; color: $text-secondary; }
.tab.active .tab-text { color: #fff; }
.content { padding: 30rpx 24rpx 0; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; }
.card-label { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-bottom: 20rpx; }
.number-display { background: $bg-page; border-radius: 16rpx; padding: 60rpx 30rpx; text-align: center; margin: 20rpx 0; }
.num-text { font-size: 50rpx; color: $text-primary; font-weight: 700; letter-spacing: 4rpx; }
.card-actions { display: flex; gap: 20rpx; }
.action { flex: 1; padding: 20rpx 0; text-align: center; background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 28rpx; font-weight: 600; border-radius: 16rpx; }
.range-bar { display: flex; align-items: center; gap: 20rpx; }
.range-cell { flex: 1; text-align: center; background: $bg-page; padding: 20rpx 0; border-radius: 12rpx; }
.r-lbl { font-size: 22rpx; color: $text-tertiary; display: block; }
.r-val { font-size: 36rpx; color: $text-primary; font-weight: 700; display: block; margin-top: 6rpx; }
.range-sep { font-size: 30rpx; color: $text-tertiary; }
.color-display { height: 300rpx; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; margin: 20rpx 0; transition: background 0.3s; }
.color-text { font-size: 40rpx; color: #fff; font-weight: 700; text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3); }
.decision-input { width: 100%; height: 80rpx; padding: 0 20rpx; font-size: 28rpx; background: $bg-page; border-radius: 12rpx; }
.decision-display { background: $bg-page; border-radius: 16rpx; padding: 60rpx 30rpx; text-align: center; margin: 20rpx 0; min-height: 100rpx; }
.decision-text { font-size: 40rpx; color: $primary; font-weight: 700; }
</style>
