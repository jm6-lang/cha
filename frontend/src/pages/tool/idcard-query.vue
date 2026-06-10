<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🪪</view>
        <text class="header-title">身份证归属地查询</text>
        <text class="header-desc">免费验证身份证号地区、性别、年龄</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-title">身份证号</view>
      <view class="input-wrap">
        <input
          v-model="idCard"
          class="form-input"
          placeholder="请输入 18 位身份证号"
          placeholder-class="input-placeholder"
          maxlength="18"
          @input="onInput"
        />
        <view v-if="idCard" class="input-clear" @tap="idCard = ''">
          <text class="clear-icon">✕</text>
        </view>
      </view>
      <view class="form-tip">提示：本查询完全本地运算，不会上传服务器</view>
      <view class="query-btn" :class="{ disabled: idCard.length !== 18 }" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view v-if="result.valid" class="result-success">
        <view class="success-icon">✓</view>
        <text class="success-text">身份证号有效</text>
      </view>
      <view v-else class="result-error">
        <view class="error-icon">✗</view>
        <text class="error-text">{{ result.msg || '身份证号无效' }}</text>
      </view>

      <view v-if="result.valid" class="result-list">
        <view class="result-row">
          <text class="row-label">归属地区</text>
          <text class="row-value">{{ result.province }} {{ result.city }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">出生日期</text>
          <text class="row-value">{{ result.birthday }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">性别</text>
          <text class="row-value">{{ result.gender }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">年龄</text>
          <text class="row-value">{{ age }} 岁</text>
        </view>
        <view class="result-row">
          <text class="row-label">生肖</text>
          <text class="row-value">{{ zodiac }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">星座</text>
          <text class="row-value">{{ constellation }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">脱敏展示</text>
          <text class="row-value mask">{{ result.idCard }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryIdCardLocation } from '@/api/free-apis';

const idCard = ref('');
const result = ref<any>(null);
const statusBarHeight = ref(44);

const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const age = computed(() => {
  if (!result.value || !result.value.valid) return 0;
  const b = new Date(result.value.birthday);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
});

const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const zodiac = computed(() => {
  if (!result.value || !result.value.valid) return '';
  const y = parseInt(result.value.birthday.substring(0, 4), 10);
  return ZODIACS[(y - 4) % 12];
});

const CONSTELLATIONS = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'];
const CONSTELLATION_DATES = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
const constellation = computed(() => {
  if (!result.value || !result.value.valid) return '';
  const m = parseInt(result.value.birthday.substring(5, 7), 10);
  const d = parseInt(result.value.birthday.substring(8, 10), 10);
  return d < CONSTELLATION_DATES[m - 1] ? CONSTELLATIONS[m - 1] : CONSTELLATIONS[m];
});

function onInput() {
  result.value = null;
}

function onQuery() {
  if (idCard.value.length !== 18) {
    uni.showToast({ title: '请输入 18 位身份证号', icon: 'none' });
    return;
  }
  result.value = queryIdCardLocation(idCard.value);
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* 头部 */
.header {
  background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 56rpx;
}

.header-icon {
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 表单 */
.form-card {
  margin: -32rpx 24rpx 0;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.form-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 24rpx;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
  letter-spacing: 2rpx;
}

.input-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 24rpx;
  color: #fff;
}

.input-placeholder {
  color: $text-tertiary;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
}

.query-btn {
  margin-top: 32rpx;
  height: 96rpx;
  background: $primary;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
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
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-success,
.result-error {
  display: flex;
  align-items: center;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid $border;
}

.success-icon,
.error-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
  margin-right: 16rpx;
  font-weight: 700;
}

.success-icon {
  background: $primary;
}

.error-icon {
  background: $danger;
}

.success-text {
  font-size: 30rpx;
  color: $primary;
  font-weight: 600;
}

.error-text {
  font-size: 30rpx;
  color: $danger;
  font-weight: 600;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.result-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 28rpx;
  color: $text-tertiary;
  flex-shrink: 0;
}

.row-value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
  text-align: right;
}

.row-value.mask {
  font-family: monospace;
  letter-spacing: 1rpx;
}
</style>
