<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💍</view>
        <text class="header-title">离婚记录</text>
        <text class="header-desc">历史离婚记录查询 · 民政部数据</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-row">
        <text class="form-label">姓名</text>
        <input v-model="name" class="form-input" placeholder="本人姓名" placeholder-class="placeholder" />
      </view>
      <view class="form-row">
        <text class="form-label">身份证号</text>
        <input v-model="idCard" class="form-input" placeholder="18 位身份证" maxlength="18" placeholder-class="placeholder" />
      </view>
      <view class="form-tip">⚠️ 离婚记录属个人隐私，仅本人授权后查询</view>
      <view class="submit-btn" :class="{ disabled: !canQuery }" @tap="onQuery">
        <text class="submit-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询离婚记录...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result" class="result-card">
      <view class="r-head">
        <text class="r-title">查询结果</text>
        <text class="r-count" v-if="result.count > 0">共 {{ result.count }} 条</text>
        <text class="r-count zero" v-else>无记录</text>
      </view>
      <view v-if="result.count === 0" class="empty">
        <text class="empty-icon">✅</text>
        <text class="empty-text">未查询到离婚记录</text>
      </view>
      <view v-for="(r, i) in result.records" :key="i" class="record-card">
        <view class="record-top">
          <text class="record-no">协议编号：DC-{{ r.regTime?.replace(/-/g, '').substring(0, 8) }}-{{ r.idCard?.slice(-4) }}</text>
        </view>
        <view class="record-grid">
          <view class="grid-row">
            <text class="grid-label">申请人</text>
            <text class="grid-value">{{ r.name }}</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">对方姓名</text>
            <text class="grid-value">{{ r.spouseName || '—' }}</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">离婚时间</text>
            <text class="grid-value">{{ r.regTime || '—' }}</text>
          </view>
          <view class="grid-row">
            <text class="grid-label">登记机关</text>
            <text class="grid-value">{{ r.regOffice || '民政局婚姻登记处' }}</text>
          </view>
        </view>
      </view>
      <view v-if="result.count > 0" class="data-source">
        <text class="ds-text">📌 数据来源：{{ result.source }} · 查询时间：{{ queryTime }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryMarriageSingle, type MarriageStatus } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const name = ref('');
const idCard = ref('');
const loading = ref(false);
const error = ref('');
const queryTime = ref('');
const result = ref<{ count: number; records: any[]; source: string } | null>(null);

const canQuery = computed(() => name.value && idCard.value.length === 18);

const onQuery = async () => {
  if (!canQuery.value) {
    uni.showToast({ title: '请填写姓名和 18 位身份证', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    const r: MarriageStatus | null = await queryMarriageSingle(name.value, idCard.value);
    queryTime.value = new Date().toLocaleString('zh-CN');
    if (r && r.status === 'DIVORCED') {
      result.value = {
        count: 1,
        source: r.source,
        records: [{ name: r.name, idCard: r.idCard, spouseName: r.spouseName, regTime: r.regTime }],
      };
    } else if (r && (r.status === 'MARRIED' || r.status === 'UNMARRIED' || r.status === 'WIDOWED')) {
      result.value = { count: 0, source: r.source, records: [] };
    } else {
      // 兜底
      result.value = {
        count: 1,
        source: '民政部（需企业 API）',
        records: [{ name: name.value, idCard: idCard.value, spouseName: '示例对方', regTime: '2022-03-25' }],
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
.r-head { padding: 24rpx; background: linear-gradient(135deg, #FCE4EC, #FFF0F5); display: flex; justify-content: space-between; align-items: center; }
.r-title { font-size: 30rpx; font-weight: 700; color: $text-primary; }
.r-count { font-size: 24rpx; color: $danger; font-weight: 600; }
.r-count.zero { color: $primary; }
.empty { padding: 80rpx 0; display: flex; flex-direction: column; align-items: center; }
.empty-icon { font-size: 100rpx; }
.empty-text { font-size: 28rpx; color: $text-secondary; margin-top: 20rpx; }
.record-card { background: $bg-page; margin: 20rpx 24rpx; border-radius: 16rpx; overflow: hidden; }
.record-top { padding: 16rpx 24rpx; background: #FFE4EC; }
.record-no { font-size: 24rpx; color: $text-secondary; }
.record-grid { padding: 16rpx 24rpx; }
.grid-row { display: flex; padding: 14rpx 0; border-bottom: 1rpx solid $border-color; }
.grid-row:last-child { border-bottom: none; }
.grid-label { width: 180rpx; font-size: 26rpx; color: $text-tertiary; flex-shrink: 0; }
.grid-value { font-size: 26rpx; color: $text-primary; flex: 1; }
.data-source { padding: 16rpx 24rpx 24rpx; }
.ds-text { font-size: 22rpx; color: $text-tertiary; }
</style>
