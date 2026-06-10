<template>
  <view class="container">
    <!-- 号码展示区 -->
    <view class="number-header">
      <view class="number-row">
        <text class="number-label">查询号码</text>
        <text class="number-copy" @tap="copyNumber">复制</text>
      </view>
      <text class="number-value">{{ data?.number || number }}</text>
      <!-- 风险等级 -->
      <view v-if="data" class="risk-badge" :class="`risk-${riskLevel}`">
        <text class="risk-icon">{{ riskIcon }}</text>
        <text class="risk-text">{{ riskText }}</text>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-wrap">
      <view class="loading-spinner" />
      <text class="loading-text">正在查询中...</text>
    </view>

    <!-- 查询结果 -->
    <view v-else-if="data" class="result-wrap">
      <!-- 归属地信息卡片 -->
      <view class="info-card">
        <view class="info-card-title">
          <text class="info-icon">📍</text>
          <text class="info-title">归属地信息</text>
        </view>
        <view class="info-grid">
          <view class="info-cell">
            <text class="info-label">省份</text>
            <text class="info-value">{{ data.province || '-' }}</text>
          </view>
          <view class="info-cell">
            <text class="info-label">城市</text>
            <text class="info-value">{{ data.city || '-' }}</text>
          </view>
          <view class="info-cell">
            <text class="info-label">运营商</text>
            <text class="info-value">{{ data.carrier || '-' }}</text>
          </view>
          <view class="info-cell">
            <text class="info-label">号段</text>
            <text class="info-value">{{ segment }}</text>
          </view>
        </view>
      </view>

      <!-- 标记信息卡片 -->
      <view class="info-card">
        <view class="info-card-title">
          <text class="info-icon">🏷️</text>
          <text class="info-title">公开标记 ({{ data.labels.length }})</text>
        </view>
        <view v-if="data.labels.length === 0" class="empty-labels">
          <text class="empty-icon">✅</text>
          <text class="empty-text">暂无公开标记，该号码较为安全</text>
        </view>
        <view v-else class="label-list">
          <view
            v-for="(l, i) in data.labels"
            :key="i"
            class="label-item"
            :class="`label-risk-${l.riskLevel}`"
          >
            <view class="label-left">
              <view class="label-dot" :class="`dot-risk-${l.riskLevel}`" />
              <text class="label-name">{{ l.name }}</text>
            </view>
            <view class="label-right">
              <text class="label-count">{{ l.count }}人标记</text>
              <text class="label-source">{{ l.source }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮区 -->
      <view class="action-area">
        <view class="action-btn primary" @tap="onCancelLabel">
          <text class="action-icon">&#10003;</text>
          <text class="action-text">取消标记</text>
        </view>
        <view class="action-btn" @tap="onValuation">
          <text class="action-icon">&#128142;</text>
          <text class="action-text">号码估值</text>
        </view>
        <view class="action-btn" @tap="onDeepQuery">
          <text class="action-icon">&#128270;</text>
          <text class="action-text">深度查询</text>
        </view>
      </view>

      <!-- 免责声明 -->
      <view class="disclaimer">
        <text class="disclaimer-text">查询结果仅供参考，不构成任何法律依据。请勿用于非法用途。</text>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else class="error-wrap">
      <text class="error-icon">&#10060;</text>
      <text class="error-text">查询失败，请稍后重试</text>
      <view class="retry-btn" @tap="doQuery">
        <text class="retry-text">重新查询</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { shuchaApi, type NumberLabel } from '@/api/shucha';
import { queryPhoneLabels } from '@/api/free-apis';

const number = ref('');
const data = ref<NumberLabel | null>(null);
const loading = ref(true);

onLoad((q: any) => {
  number.value = q?.number || '';
  doQuery();
});

async function doQuery() {
  loading.value = true;
  try {
    // 直接调用本地 free-apis，无延迟
    const r = queryPhoneLabels(number.value);
    data.value = r;
  } catch (e) {
    console.error('query failed', e);
  } finally {
    loading.value = false;
  }
}

const segment = computed(() => {
  const n = number.value;
  return n.length >= 7 ? n.substring(0, 7) : n;
});

const riskLevel = computed(() => {
  if (!data.value || data.value.labels.length === 0) return 0;
  const maxRisk = Math.max(...data.value.labels.map(l => l.riskLevel));
  return maxRisk;
});

const riskIcon = computed(() => {
  const icons: Record<number, string> = { 0: '✅', 1: '✅', 2: '⚠️', 3: '🚨' };
  return icons[riskLevel.value] || '✅';
});

const riskText = computed(() => {
  const texts: Record<number, string> = {
    0: '安全号码',
    1: '低风险',
    2: '中风险',
    3: '高风险',
  };
  return texts[riskLevel.value] || '安全号码';
});

function copyNumber() {
  uni.setClipboardData({
    data: number.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  });
}

function onCancelLabel() {
  uni.showToast({ title: '取消标记 - 即将上线', icon: 'none' });
}

function onValuation() {
  uni.showToast({ title: '号码估值 - 即将上线', icon: 'none' });
}

function onDeepQuery() {
  uni.showToast({ title: '深度查询 - 即将上线', icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 24rpx;
  background: $bg-page;
  min-height: 100vh;
}

/* 号码展示区 */
.number-header {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.number-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.number-label {
  font-size: 24rpx;
  color: $text-tertiary;
}

.number-copy {
  font-size: 24rpx;
  color: $primary;
  padding: 4rpx 16rpx;
  border: 1rpx solid $primary;
  border-radius: 999rpx;
}

.number-value {
  font-size: 52rpx;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 4rpx;
  margin-bottom: 16rpx;
}

.risk-badge {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  gap: 8rpx;
}

.risk-badge.risk-0 {
  background: #E8F8EF;
}
.risk-badge.risk-1 {
  background: #E8F8EF;
}
.risk-badge.risk-2 {
  background: #FFF7E8;
}
.risk-badge.risk-3 {
  background: #FFECEC;
}

.risk-icon {
  font-size: 28rpx;
}

.risk-text {
  font-size: 26rpx;
  font-weight: 600;
}

.risk-badge.risk-0 .risk-text,
.risk-badge.risk-1 .risk-text {
  color: $success;
}
.risk-badge.risk-2 .risk-text {
  color: $warning;
}
.risk-badge.risk-3 .risk-text {
  color: $danger;
}

/* 加载中 */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 0;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 6rpx solid $border;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24rpx;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: $text-tertiary;
}

/* 信息卡片 */
.info-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.info-card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.info-icon {
  font-size: 32rpx;
}

.info-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-cell {
  width: 50%;
  padding: 12rpx 0;
}

.info-label {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  margin-bottom: 4rpx;
}

.info-value {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
}

/* 标记列表 */
.empty-labels {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 0;
}

.empty-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.empty-text {
  font-size: 26rpx;
  color: $success;
}

.label-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.label-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-radius: $radius-md;
  background: $bg-page;
}

.label-item.label-risk-1 {
  border-left: 8rpx solid $success;
}
.label-item.label-risk-2 {
  border-left: 8rpx solid $warning;
}
.label-item.label-risk-3 {
  border-left: 8rpx solid $danger;
}

.label-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.label-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.dot-risk-1 { background: $success; }
.dot-risk-2 { background: $warning; }
.dot-risk-3 { background: $danger; }

.label-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
}

.label-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.label-count {
  font-size: 24rpx;
  color: $text-secondary;
  font-weight: 500;
}

.label-source {
  font-size: 20rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

/* 操作按钮 */
.action-area {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  gap: 8rpx;
}

.action-btn.primary {
  background: $primary;
}

.action-btn.primary .action-icon,
.action-btn.primary .action-text {
  color: #fff;
}

.action-icon {
  font-size: 36rpx;
  color: $text-secondary;
}

.action-text {
  font-size: 24rpx;
  color: $text-secondary;
  font-weight: 500;
}

/* 免责声明 */
.disclaimer {
  text-align: center;
  padding: 24rpx 0;
}

.disclaimer-text {
  font-size: 22rpx;
  color: $text-tertiary;
}

/* 错误状态 */
.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96rpx 0;
}

.error-icon {
  font-size: 64rpx;
  margin-bottom: 24rpx;
}

.error-text {
  font-size: 28rpx;
  color: $text-tertiary;
  margin-bottom: 32rpx;
}

.retry-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 16rpx 48rpx;
}

.retry-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
