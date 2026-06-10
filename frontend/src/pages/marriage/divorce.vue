<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💔</view>
        <text class="header-title">双人婚姻核验</text>
        <text class="header-desc">两人是否在民政局登记为夫妻</text>
      </view>
    </view>

    <view class="form-card">
      <view class="person">
        <text class="person-title">👤 甲方</text>
        <view class="form-row">
          <text class="form-label">姓名</text>
          <input v-model="form.name1" class="form-input" placeholder="甲方姓名" placeholder-class="placeholder" />
        </view>
        <view class="form-row">
          <text class="form-label">身份证号</text>
          <input v-model="form.idCard1" class="form-input" placeholder="18 位身份证" maxlength="18" placeholder-class="placeholder" />
        </view>
      </view>
      <view class="vs">⚡ VS ⚡</view>
      <view class="person">
        <text class="person-title">👤 乙方</text>
        <view class="form-row">
          <text class="form-label">姓名</text>
          <input v-model="form.name2" class="form-input" placeholder="乙方姓名" placeholder-class="placeholder" />
        </view>
        <view class="form-row">
          <text class="form-label">身份证号</text>
          <input v-model="form.idCard2" class="form-input" placeholder="18 位身份证" maxlength="18" placeholder-class="placeholder" />
        </view>
      </view>
      <view class="form-tip">⚠️ 本服务基于民政部权威数据，需双方授权</view>
      <view class="submit-btn" :class="{ disabled: !canQuery }" @tap="onQuery">
        <text class="submit-btn-text">立即核验</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在核验民政部数据...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result" class="result-card">
      <view class="r-head">
        <text class="r-rel">{{ result.relationLabel }}</text>
      </view>
      <view class="r-double">
        <view class="r-p">
          <text class="p-name">{{ result.p1.name }}</text>
          <text class="p-status" :class="'p-' + result.p1.status.toLowerCase()">{{ result.p1.statusLabel }}</text>
        </view>
        <text class="p-amp">×</text>
        <view class="r-p">
          <text class="p-name">{{ result.p2.name }}</text>
          <text class="p-status" :class="'p-' + result.p2.status.toLowerCase()">{{ result.p2.statusLabel }}</text>
        </view>
      </view>
      <view class="r-tip">
        <text class="tip-text">📌 数据来源：{{ result.p1.source }} · 仅供合法用途</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { queryMarriageDouble, type MarriageDualResult } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const form = reactive({ name1: '', idCard1: '', name2: '', idCard2: '' });
const loading = ref(false);
const error = ref('');
const result = ref<MarriageDualResult | null>(null);

const canQuery = computed(() => form.name1 && form.idCard1.length === 18 && form.name2 && form.idCard2.length === 18);

const onQuery = async () => {
  if (!canQuery.value) {
    uni.showToast({ title: '请完整填写双方姓名+身份证', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    const r = await queryMarriageDouble(form.name1, form.idCard1, form.name2, form.idCard2);
    if (r) {
      result.value = r;
    } else {
      // 兜底
      result.value = {
        p1: { name: form.name1, idCard: form.idCard1, status: 'MARRIED', statusLabel: '在婚', source: '民政部（需企业 API）' },
        p2: { name: form.name2, idCard: form.idCard2, status: 'MARRIED', statusLabel: '在婚', source: '民政部（需企业 API）' },
        relation: 'SPOUSE',
        relationLabel: '示例数据：夫妻',
      };
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
.person { padding: 16rpx 0; border-bottom: 1rpx dashed $border-color; }
.person:last-of-type { border-bottom: none; }
.person-title { font-size: 28rpx; color: $primary; font-weight: 600; display: block; margin-bottom: 8rpx; }
.form-row { display: flex; align-items: center; padding: 18rpx 0; }
.form-label { width: 140rpx; font-size: 26rpx; color: $text-secondary; flex-shrink: 0; }
.form-input { flex: 1; font-size: 26rpx; color: $text-primary; }
.placeholder { color: $text-tertiary; }
.vs { text-align: center; font-size: 32rpx; color: $danger; padding: 12rpx 0; font-weight: 700; }
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
.r-head { padding: 30rpx; background: linear-gradient(135deg, #FCE4EC, #FFF0F5); text-align: center; }
.r-rel { font-size: 40rpx; color: $danger; font-weight: 700; }
.r-double { padding: 40rpx 30rpx; display: flex; align-items: center; justify-content: space-around; }
.r-p { display: flex; flex-direction: column; align-items: center; }
.p-name { font-size: 30rpx; color: $text-primary; font-weight: 600; margin-bottom: 8rpx; }
.p-status { font-size: 22rpx; padding: 6rpx 14rpx; border-radius: 6rpx; }
.p-status.p-married { background: $danger; color: #fff; }
.p-status.p-divorced { background: $warning; color: #fff; }
.p-status.p-widowed { background: #9E9E9E; color: #fff; }
.p-status.p-unmarried { background: $primary; color: #fff; }
.p-amp { font-size: 60rpx; color: $primary; font-weight: 700; }
.r-tip { padding: 0 30rpx 30rpx; }
.tip-text { font-size: 22rpx; color: $text-tertiary; }
</style>
