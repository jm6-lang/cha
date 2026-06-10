<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🌐</view>
        <text class="header-title">在线翻译</text>
        <text class="header-desc">多语种 · 实时翻译</text>
      </view>
    </view>

    <view class="lang-bar">
      <view class="lang-select">
        <view class="lang-pill" @tap="onPickFrom">
          <text class="lang-name">{{ fromLangName }}</text>
          <text class="lang-arrow">▾</text>
        </view>
        <text class="lang-icon" @tap="swapLang">⇄</text>
        <view class="lang-pill" @tap="onPickTo">
          <text class="lang-name">{{ toLangName }}</text>
          <text class="lang-arrow">▾</text>
        </view>
      </view>
    </view>

    <view class="translate-card">
      <view class="input-section">
        <view class="section-header">
          <text class="section-title">{{ fromLangName }}</text>
          <text class="section-action" @tap="onClear">🗑️</text>
        </view>
        <textarea v-model="inputText" class="translate-input" placeholder="输入要翻译的内容（默认翻译为中文）" />
        <text class="char-count">{{ inputText.length }} / 5000</text>
      </view>

      <view class="output-section">
        <view class="section-header">
          <text class="section-title">{{ toLangName }}</text>
          <text class="section-action" v-if="output" @tap="onCopy">📋</text>
        </view>
        <view class="translate-output">
          <text v-if="loading" class="placeholder">🔄 翻译中...</text>
          <text v-else-if="output">{{ output }}</text>
          <text v-else class="placeholder">译文将显示在此</text>
        </view>
        <view v-if="audioUrl" class="audio-row">
          <text class="audio-icon">🔊</text>
          <text class="audio-text">点击播放语音</text>
        </view>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-btn primary" @tap="onTranslate">翻译</view>
    </view>

    <view v-if="showLangPicker" class="lang-modal" @tap.self="showLangPicker = false">
      <view class="lang-modal-content">
        <text class="lang-modal-title">选择语言</text>
        <view class="lang-modal-list">
          <view
            v-for="l in SUPPORTED_LANGS"
            :key="l.code"
            class="lang-modal-item"
            :class="{ active: l.code === (pickerTarget === 'from' ? fromLang : toLang) }"
            @tap="onSelectLang(l.code)"
          >
            <text>{{ l.name }}</text>
            <text v-if="l.code === (pickerTarget === 'from' ? fromLang : toLang)" class="check">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryTranslation, SUPPORTED_LANGS } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const fromLang = ref('zh');
const toLang = ref('en');
const inputText = ref('你好，欢迎使用数查翻译');
const output = ref('');
const audioUrl = ref('');
const loading = ref(false);
const showLangPicker = ref(false);
const pickerTarget = ref<'from' | 'to'>('from');

const fromLangName = computed(() => SUPPORTED_LANGS.find((l) => l.code === fromLang.value)?.name || fromLang.value);
const toLangName = computed(() => SUPPORTED_LANGS.find((l) => l.code === toLang.value)?.name || toLang.value);

const swapLang = () => {
  const t = fromLang.value;
  fromLang.value = toLang.value;
  toLang.value = t;
  const t2 = output.value;
  output.value = inputText.value;
  inputText.value = t2;
};

const onPickFrom = () => {
  pickerTarget.value = 'from';
  showLangPicker.value = true;
};
const onPickTo = () => {
  pickerTarget.value = 'to';
  showLangPicker.value = true;
};
const onSelectLang = (code: string) => {
  if (pickerTarget.value === 'from') fromLang.value = code;
  else toLang.value = code;
  showLangPicker.value = false;
};

const onClear = () => { inputText.value = ''; output.value = ''; audioUrl.value = ''; };

const onCopy = () => {
  uni.setClipboardData({ data: output.value });
};

const onTranslate = async () => {
  if (!inputText.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' });
    return;
  }
  loading.value = true;
  output.value = '';
  audioUrl.value = '';
  try {
    const r = await queryTranslation(inputText.value.trim(), toLang.value);
    if (r) {
      output.value = r.translatedText;
      audioUrl.value = r.audioUrl || '';
    } else {
      uni.showToast({ title: '翻译失败，请重试', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '翻译失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.lang-bar { display: flex; justify-content: center; padding: 30rpx 24rpx 0; }
.lang-select { background: #fff; border-radius: 50rpx; padding: 16rpx 30rpx; display: flex; align-items: center; gap: 24rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06); }
.lang-pill { display: flex; align-items: center; gap: 8rpx; }
.lang-name { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.lang-arrow { font-size: 22rpx; color: $text-tertiary; }
.lang-icon { font-size: 36rpx; color: $info; padding: 0 12rpx; }
.translate-card { background: #fff; margin: 24rpx; border-radius: 20rpx; padding: 24rpx; }
.input-section { padding-bottom: 24rpx; border-bottom: 1rpx solid $border-color; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.section-title { font-size: 26rpx; color: $text-secondary; }
.section-action { font-size: 32rpx; padding: 4rpx; }
.translate-input { width: 100%; min-height: 200rpx; font-size: 30rpx; color: $text-primary; }
.char-count { font-size: 22rpx; color: $text-tertiary; display: block; text-align: right; }
.output-section { padding-top: 24rpx; }
.translate-output { min-height: 200rpx; font-size: 30rpx; color: $text-primary; line-height: 1.5; }
.placeholder { color: $text-tertiary; }
.audio-row { display: flex; align-items: center; margin-top: 16rpx; padding: 12rpx 20rpx; background: $bg-page; border-radius: 12rpx; }
.audio-icon { font-size: 28rpx; margin-right: 8rpx; }
.audio-text { font-size: 24rpx; color: $text-secondary; }
.action-bar { display: flex; padding: 0 24rpx; gap: 20rpx; }
.action-btn { flex: 1; padding: 24rpx 0; text-align: center; background: #fff; border-radius: 16rpx; font-size: 28rpx; color: $text-primary; }
.action-btn.primary { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-weight: 600; }
.lang-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; }
.lang-modal-content { background: #fff; width: 100%; border-radius: 24rpx 24rpx 0 0; padding: 30rpx; max-height: 70vh; overflow-y: auto; }
.lang-modal-title { display: block; text-align: center; font-size: 30rpx; font-weight: 700; color: $text-primary; margin-bottom: 20rpx; }
.lang-modal-list { display: flex; flex-direction: column; }
.lang-modal-item { display: flex; justify-content: space-between; padding: 24rpx 20rpx; border-bottom: 1rpx solid $border-color; font-size: 28rpx; color: $text-primary; }
.lang-modal-item.active { color: $info; font-weight: 600; }
.lang-modal-item .check { color: $info; }
</style>
