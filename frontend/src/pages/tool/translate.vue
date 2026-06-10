<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌐</view>
        <text class="header-title">在线翻译</text>
        <text class="header-desc">多语种 · 语音 · 拍照</text>
      </view>
    </view>

    <view class="lang-bar">
      <view class="lang-select" @tap="swapLang">
        <text class="lang-name">{{ fromLang }}</text>
        <text class="lang-icon">⇄</text>
        <text class="lang-name">{{ toLang }}</text>
      </view>
    </view>

    <view class="translate-card">
      <view class="input-section">
        <view class="section-header">
          <text class="section-title">{{ fromLang }}</text>
          <text class="section-action">🎤</text>
        </view>
        <textarea v-model="inputText" class="translate-input" placeholder="输入要翻译的内容" />
        <text class="char-count">{{ inputText.length }} / 5000</text>
      </view>

      <view class="output-section">
        <view class="section-header">
          <text class="section-title">{{ toLang }}</text>
          <text class="section-action">📋</text>
        </view>
        <view class="translate-output">
          <text v-if="output">{{ output }}</text>
          <text v-else class="placeholder">译文将显示在此</text>
        </view>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-btn primary" @tap="onTranslate">翻译</view>
      <view class="action-btn">📷 拍照翻译</view>
    </view>

    <view class="lang-grid">
      <text class="section-title">热门语言</text>
      <view class="langs">
        <view v-for="l in langs" :key="l" class="lang-item">{{ l }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const fromLang = ref('中文');
const toLang = ref('英文');
const inputText = ref('你好，欢迎使用数查翻译服务');
const output = ref('');
const langs = ['英语', '日语', '韩语', '法语', '德语', '俄语', '西班牙语', '葡萄牙语', '阿拉伯语', '意大利语', '泰语', '越南语'];

const swapLang = () => {
  const tmp = fromLang.value;
  fromLang.value = toLang.value;
  toLang.value = tmp;
};

const onTranslate = () => {
  if (!inputText.value) {
    uni.showToast({ title: '请输入内容', icon: 'none' });
    return;
  }
  output.value = 'Hello, welcome to ShuCha translation service';
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.lang-bar { display: flex; justify-content: center; padding: 30rpx 24rpx 0; }
.lang-select { background: #fff; border-radius: 50rpx; padding: 16rpx 40rpx; display: flex; align-items: center; gap: 24rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06); }
.lang-name { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.lang-icon { font-size: 36rpx; color: $info; }
.translate-card { background: #fff; margin: 24rpx; border-radius: 20rpx; padding: 24rpx; }
.input-section { padding-bottom: 24rpx; border-bottom: 1rpx solid $border-color; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.section-title { font-size: 26rpx; color: $text-secondary; }
.section-action { font-size: 32rpx; }
.translate-input { width: 100%; min-height: 200rpx; font-size: 30rpx; color: $text-primary; }
.char-count { font-size: 22rpx; color: $text-tertiary; display: block; text-align: right; }
.output-section { padding-top: 24rpx; }
.translate-output { min-height: 200rpx; font-size: 30rpx; color: $text-primary; line-height: 1.5; }
.placeholder { color: $text-tertiary; }
.action-bar { display: flex; padding: 0 24rpx; gap: 20rpx; }
.action-btn { flex: 1; padding: 24rpx 0; text-align: center; background: #fff; border-radius: 16rpx; font-size: 28rpx; color: $text-primary; }
.action-btn.primary { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-weight: 600; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.langs { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: flex; flex-wrap: wrap; gap: 16rpx; }
.lang-item { font-size: 24rpx; color: $text-secondary; background: $bg-page; padding: 12rpx 24rpx; border-radius: 10rpx; }
</style>
