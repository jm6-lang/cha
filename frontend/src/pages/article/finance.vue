<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💰</view>
        <text class="header-title">金融资讯</text>
        <text class="header-desc">黄金 · 银行金条 · 品牌金价</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在获取最新金价...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="!loading && !error && result" class="content">
      <view class="date-block">
        <text class="date-text">📅 {{ result.date }} 报价</text>
        <text class="date-refresh" @tap="onRefresh">🔄 刷新</text>
      </view>

      <!-- 黄金现货 -->
      <view class="section">
        <text class="section-title">📈 贵金属行情</text>
        <view class="metals-list">
          <view v-for="m in result.metals" :key="m.name" class="metal-item">
            <text class="m-name">{{ m.name }}</text>
            <view class="m-prices">
              <text class="m-price">¥{{ m.sellPrice }}</text>
              <text class="m-unit">/{{ m.unit }}</text>
            </view>
            <view v-if="m.highPrice && m.lowPrice" class="m-range">
              <text class="mr-item mr-low">低 {{ m.lowPrice }}</text>
              <text class="mr-item mr-high">高 {{ m.highPrice }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 品牌金价 -->
      <view v-if="result.brands.length" class="section">
        <text class="section-title">💍 品牌金店</text>
        <view class="brand-list">
          <view v-for="(b, i) in result.brands" :key="i" class="brand-item">
            <text class="b-name">{{ b.brand }}</text>
            <text class="b-price">{{ b.formatted || b.price + '元/克' }}</text>
          </view>
        </view>
      </view>

      <!-- 银行金条 -->
      <view v-if="result.banks.length" class="section">
        <text class="section-title">🏦 银行金条</text>
        <view class="bank-list">
          <view v-for="(b, i) in result.banks" :key="i" class="bank-item">
            <text class="b-name">{{ b.bank }}</text>
            <text class="b-product">{{ b.product }}</text>
            <text class="b-price">{{ b.formatted || b.price + '元/克' }}</text>
          </view>
        </view>
      </view>

      <!-- 黄金回收 -->
      <view v-if="result.recycle.length" class="section">
        <text class="section-title">♻️ 黄金回收</text>
        <view class="recycle-list">
          <view v-for="(r, i) in result.recycle" :key="i" class="recycle-item">
            <view class="r-left">
              <text class="r-type">{{ r.type }}</text>
              <text v-if="r.purity" class="r-purity">纯度: {{ r.purity }}</text>
            </view>
            <text class="r-price">{{ r.formatted || r.price + '元/克' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { queryGoldPrice, type GoldResult } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const loading = ref(false);
const error = ref('');
const result = ref<GoldResult | null>(null);

const loadData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const r = await queryGoldPrice();
    if (!r) error.value = '获取金价失败，请稍后重试';
    else result.value = r;
  } catch (e) {
    error.value = '加载异常';
  } finally {
    loading.value = false;
  }
};

const onRefresh = () => loadData();

loadData();
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.content { padding: 30rpx 24rpx 0; }
.date-block { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.date-text { font-size: 26rpx; color: $text-secondary; }
.date-refresh { font-size: 24rpx; color: $info; padding: 8rpx 16rpx; background: rgba(26,108,255,0.08); border-radius: 20rpx; }
.section { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 24rpx; }
.section-title { display: block; font-size: 30rpx; font-weight: 700; color: $text-primary; margin-bottom: 20rpx; padding-left: 8rpx; border-left: 6rpx solid #D4AF37; line-height: 1; }
.metals-list { display: flex; flex-direction: column; gap: 16rpx; }
.metal-item { padding: 20rpx; background: linear-gradient(135deg, #FFF8E1, #FFFEF7); border-radius: 14rpx; }
.m-name { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-bottom: 8rpx; }
.m-prices { display: flex; align-items: baseline; }
.m-price { font-size: 40rpx; color: #D4AF37; font-weight: 700; }
.m-unit { font-size: 22rpx; color: $text-tertiary; margin-left: 6rpx; }
.m-range { display: flex; gap: 20rpx; margin-top: 8rpx; }
.mr-item { font-size: 22rpx; }
.mr-low { color: $primary; }
.mr-high { color: #FF5252; }
.brand-list, .bank-list, .recycle-list { display: flex; flex-direction: column; gap: 8rpx; }
.brand-item, .bank-item { display: flex; justify-content: space-between; align-items: center; padding: 18rpx 20rpx; background: $bg-page; border-radius: 12rpx; }
.b-name { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.b-product { font-size: 22rpx; color: $text-tertiary; margin: 0 12rpx; flex: 1; }
.b-price { font-size: 28rpx; color: #D4AF37; font-weight: 700; }
.recycle-item { display: flex; justify-content: space-between; align-items: center; padding: 18rpx 20rpx; background: $bg-page; border-radius: 12rpx; }
.r-left { display: flex; flex-direction: column; gap: 4rpx; }
.r-type { font-size: 28rpx; color: $text-primary; font-weight: 600; }
.r-purity { font-size: 22rpx; color: $text-tertiary; }
.r-price { font-size: 28rpx; color: $text-primary; font-weight: 700; }
</style>
