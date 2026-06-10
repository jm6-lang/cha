<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">⚠️</view>
        <text class="header-title">车辆违章</text>
        <text class="header-desc">全国违章记录在线查询</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-row">
        <text class="input-label">车牌号</text>
        <input
          v-model="plate"
          class="form-input"
          placeholder="如 京A12345"
          placeholder-class="placeholder"
        />
      </view>
      <view class="input-row">
        <text class="input-label">车架号后 6 位</text>
        <input
          v-model="vin"
          class="form-input"
          placeholder="车辆识别代码后 6 位"
          placeholder-class="placeholder"
        />
      </view>
      <view class="input-row">
        <text class="input-label">发动机号后 4 位</text>
        <input
          v-model="engine"
          class="form-input"
          placeholder="发动机号后 4 位"
          placeholder-class="placeholder"
        />
      </view>
      <view class="form-tip">信息加密传输，严格保护车辆隐私</view>
      <view class="query-btn" :class="{ disabled: !canQuery }" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <view class="code-search-card">
      <view class="cs-head">
        <text class="cs-title">🚦 违章代码查询</text>
        <text class="cs-desc">输入行为/代码查违章详情</text>
      </view>
      <view class="input-row">
        <text class="input-label">行为/代码</text>
        <input
          v-model="codeKeyword"
          class="form-input"
          placeholder="如 闯红灯 / 1344"
          placeholder-class="placeholder"
          @confirm="onCodeSearch"
        />
        <text class="cs-btn" @tap="onCodeSearch">查询</text>
      </view>
      <view v-if="loadingCode" class="cs-loading">🔄 加载中...</view>
      <view v-for="(c, i) in codeList" :key="i" class="cs-item">
        <view class="cs-item-head">
          <text class="cs-code">{{ c.code }}</text>
          <text class="cs-fine">¥{{ c.fine }} / {{ c.points }}分</text>
        </view>
        <text class="cs-name">{{ c.name }}</text>
        <text class="cs-law" v-if="c.law">依据：{{ c.law }}</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-summary">
        <view class="summary-item">
          <text class="sum-num">{{ result.total }}</text>
          <text class="sum-label">累计违章</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-item">
          <text class="sum-num warning">{{ result.unpaid }}</text>
          <text class="sum-label">未处理</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-item">
          <text class="sum-num danger">¥{{ result.fine }}</text>
          <text class="sum-label">待缴罚款</text>
        </view>
        <view class="summary-divider" />
        <view class="summary-item">
          <text class="sum-num danger">{{ result.points }}分</text>
          <text class="sum-label">累计扣分</text>
        </view>
      </view>

      <view class="record-list">
        <text class="section-title">违章记录</text>
        <view
          v-for="(r, i) in result.records"
          :key="i"
          class="record-item"
        >
          <view class="record-top">
            <text class="r-date">{{ r.date }}</text>
            <text :class="['r-status', r.status === '已处理' ? 'done' : 'unpaid']">{{ r.status }}</text>
          </view>
          <text class="r-act">{{ r.act }}</text>
          <text class="r-location">📍 {{ r.location }}</text>
          <view class="r-penalty">
            <text class="r-fine">罚款 ¥{{ r.fine }}</text>
            <text class="r-points">扣 {{ r.points }} 分</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryViolationCode, type ViolationCode } from '@/api/free-apis';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const plate = ref('');
const vin = ref('');
const engine = ref('');
const result = ref<any>(null);
const codeKeyword = ref('');
const codeList = ref<ViolationCode[]>([]);
const loadingCode = ref(false);

const canQuery = computed(() => plate.value && vin.value && engine.value);

function onQuery() {
  if (!canQuery.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  result.value = {
    total: 3,
    unpaid: 1,
    fine: 200,
    points: 4,
    records: [
      { date: '2024-10-15 09:30', act: '机动车违反规定停放、临时停车', location: '北京市朝阳区建国门外大街', status: '未处理', fine: 200, points: 3 },
      { date: '2024-08-22 14:20', act: '机动车通过路口未按交通信号灯指示通行', location: '北京市海淀区中关村大街', status: '已处理', fine: 200, points: 6 },
      { date: '2024-06-10 18:45', act: '超速 20% 以下', location: '京藏高速出京 38 公里', status: '已处理', fine: 200, points: 3 },
    ],
  };
}

const onCodeSearch = async () => {
  if (!codeKeyword.value.trim()) {
    uni.showToast({ title: '请输入行为/代码', icon: 'none' });
    return;
  }
  loadingCode.value = true;
  try {
    const r = await queryViolationCode(codeKeyword.value.trim());
    codeList.value = r || [];
  } catch (e) {
    uni.showToast({ title: '查询失败', icon: 'none' });
  } finally {
    loadingCode.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #FF9800 0%, #E65100 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 40rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 表单 */
.form-card {
  margin: -28rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.input-row {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 88rpx;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
}

.input-label {
  font-size: 26rpx;
  color: $text-tertiary;
  width: 200rpx;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 1rpx;
}

.placeholder {
  color: $text-tertiary;
  font-family: sans-serif;
  letter-spacing: 0;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
  text-align: center;
}

.query-btn {
  margin-top: 24rpx;
  height: 88rpx;
  background: $warning;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 152, 0, 0.3);
}

.query-btn.disabled {
  background: $text-placeholder;
  box-shadow: none;
}

.query-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 结果 */
.result-card {
  margin: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.result-summary {
  display: flex;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sum-num {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.sum-num.warning {
  color: $warning;
}

.sum-num.danger {
  color: $danger;
}

.sum-label {
  font-size: 20rpx;
  color: $text-tertiary;
}

.summary-divider {
  width: 1rpx;
  background: $border-light;
}

.record-list {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $warning;
  line-height: 1;
}

.record-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.record-item:last-child {
  border-bottom: none;
}

.record-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.r-date {
  font-size: 24rpx;
  color: $text-tertiary;
}

.r-status {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}

.r-status.done {
  color: $primary;
  background: rgba(7, 193, 96, 0.1);
}

.r-status.unpaid {
  color: $danger;
  background: rgba(255, 59, 48, 0.1);
}

.r-act {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 6rpx;
}

.r-location {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-bottom: 8rpx;
}

.r-penalty {
  display: flex;
  gap: 16rpx;
}

.r-fine {
  font-size: 24rpx;
  color: $danger;
  font-weight: 600;
}

.r-points {
  font-size: 24rpx;
  color: $warning;
  font-weight: 600;
}

/* 违章代码查询 */
.code-search-card {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.cs-head {
  margin-bottom: 16rpx;
}

.cs-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
}

.cs-desc {
  font-size: 22rpx;
  color: $text-tertiary;
  display: block;
  margin-top: 4rpx;
}

.cs-btn {
  background: $warning;
  color: #fff;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  flex-shrink: 0;
}

.cs-loading {
  text-align: center;
  font-size: 24rpx;
  color: $text-tertiary;
  padding: 30rpx 0;
}

.cs-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.cs-item:last-child {
  border-bottom: none;
}

.cs-item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.cs-code {
  font-size: 26rpx;
  font-weight: 700;
  color: $warning;
  font-family: monospace;
}

.cs-fine {
  font-size: 22rpx;
  color: $danger;
  font-weight: 600;
}

.cs-name {
  display: block;
  font-size: 26rpx;
  color: $text-primary;
  line-height: 1.5;
  margin-bottom: 6rpx;
}

.cs-law {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.5;
}
</style>
