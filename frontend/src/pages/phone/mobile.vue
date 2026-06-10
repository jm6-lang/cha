<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📱</view>
        <text class="header-title">手机号码</text>
        <text class="header-desc">手机归属地 · 运营商 · 在网时长</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="phone" type="number" class="search-input" placeholder="输入11位手机号" placeholder-class="placeholder" maxlength="11" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="phone-display">
        <text class="phone-num">{{ formatPhone(phone) }}</text>
        <text class="phone-tag" :class="{ valid: isValid }">{{ isValid ? '有效号码' : '无效号码' }}</text>
      </view>
      <view class="info-list">
        <view class="info-row">
          <text class="info-label">归属地</text>
          <text class="info-value">{{ result.area }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">运营商</text>
          <text class="info-value">{{ result.carrier }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">号段</text>
          <text class="info-value">{{ result.segment }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">区号</text>
          <text class="info-value">{{ result.areaCode }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">邮编</text>
          <text class="info-value">{{ result.zip }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">卡类型</text>
          <text class="info-value">{{ result.cardType }}</text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="tips-block">
      <view class="tip-card">
        <text class="tip-emoji">📍</text>
        <text class="tip-title">精确到城市</text>
        <text class="tip-desc">支持全国 300+ 城市归属地查询</text>
      </view>
      <view class="tip-card">
        <text class="tip-emoji">📡</text>
        <text class="tip-title">三大运营商</text>
        <text class="tip-desc">移动/联通/电信/虚拟运营商全覆盖</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const phone = ref('');
const searched = ref(false);

const isValid = computed(() => /^1[3-9]\d{9}$/.test(phone.value));

const result = ref({
  area: '北京市',
  carrier: '中国移动',
  segment: '138****',
  areaCode: '010',
  zip: '100000',
  cardType: '全球通'
});

const formatPhone = (p: string) => {
  if (!p) return '';
  return p.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1 $2 $3').trim();
};

const onSearch = () => {
  if (!isValid.value) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #07C160, #4DD599); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #07C160, #4DD599); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.phone-display { background: linear-gradient(135deg, #07C160, #4DD599); padding: 50rpx 30rpx; text-align: center; }
.phone-num { font-size: 56rpx; color: #fff; font-weight: 700; display: block; letter-spacing: 4rpx; }
.phone-tag { display: inline-block; margin-top: 16rpx; padding: 6rpx 20rpx; background: rgba(255,255,255,0.25); color: #fff; font-size: 22rpx; border-radius: 20rpx; }
.phone-tag.valid { background: #fff; color: $primary; }
.info-list { padding: 10rpx 30rpx; }
.info-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 26rpx; color: $text-secondary; }
.info-value { font-size: 26rpx; color: $text-primary; font-weight: 500; }
.tips-block { padding: 30rpx 24rpx; }
.tip-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; display: flex; align-items: center; }
.tip-emoji { font-size: 50rpx; margin-right: 20rpx; }
.tip-title { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; }
.tip-desc { font-size: 24rpx; color: $text-secondary; display: block; margin-top: 6rpx; }
</style>
