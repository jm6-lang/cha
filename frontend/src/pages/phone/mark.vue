<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚨</view>
        <text class="header-title">号码标记查询</text>
        <text class="header-desc">10 大平台综合检测 · 防骚扰防诈骗</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          v-model="phone"
          type="number"
          class="search-input"
          placeholder="输入 11 位手机号"
          placeholder-class="placeholder"
          maxlength="11"
        />
        <text class="search-btn" @tap="onSearch">立即检测</text>
      </view>
    </view>

    <!-- 历史记录 -->
    <view v-if="!loading && !result && history.length" class="history-block">
      <text class="block-title">最近查询</text>
      <view class="history-list">
        <view
          v-for="(h, i) in history"
          :key="i"
          class="history-item"
          @tap="onPickHistory(h)"
        >
          <text class="history-num">{{ formatPhone(h) }}</text>
          <text class="history-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-block">
      <view class="loading-card">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在并发查询 10 大平台...</text>
        <view class="loading-platforms">
          <view
            v-for="(p, i) in allPlatforms"
            :key="p.name"
            class="loading-platform"
            :class="{ done: platformStatus[i] }"
          >
            <text class="lp-name">{{ p.name }}</text>
            <text class="lp-status">{{ platformStatus[i] ? '✓' : '⋯' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 查询结果 -->
    <view v-if="result" class="result-block">
      <!-- 顶部手机信息 -->
      <view class="phone-card">
        <text class="pc-num">{{ formatPhone(result.number) }}</text>
        <view class="pc-tags">
          <text class="pc-tag primary">{{ result.province }}</text>
          <text class="pc-tag">{{ result.city }}</text>
          <text class="pc-tag">{{ result.carrier }}</text>
        </view>
        <view class="pc-summary" :class="riskClass">
          <text class="pcs-emoji">{{ riskEmoji }}</text>
          <text class="pcs-text">{{ riskText }}</text>
          <text class="pcs-count">命中 {{ hitCount }} / {{ result.platforms.length }} 平台</text>
        </view>
      </view>

      <!-- 命中的标记 -->
      <view v-if="result.labels.length" class="section">
        <text class="section-title">检测到的标记</text>
        <view class="label-list">
          <view
            v-for="(l, i) in result.labels"
            :key="i"
            class="label-item"
            :class="`risk-${l.riskLevel}`"
          >
            <text class="li-name">{{ l.name }}</text>
            <text class="li-source">{{ l.source }}</text>
            <text v-if="l.count > 1" class="li-count">{{ l.count }}次</text>
          </view>
        </view>
      </view>

      <!-- 10 平台明细 -->
      <view class="section">
        <text class="section-title">10 大平台检测明细</text>
        <view class="platform-list">
          <view
            v-for="p in result.platforms"
            :key="p.platform"
            class="platform-item"
            :class="`risk-${p.riskLevel}`"
          >
            <view class="pi-left">
              <text class="pi-name">{{ p.platform }}</text>
              <text class="pi-desc" v-if="p.label">{{ p.label }}</text>
              <text class="pi-desc" v-else-if="p.err">{{ p.err }}</text>
              <text class="pi-desc" v-else>未检测到标记</text>
            </view>
            <view class="pi-right">
              <text v-if="p.isScam" class="pi-badge scam">诈骗</text>
              <text v-else-if="p.riskLevel === 3" class="pi-badge high">高危</text>
              <text v-else-if="p.riskLevel === 2" class="pi-badge warn">风险</text>
              <text v-else-if="p.riskLevel === 1" class="pi-badge low">低</text>
              <text v-else-if="p.ok" class="pi-badge ok">正常</text>
              <text v-else class="pi-badge fail">失败</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-block">
        <view class="action-btn primary" @tap="onReport">
          <text>📢 标记有误？提交申诉</text>
        </view>
        <view class="action-btn secondary" @tap="onClear">
          <text>🧹 清除错误标记（5-28 元）</text>
        </view>
      </view>

      <view class="footer-tip">
        <text>数据来源：腾讯、360、小米、华为、搜狗、电话邦、百度、联通、泰迪熊、移动等 10 大平台</text>
      </view>
    </view>

    <!-- 默认展示 -->
    <view v-if="!loading && !result" class="default-block">
      <view class="feature-grid">
        <view class="feature-card">
          <text class="fc-emoji">🛡️</text>
          <text class="fc-title">综合防护</text>
          <text class="fc-desc">10 平台同时检测</text>
        </view>
        <view class="feature-card">
          <text class="fc-emoji">⚡</text>
          <text class="fc-title">秒级响应</text>
          <text class="fc-desc">并发查询毫秒级</text>
        </view>
        <view class="feature-card">
          <text class="fc-emoji">🎯</text>
          <text class="fc-title">精准识别</text>
          <text class="fc-desc">骚扰/诈骗/营销</text>
        </view>
        <view class="feature-card">
          <text class="fc-emoji">📞</text>
          <text class="fc-title">外呼风控</text>
          <text class="fc-desc">企业号码保护</text>
        </view>
      </view>

      <view class="platforms-intro">
        <text class="section-title">检测平台</text>
        <view class="platforms-grid">
          <view v-for="p in allPlatforms" :key="p.name" class="pi-card">
            <text class="pi-card-name">{{ p.name }}</text>
            <text class="pi-card-desc">{{ p.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryPhoneLabelsAll, PlatformLabelResult, PhoneLabelsResult } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);

const phone = ref('');
const loading = ref(false);
const result = ref<PhoneLabelsResult | null>(null);
const history = ref<string[]>([]);
const platformStatus = ref<boolean[]>(Array(10).fill(false));

const allPlatforms = [
  { name: '腾讯手机管家', desc: '营销/机构/认证' },
  { name: '360手机卫士', desc: '认证/标记/普通' },
  { name: '小米标记', desc: '含诈骗识别' },
  { name: '华为标记', desc: '企业认证' },
  { name: '搜狗号码通', desc: '归属地+标记' },
  { name: '电话邦', desc: '黄页档案' },
  { name: '百度手机卫士', desc: '企业/个人' },
  { name: '联通标记', desc: '申诉状态' },
  { name: '泰迪熊', desc: '异常标记' },
  { name: '移动高频骚扰', desc: '高频检测' },
];

const hitCount = computed(() => {
  if (!result.value) return 0;
  return result.value.platforms.filter((p) => p.ok && p.riskLevel > 0 && p.label && p.label !== '无标记').length;
});

const maxRisk = computed(() => {
  if (!result.value) return 0;
  return Math.max(0, ...result.value.platforms.map((p) => p.riskLevel));
});

const riskClass = computed(() => `risk-${maxRisk.value}`);
const riskEmoji = computed(() => {
  const r = maxRisk.value;
  if (r === 0) return '✅';
  if (r === 1) return '⚠️';
  if (r === 2) return '🚨';
  return '🔴';
});
const riskText = computed(() => {
  const r = maxRisk.value;
  if (r === 0) return '安全号码';
  if (r === 1) return '有部分标记，请注意';
  if (r === 2) return '存在风险标记，建议谨慎接听';
  return '高危号码，疑似诈骗/骚扰';
});

const formatPhone = (p: string) => {
  if (!p) return '';
  return p.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1 $2 $3').trim();
};

const isValid = computed(() => /^1[3-9]\d{9}$/.test(phone.value));

const onSearch = async () => {
  if (!isValid.value) {
    uni.showToast({ title: '请输入正确的 11 位手机号', icon: 'none' });
    return;
  }
  loading.value = true;
  result.value = null;
  platformStatus.value = Array(10).fill(false);

  // 更新历史
  if (!history.value.includes(phone.value)) {
    history.value = [phone.value, ...history.value].slice(0, 5);
    uni.setStorageSync('phone_mark_history', history.value);
  }

  // 模拟逐个完成进度
  const ticks = setInterval(() => {
    const next = platformStatus.value.findIndex((d) => !d);
    if (next >= 0) {
      platformStatus.value[next] = true;
    } else {
      clearInterval(ticks);
    }
  }, 250);

  try {
    const r = await queryPhoneLabelsAll(phone.value);
    result.value = r;
  } catch (e) {
    uni.showToast({ title: '查询失败，请重试', icon: 'none' });
  } finally {
    clearInterval(ticks);
    platformStatus.value = Array(10).fill(true);
    loading.value = false;
  }
};

const onPickHistory = (h: string) => {
  phone.value = h;
  onSearch();
};

const onReport = () => {
  uni.showModal({
    title: '提交申诉',
    content: '此功能将引导您前往对应平台的申诉入口，逐个提交错误标记的申诉申请。',
    showCancel: false,
    confirmText: '我知道了',
  });
};

const onClear = () => {
  // 跳到支付确认页（统一流程：选择套餐 → 微信支付 → 查结果）
  uni.navigateTo({ url: '/pages/pay/index?type=phone_clear&subject=' + encodeURIComponent('号码标记清除') + '&amount=18.00' });
};

// 加载历史记录
const stored = uni.getStorageSync('phone_mark_history');
if (Array.isArray(stored)) {
  history.value = stored;
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: 60rpx;
}

.header {
  background: linear-gradient(180deg, #FF6B35 0%, #D84315 100%);
}
.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 60rpx;
}
.header-icon {
  font-size: 80rpx;
  margin-bottom: 12rpx;
}
.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}
.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 6rpx;
}

.search-bar {
  margin: -40rpx 24rpx 0;
}
.search-input-wrap {
  background: #fff;
  border-radius: 50rpx;
  padding: 8rpx 12rpx 8rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
}
.search-icon {
  font-size: 28rpx;
  color: $text-tertiary;
  margin-right: 12rpx;
}
.search-input {
  flex: 1;
  height: 70rpx;
  font-size: 28rpx;
}
.placeholder {
  color: $text-tertiary;
}
.search-btn {
  background: linear-gradient(135deg, #FF6B35, #D84315);
  color: #fff;
  font-size: 26rpx;
  padding: 16rpx 30rpx;
  border-radius: 40rpx;
}

/* 历史 */
.history-block {
  margin: 30rpx 24rpx 0;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}
.block-title {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 16rpx;
  font-weight: 600;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: $bg-grey;
  border-radius: 12rpx;
}
.history-num {
  font-size: 28rpx;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 1rpx;
}
.history-arrow {
  font-size: 32rpx;
  color: $text-tertiary;
}

/* Loading */
.loading-block {
  margin: 30rpx 24rpx 0;
}
.loading-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 50rpx 30rpx;
  text-align: center;
}
.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #FF6B35;
  border-radius: 50%;
  margin: 0 auto 20rpx;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-text {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 24rpx;
}
.loading-platforms {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
  text-align: left;
}
.loading-platform {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 16rpx;
  background: $bg-grey;
  border-radius: 10rpx;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.loading-platform.done {
  opacity: 1;
  background: rgba(7, 193, 96, 0.1);
}
.lp-name {
  font-size: 22rpx;
  color: $text-primary;
}
.lp-status {
  font-size: 22rpx;
  color: $text-tertiary;
  font-weight: 700;
}
.loading-platform.done .lp-status {
  color: $primary;
}

/* Result */
.result-block {
  padding: 30rpx 24rpx 0;
}
.phone-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  text-align: center;
  margin-bottom: 24rpx;
}
.pc-num {
  display: block;
  font-size: 56rpx;
  color: $text-primary;
  font-weight: 700;
  letter-spacing: 4rpx;
  margin-bottom: 16rpx;
  font-family: monospace;
}
.pc-tags {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.pc-tag {
  padding: 6rpx 20rpx;
  background: $bg-grey;
  color: $text-secondary;
  font-size: 22rpx;
  border-radius: 20rpx;
}
.pc-tag.primary {
  background: rgba(255, 107, 53, 0.12);
  color: #FF6B35;
}
.pc-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 20rpx;
  border-radius: 14rpx;
  font-size: 26rpx;
  font-weight: 600;
}
.pc-summary.risk-0 {
  background: rgba(7, 193, 96, 0.12);
  color: $primary;
}
.pc-summary.risk-1 {
  background: rgba(255, 152, 0, 0.12);
  color: #FF9800;
}
.pc-summary.risk-2 {
  background: rgba(255, 107, 53, 0.12);
  color: #FF6B35;
}
.pc-summary.risk-3 {
  background: rgba(255, 82, 82, 0.12);
  color: #FF5252;
}
.pcs-emoji {
  font-size: 30rpx;
}
.pcs-count {
  font-size: 22rpx;
  opacity: 0.7;
  font-weight: 400;
  margin-left: auto;
}

.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}
.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid #FF6B35;
  line-height: 1;
}

.label-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.label-item {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  border-radius: 14rpx;
  border-left: 6rpx solid;
}
.label-item.risk-0 {
  background: rgba(7, 193, 96, 0.08);
  border-color: $primary;
}
.label-item.risk-1 {
  background: rgba(255, 152, 0, 0.08);
  border-color: #FF9800;
}
.label-item.risk-2 {
  background: rgba(255, 107, 53, 0.08);
  border-color: #FF6B35;
}
.label-item.risk-3 {
  background: rgba(255, 82, 82, 0.08);
  border-color: #FF5252;
}
.li-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
}
.li-source {
  font-size: 22rpx;
  color: $text-tertiary;
  margin: 0 12rpx;
}
.li-count {
  font-size: 22rpx;
  color: #FF5252;
  font-weight: 600;
}

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.platform-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: $bg-page;
  border-radius: 14rpx;
}
.pi-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.pi-name {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 600;
}
.pi-desc {
  font-size: 22rpx;
  color: $text-secondary;
}
.pi-right {
  display: flex;
  align-items: center;
}
.pi-badge {
  padding: 6rpx 18rpx;
  border-radius: 18rpx;
  font-size: 22rpx;
  font-weight: 600;
}
.pi-badge.ok { background: rgba(7, 193, 96, 0.12); color: $primary; }
.pi-badge.low { background: rgba(255, 152, 0, 0.12); color: #FF9800; }
.pi-badge.warn { background: rgba(255, 107, 53, 0.12); color: #FF6B35; }
.pi-badge.high { background: rgba(255, 82, 82, 0.12); color: #FF5252; }
.pi-badge.scam { background: #FF5252; color: #fff; }
.pi-badge.fail { background: $bg-grey; color: $text-tertiary; }

/* Action */
.action-block {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
}
.action-btn.primary {
  background: linear-gradient(135deg, #FF6B35, #D84315);
  color: #fff;
}
.action-btn.secondary {
  background: #fff;
  color: #FF6B35;
  border: 2rpx solid #FF6B35;
}

.footer-tip {
  text-align: center;
  font-size: 22rpx;
  color: $text-tertiary;
  padding: 20rpx;
  line-height: 1.6;
}

/* Default */
.default-block {
  padding: 30rpx 24rpx 0;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.feature-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fc-emoji {
  font-size: 56rpx;
  margin-bottom: 12rpx;
}
.fc-title {
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4rpx;
}
.fc-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}

.platforms-intro {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}
.platforms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}
.pi-card {
  display: flex;
  flex-direction: column;
  padding: 16rpx;
  background: $bg-page;
  border-radius: 12rpx;
}
.pi-card-name {
  font-size: 24rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2rpx;
}
.pi-card-desc {
  font-size: 20rpx;
  color: $text-tertiary;
}
</style>
