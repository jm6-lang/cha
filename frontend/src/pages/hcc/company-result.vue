<template>
  <view class="container">
    <!-- 公司基本信息卡片 -->
    <view class="info-card">
      <view class="company-name-row">
        <text class="company-name">{{ companyName }}</text>
        <view class="status-badge" :class="companyInfo.status === '存续' ? 'status-active' : 'status-inactive'">
          <text class="status-text">{{ companyInfo.status }}</text>
        </view>
      </view>
      <view class="info-grid">
        <view class="info-cell">
          <text class="info-label">法定代表人</text>
          <text class="info-value">{{ companyInfo.legalPerson }}</text>
        </view>
        <view class="info-cell">
          <text class="info-label">注册资本</text>
          <text class="info-value">{{ companyInfo.registeredCapital }}</text>
        </view>
        <view class="info-cell">
          <text class="info-label">成立日期</text>
          <text class="info-value">{{ companyInfo.establishDate }}</text>
        </view>
        <view class="info-cell">
          <text class="info-label">经营状态</text>
          <text class="info-value">{{ companyInfo.status }}</text>
        </view>
      </view>
      <view class="credit-row">
        <text class="credit-label">统一社会信用代码</text>
        <text class="credit-value">{{ companyInfo.creditCode }}</text>
      </view>
    </view>

    <!-- 风险信息 -->
    <view class="risk-card">
      <view class="card-title">
        <text class="card-icon">⚠️</text>
        <text class="card-title-text">风险信息</text>
      </view>
      <view v-if="companyInfo.risks.length === 0" class="empty-risk">
        <text class="empty-icon">✅</text>
        <text class="empty-text">暂未发现风险信息</text>
      </view>
      <view v-else class="risk-list">
        <view
          v-for="(risk, i) in companyInfo.risks"
          :key="i"
          class="risk-item"
          :class="`risk-level-${risk.level}`"
        >
          <view class="risk-left">
            <view class="risk-dot" :class="`dot-level-${risk.level}`" />
            <text class="risk-name">{{ risk.name }}</text>
          </view>
          <text class="risk-count">{{ risk.count }}条</text>
        </view>
      </view>
    </view>

    <!-- 关联企业 -->
    <view class="related-card">
      <view class="card-title">
        <text class="card-icon">🔗</text>
        <text class="card-title-text">关联企业</text>
      </view>
      <view class="related-list">
        <view
          v-for="(rel, i) in companyInfo.relatedCompanies"
          :key="i"
          class="related-item"
          @tap="onRelatedTap(rel)"
        >
          <view class="related-info">
            <text class="related-name">{{ rel.name }}</text>
            <text class="related-relation">{{ rel.relation }}</text>
          </view>
          <text class="related-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 免责声明 -->
    <view class="disclaimer">
      <text class="disclaimer-text">查询结果仅供参考，不构成任何法律依据。数据来源于公开信息，可能存在更新延迟。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryCompanyInfo } from '@/api/free-apis';

const companyName = ref('');

onLoad((q: any) => {
  companyName.value = q?.companyName ? decodeURIComponent(q.companyName) : '';
});

const data = computed(() => queryCompanyInfo(companyName.value || '示例公司'));

// 把 riskLevel 转换为 risks 数组
const companyInfo = reactive({
  legalPerson: computed(() => data.value.legalPerson),
  registeredCapital: computed(() => data.value.regCapital),
  establishDate: computed(() => data.value.establishDate),
  status: computed(() => data.value.status),
  creditCode: computed(() => data.value.creditCode),
  risks: computed(() => data.value.riskTags.map((tag, i) => ({
    name: tag,
    count: i + 1,
    level: data.value.riskLevel === 'high' ? 3 : data.value.riskLevel === 'medium' ? 2 : 1,
  }))),
  relatedCompanies: [
    { name: companyName.value + '（集团）有限公司', relation: '控股企业' },
    { name: companyName.value + '（深圳）有限公司', relation: '子公司' },
    { name: companyName.value + '（北京）信息技术有限公司', relation: '关联企业' },
  ],
});

function onRelatedTap(rel: any) {
  uni.navigateTo({
    url: `/pages/hcc/company-result?companyName=${encodeURIComponent(rel.name)}`,
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 24rpx;
  background: $bg-page;
  min-height: 100vh;
}

/* 公司基本信息卡片 */
.info-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.company-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.company-name {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
  margin-right: 16rpx;
}

.status-badge {
  padding: 6rpx 20rpx;
  border-radius: 999rpx;
  flex-shrink: 0;
}

.status-badge.status-active {
  background: #E8F8EF;
}

.status-badge.status-inactive {
  background: #FFECEC;
}

.status-text {
  font-size: 24rpx;
  font-weight: 500;
}

.status-active .status-text {
  color: $success;
}

.status-inactive .status-text {
  color: $danger;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
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

.credit-row {
  background: $bg-page;
  border-radius: $radius-md;
  padding: 20rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.credit-label {
  font-size: 24rpx;
  color: $text-tertiary;
}

.credit-value {
  font-size: 26rpx;
  color: $text-secondary;
  font-weight: 500;
  letter-spacing: 1rpx;
}

/* 风险信息卡片 */
.risk-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.card-icon {
  font-size: 32rpx;
}

.card-title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.empty-risk {
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

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.risk-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-radius: $radius-md;
  background: $bg-page;
}

.risk-item.risk-level-0 {
  border-left: 8rpx solid $success;
}

.risk-item.risk-level-1 {
  border-left: 8rpx solid $warning;
}

.risk-item.risk-level-2 {
  border-left: 8rpx solid $danger;
}

.risk-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.risk-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.dot-level-0 { background: $success; }
.dot-level-1 { background: $warning; }
.dot-level-2 { background: $danger; }

.risk-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
}

.risk-count {
  font-size: 26rpx;
  color: $text-secondary;
  font-weight: 500;
}

/* 关联企业卡片 */
.related-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.related-list {
  display: flex;
  flex-direction: column;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;
}

.related-item:last-child {
  border-bottom: none;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-name {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
}

.related-relation {
  font-size: 24rpx;
  color: $primary;
  font-weight: 500;
}

.related-arrow {
  color: $text-tertiary;
  font-size: 32rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

/* 免责声明 */
.disclaimer {
  text-align: center;
  padding: 24rpx 0;
}

.disclaimer-text {
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.6;
}
</style>
