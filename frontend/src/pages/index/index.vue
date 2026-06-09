<template>
  <view class="container">
    <view class="hero card">
      <view class="logo">数查</view>
      <view class="slogan">先查公开标记，再决定怎么联系</view>
    </view>

    <view class="search-box card">
      <NumberInput v-model="phone" />
      <button class="btn-primary" :disabled="!canQuery" @tap="onQuery">立即查询</button>
      <view class="hint">支持手机号、固话、400/95 号码</view>
    </view>

    <view class="features card">
      <view class="features-title">围绕号码排查的三类能力</view>
      <view class="feature" v-for="(f, i) in features" :key="i" @tap="goFeature(f)">
        <view class="feature-icon" :style="{ background: f.color }">{{ f.icon }}</view>
        <view class="feature-info">
          <text class="feature-name">{{ f.name }}</text>
          <text class="feature-desc">{{ f.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NumberInput from '@/components/NumberInput.vue';

const phone = ref('');

const canQuery = computed(() => {
  const p = phone.value.trim();
  return p.length >= 7 && p.length <= 13;
});

function onQuery() {
  uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(phone.value.trim())}` });
}

const features = [
  { name: '查询历史', icon: '📋', desc: '查看过往的号码查询记录', color: '#1A6CFF', path: '/pages/hcc/history' },
  { name: '个人中心', icon: '👤', desc: '账户信息、会员、设置', color: '#00B578', path: '/pages/user/profile' },
  { name: '号码估值', icon: '💎', desc: '靓号评估与价值分析', color: '#FF8F1F', path: '' },
  { name: '企业认证', icon: '🏢', desc: '提升企业外呼接通率', color: '#7C4DFF', path: '' }
];

function goFeature(f: any) {
  if (f.path) uni.navigateTo({ url: f.path });
  else uni.showToast({ title: `${f.name} - 即将上线`, icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.hero {
  text-align: center;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, $primary 0%, #4A8AFF 100%);
  color: #fff;
  border-radius: $radius-lg;
  margin-bottom: 24rpx;
}

.hero .logo {
  font-size: 64rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
}

.hero .slogan {
  font-size: 26rpx;
  opacity: 0.9;
}

.search-box {
  margin-bottom: 24rpx;
}

.search-box .btn-primary {
  margin-top: 24rpx;
  width: 100%;
}

.search-box .hint {
  text-align: center;
  color: $text-tertiary;
  font-size: 24rpx;
  margin-top: 16rpx;
}

.features .features-title {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 24rpx;
  color: $text-primary;
}

.features .feature {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;
}

.features .feature:last-child {
  border-bottom: none;
}

.features .feature-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #fff;
  margin-right: 20rpx;
}

.features .feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.features .feature-name {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.features .feature-desc {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
