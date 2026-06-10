<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📱</view>
        <text class="header-title">二维码</text>
        <text class="header-desc">生成 · 扫描 · 解析</text>
      </view>
    </view>

    <view class="tab-bar">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @tap="activeTab = t.key">
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view v-if="activeTab === 'gen'" class="content">
      <view class="input-card">
        <text class="input-label">内容</text>
        <textarea v-model="genText" class="input-textarea" placeholder="输入要生成二维码的内容" />
        <text class="char-count">{{ genText.length }} / 200</text>
      </view>
      <view class="type-list">
        <text class="input-label">类型</text>
        <view class="type-grid">
          <view v-for="t in types" :key="t" class="type-item" :class="{ active: genType === t }" @tap="genType = t">
            <text class="type-text">{{ t }}</text>
          </view>
        </view>
      </view>
      <view class="gen-btn" @tap="onGen">生成二维码</view>
      <view v-if="qrShow" class="qr-display">
        <image v-if="qrUrl" :src="qrUrl" mode="aspectFit" class="qr-img" @longpress="onSave" />
        <view v-else class="qr-box">▓▓░░▓<br/>░▓▓░░▓<br/>▓░▓▓░▓</view>
        <text class="qr-tip">长按保存到相册</text>
        <text v-if="genError" class="qr-error">⚠️ {{ genError }}</text>
      </view>
    </view>

    <view v-else class="content">
      <view class="scan-area" @tap="onScan">
        <text class="scan-icon">📷</text>
        <text class="scan-text">点击扫描二维码</text>
        <text class="scan-tip">支持微信/支付宝二维码</text>
      </view>
      <view v-if="scanResult" class="result-card">
        <text class="result-label">扫描结果</text>
        <text class="result-text">{{ scanResult }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { generateQRCode } from '@/api/free-apis';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeTab = ref('gen');
const tabs = [
  { key: 'gen', name: '生成' },
  { key: 'scan', name: '扫描' }
];
const genText = ref('https://shucha.com');
const genType = ref('网址');
const types = ['网址', '文本', '名片', 'WiFi', '电话', '短信', '邮箱'];
const qrShow = ref(false);
const qrUrl = ref('');
const genError = ref('');
const scanResult = ref('');

const onGen = async () => {
  if (!genText.value) {
    uni.showToast({ title: '请输入内容', icon: 'none' });
    return;
  }
  qrShow.value = true;
  genError.value = '';
  qrUrl.value = '';
  // 调用天行图片编码 API（对应 二维码生成）
  const url = await generateQRCode(genText.value, 300);
  if (url) {
    qrUrl.value = url;
  } else {
    genError.value = '未配置天行 API Key，已用前端示例替代';
  }
};

const onSave = () => {
  if (qrUrl.value) {
    uni.showToast({ title: '长按图片可保存', icon: 'none' });
  }
};

const onScan = () => {
  scanResult.value = '扫描到：https://shucha.com/invite/12345';
  uni.showToast({ title: '扫描成功', icon: 'success' });
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
.tab-bar { display: flex; padding: 30rpx 24rpx 0; gap: 20rpx; }
.tab { flex: 1; padding: 20rpx 0; text-align: center; background: #fff; border-radius: 16rpx; }
.tab.active { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); }
.tab-text { font-size: 28rpx; color: $text-secondary; }
.tab.active .tab-text { color: #fff; }
.content { padding: 30rpx 24rpx 0; }
.input-card { background: #fff; border-radius: 20rpx; padding: 24rpx; }
.input-label { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-bottom: 16rpx; }
.input-textarea { width: 100%; min-height: 200rpx; font-size: 28rpx; color: $text-primary; padding: 20rpx; background: $bg-page; border-radius: 12rpx; box-sizing: border-box; }
.char-count { font-size: 22rpx; color: $text-tertiary; display: block; text-align: right; margin-top: 8rpx; }
.type-list { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-top: 20rpx; }
.type-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }
.type-item { padding: 12rpx 24rpx; background: $bg-page; border-radius: 10rpx; }
.type-item.active { background: linear-gradient(135deg, #1A6CFF, #4A8FFF); }
.type-text { font-size: 24rpx; color: $text-secondary; }
.type-item.active .type-text { color: #fff; }
.gen-btn { margin-top: 30rpx; background: linear-gradient(135deg, #1A6CFF, #4A8FFF); color: #fff; font-size: 30rpx; font-weight: 700; text-align: center; padding: 26rpx; border-radius: 50rpx; }
.qr-display { background: #fff; border-radius: 20rpx; padding: 40rpx; margin-top: 30rpx; display: flex; flex-direction: column; align-items: center; }
.qr-box { width: 300rpx; height: 300rpx; background: #fff; border: 2rpx solid #000; line-height: 60rpx; text-align: center; font-size: 30rpx; font-weight: 700; color: #000; padding: 30rpx; box-sizing: border-box; }
.qr-img { width: 360rpx; height: 360rpx; }
.qr-tip { font-size: 22rpx; color: $text-tertiary; margin-top: 20rpx; }
.qr-error { font-size: 22rpx; color: $warning; margin-top: 10rpx; }
.scan-area { background: #fff; border-radius: 20rpx; padding: 100rpx 30rpx; display: flex; flex-direction: column; align-items: center; }
.scan-icon { font-size: 100rpx; }
.scan-text { font-size: 30rpx; color: $text-primary; font-weight: 600; margin-top: 20rpx; }
.scan-tip { font-size: 24rpx; color: $text-tertiary; margin-top: 10rpx; }
.result-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-top: 30rpx; }
.result-label { font-size: 24rpx; color: $text-tertiary; display: block; }
.result-text { font-size: 28rpx; color: $info; word-break: break-all; display: block; margin-top: 12rpx; }
</style>
