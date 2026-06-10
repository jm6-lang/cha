<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💍</view>
        <text class="header-title">婚姻状况</text>
        <text class="header-desc">婚姻登记 · 配偶信息 · 民政部数据</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-row">
        <text class="form-label">姓名</text>
        <input v-model="name" class="form-input" placeholder="请输入本人姓名" placeholder-class="placeholder" />
      </view>
      <view class="form-row">
        <text class="form-label">身份证号</text>
        <input v-model="idCard" class="form-input" placeholder="18位身份证号" placeholder-class="placeholder" maxlength="18" />
      </view>
      <view class="form-tip">⚠️ 本服务基于民政部权威数据，需本人授权</view>
      <view class="submit-btn" :class="{ disabled: !canQuery }" @tap="onQuery">
        <text class="submit-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询民政部数据...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header">
        <text class="r-title">查询结果</text>
        <text class="r-tag" :class="'tag-' + (result.status || '').toLowerCase()">{{ result.statusLabel }}</text>
      </view>
      <view class="grid-row">
        <text class="grid-label">查询对象</text>
        <text class="grid-value">{{ result.name }}</text>
      </view>
      <view class="grid-row">
        <text class="grid-label">身份证号</text>
        <text class="grid-value">{{ maskIdCard(result.idCard) }}</text>
      </view>
      <view class="grid-row" v-if="result.status === 'MARRIED'">
        <text class="grid-label">配偶姓名</text>
        <text class="grid-value">{{ result.spouseName || '—' }}</text>
      </view>
      <view class="grid-row" v-if="result.status === 'MARRIED'">
        <text class="grid-label">登记时间</text>
        <text class="grid-value">{{ result.regTime || '—' }}</text>
      </view>
      <view class="grid-row">
        <text class="grid-label">数据来源</text>
        <text class="grid-value">{{ result.source }}</text>
      </view>
      <view class="grid-row">
        <text class="grid-label">查询时间</text>
        <text class="grid-value">{{ queryTime }}</text>
      </view>
    </view>

    <view v-if="!hasApiKey" class="config-tip">
      <text class="tip-icon">🔑</text>
      <view class="tip-content">
        <text class="tip-title">需要企业 API 配置</text>
        <text class="tip-desc">婚姻核验 API 需企业资质。请到「我的 → 设置 → API 密钥配置」填入 Key 即可使用真实数据</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryMarriageSingle, type MarriageStatus } from '@/api/free-apis';

const statusBarHeight = ref(44);
statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 44;

const name = ref('');
const idCard = ref('');
const loading = ref(false);
const error = ref('');
const result = ref<MarriageStatus | null>(null);
const queryTime = ref('');
const hasApiKey = ref(true);

const canQuery = computed(() => name.value && idCard.value.length === 18);

function maskIdCard(s: string): string {
  if (!s || s.length < 8) return s;
  return s.substring(0, 4) + '**********' + s.substring(14);
}

const onQuery = async () => {
  if (!canQuery.value) {
    uni.showToast({ title: '请填写姓名和 18 位身份证', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    const r = await queryMarriageSingle(name.value, idCard.value);
    if (r) {
      result.value = r;
      queryTime.value = new Date().toLocaleString('zh-CN');
    } else {
      // 未配置 API Key 或查询失败 → 走示例数据
      hasApiKey.value = false;
      result.value = {
        name: name.value,
        idCard: idCard.value,
        status: 'UNMARRIED',
        statusLabel: '示例数据：未婚',
        source: '民政部（需企业 API）',
      };
      queryTime.value = new Date().toLocaleString('zh-CN');
      error.value = '未配置企业婚姻核验 API，已显示示例数据';
    }
  } catch (e) {
    error.value = '查询失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #E91E63, #F06292); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.form-card { background: #fff; margin: -40rpx 24rpx 0; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05); }
.form-row { display: flex; align-items: center; padding: 22rpx 0; border-bottom: 1rpx solid $border-color; }
.form-row:last-of-type { border-bottom: none; }
.form-label { width: 160rpx; font-size: 28rpx; color: $text-secondary; flex-shrink: 0; }
.form-input { flex: 1; font-size: 28rpx; color: $text-primary; }
.placeholder { color: $text-tertiary; }
.form-tip { font-size: 22rpx; color: $warning; margin-top: 20rpx; padding: 12rpx 16rpx; background: #FFF3E0; border-radius: 8rpx; }
.submit-btn { background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; text-align: center; padding: 24rpx 0; border-radius: 40rpx; margin-top: 30rpx; }
.submit-btn.disabled { opacity: 0.5; }
.submit-btn-text { font-size: 30rpx; font-weight: 600; color: #fff; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 24rpx; color: $warning; flex: 1; }
.result-card { background: #fff; margin: 30rpx 24rpx 0; border-radius: 20rpx; overflow: hidden; }
.result-header { padding: 24rpx; background: linear-gradient(135deg, #FCE4EC, #FFF0F5); display: flex; justify-content: space-between; align-items: center; }
.r-title { font-size: 30rpx; font-weight: 700; color: $text-primary; }
.r-tag { font-size: 24rpx; padding: 6rpx 16rpx; border-radius: 8rpx; background: $primary; color: #fff; }
.r-tag.tag-married { background: $danger; }
.r-tag.tag-divorced { background: $warning; }
.r-tag.tag-widowed { background: #9E9E9E; }
.r-tag.tag-unmarried { background: $primary; }
.grid-row { display: flex; padding: 24rpx; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { width: 180rpx; font-size: 26rpx; color: $text-tertiary; flex-shrink: 0; }
.grid-value { font-size: 26rpx; color: $text-primary; flex: 1; word-break: break-all; }
.config-tip { margin: 30rpx 24rpx; background: #E3F2FD; border-radius: 20rpx; padding: 24rpx; display: flex; align-items: flex-start; }
.tip-icon { font-size: 40rpx; margin-right: 16rpx; flex-shrink: 0; }
.tip-content { flex: 1; }
.tip-title { font-size: 28rpx; color: #1976D2; font-weight: 600; display: block; }
.tip-desc { font-size: 22rpx; color: #555; line-height: 1.6; display: block; margin-top: 6rpx; }
</style>
