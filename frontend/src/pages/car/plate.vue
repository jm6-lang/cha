<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🚗</view>
        <text class="header-title">车牌归属地</text>
        <text class="header-desc">全国 31 个省车牌代码查询</text>
      </view>
    </view>

    <view class="form-card">
      <view class="input-wrap">
        <text class="input-prefix">🚗</text>
        <input
          v-model="plate"
          class="form-input"
          placeholder="请输入车牌号 (如 京A12345)"
          placeholder-class="placeholder"
        />
        <text v-if="plate" class="search-clear" @tap="plate = ''">✕</text>
      </view>
      <view class="form-tip">提示：仅需输入车牌首字即可查询</view>
      <view class="query-btn" :class="{ disabled: !plate }" @tap="onQuery">
        <text class="query-btn-text">查询归属地</text>
      </view>
    </view>

    <view v-if="result" class="result-card">
      <view class="result-header" :style="{ background: result.color }">
        <text class="result-char">{{ result.char }}</text>
        <view class="result-info">
          <text class="result-province">{{ result.province }}</text>
          <text class="result-class">{{ result.class }}</text>
        </view>
      </view>
      <view class="result-list">
        <view class="result-row">
          <text class="row-label">省份</text>
          <text class="row-value">{{ result.province }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">车牌类型</text>
          <text class="row-value">{{ result.class }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">省级行政中心</text>
          <text class="row-value">{{ result.capital }}</text>
        </view>
        <view class="result-row">
          <text class="row-label">所属地区</text>
          <text class="row-value">{{ result.region }}</text>
        </view>
      </view>
    </view>

    <view class="plate-grid">
      <text class="section-title">全国车牌</text>
      <view class="grid">
        <view
          v-for="p in provinces"
          :key="p.char"
          class="plate-item"
          @tap="onPlateTap(p)"
        >
          <view class="plate-char" :style="{ background: p.color }">
            <text class="pc-text">{{ p.char }}</text>
          </view>
          <text class="plate-name">{{ p.short }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const plate = ref('');
const result = ref<any>(null);

const provinces = ref([
  { char: '京', short: '北京', province: '北京市', class: '小型汽车', capital: '北京', region: '华北', color: '#1A6CFF' },
  { char: '津', short: '天津', province: '天津市', class: '小型汽车', capital: '天津', region: '华北', color: '#1A6CFF' },
  { char: '冀', short: '河北', province: '河北省', class: '小型汽车', capital: '石家庄', region: '华北', color: '#1A6CFF' },
  { char: '晋', short: '山西', province: '山西省', class: '小型汽车', capital: '太原', region: '华北', color: '#1A6CFF' },
  { char: '蒙', short: '内蒙古', province: '内蒙古自治区', class: '小型汽车', capital: '呼和浩特', region: '华北', color: '#1A6CFF' },
  { char: '辽', short: '辽宁', province: '辽宁省', class: '小型汽车', capital: '沈阳', region: '东北', color: '#FF6A00' },
  { char: '吉', short: '吉林', province: '吉林省', class: '小型汽车', capital: '长春', region: '东北', color: '#FF6A00' },
  { char: '黑', short: '黑龙江', province: '黑龙江省', class: '小型汽车', capital: '哈尔滨', region: '东北', color: '#FF6A00' },
  { char: '沪', short: '上海', province: '上海市', class: '小型汽车', capital: '上海', region: '华东', color: '#1976D2' },
  { char: '苏', short: '江苏', province: '江苏省', class: '小型汽车', capital: '南京', region: '华东', color: '#1976D2' },
  { char: '浙', short: '浙江', province: '浙江省', class: '小型汽车', capital: '杭州', region: '华东', color: '#1976D2' },
  { char: '皖', short: '安徽', province: '安徽省', class: '小型汽车', capital: '合肥', region: '华东', color: '#1976D2' },
  { char: '闽', short: '福建', province: '福建省', class: '小型汽车', capital: '福州', region: '华东', color: '#1976D2' },
  { char: '赣', short: '江西', province: '江西省', class: '小型汽车', capital: '南昌', region: '华东', color: '#1976D2' },
  { char: '鲁', short: '山东', province: '山东省', class: '小型汽车', capital: '济南', region: '华东', color: '#1976D2' },
  { char: '豫', short: '河南', province: '河南省', class: '小型汽车', capital: '郑州', region: '华中', color: '#E91E63' },
  { char: '鄂', short: '湖北', province: '湖北省', class: '小型汽车', capital: '武汉', region: '华中', color: '#E91E63' },
  { char: '湘', short: '湖南', province: '湖南省', class: '小型汽车', capital: '长沙', region: '华中', color: '#E91E63' },
  { char: '粤', short: '广东', province: '广东省', class: '小型汽车', capital: '广州', region: '华南', color: '#00B050' },
  { char: '桂', short: '广西', province: '广西壮族自治区', class: '小型汽车', capital: '南宁', region: '华南', color: '#00B050' },
  { char: '琼', short: '海南', province: '海南省', class: '小型汽车', capital: '海口', region: '华南', color: '#00B050' },
  { char: '渝', short: '重庆', province: '重庆市', class: '小型汽车', capital: '重庆', region: '西南', color: '#5E35B1' },
  { char: '川', short: '四川', province: '四川省', class: '小型汽车', capital: '成都', region: '西南', color: '#5E35B1' },
  { char: '黔', short: '贵州', province: '贵州省', class: '小型汽车', capital: '贵阳', region: '西南', color: '#5E35B1' },
  { char: '滇', short: '云南', province: '云南省', class: '小型汽车', capital: '昆明', region: '西南', color: '#5E35B1' },
  { char: '藏', short: '西藏', province: '西藏自治区', class: '小型汽车', capital: '拉萨', region: '西南', color: '#5E35B1' },
  { char: '陕', short: '陕西', province: '陕西省', class: '小型汽车', capital: '西安', region: '西北', color: '#F57C00' },
  { char: '甘', short: '甘肃', province: '甘肃省', class: '小型汽车', capital: '兰州', region: '西北', color: '#F57C00' },
  { char: '青', short: '青海', province: '青海省', class: '小型汽车', capital: '西宁', region: '西北', color: '#F57C00' },
  { char: '宁', short: '宁夏', province: '宁夏回族自治区', class: '小型汽车', capital: '银川', region: '西北', color: '#F57C00' },
  { char: '新', short: '新疆', province: '新疆维吾尔自治区', class: '小型汽车', capital: '乌鲁木齐', region: '西北', color: '#F57C00' },
]);

function onQuery() {
  const p = plate.value.trim();
  if (!p) return;
  const char = p[0];
  const found = provinces.value.find(x => x.char === char);
  if (found) {
    result.value = found;
  } else {
    uni.showToast({ title: '未识别的车牌号', icon: 'none' });
  }
}

function onPlateTap(p: any) {
  plate.value = p.char;
  result.value = p;
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #1A6CFF 0%, #0D47A1 100%);
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
  padding: 28rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-grey;
  border-radius: $radius-md;
  height: 96rpx;
  padding: 0 24rpx;
}

.input-prefix {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.form-input {
  flex: 1;
  height: 96rpx;
  font-size: 30rpx;
  color: $text-primary;
  font-family: monospace;
  letter-spacing: 1rpx;
}

.placeholder {
  color: $text-tertiary;
  font-family: sans-serif;
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  background: $text-tertiary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
}

.form-tip {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 12rpx;
}

.query-btn {
  margin-top: 24rpx;
  height: 88rpx;
  background: $info;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(26, 108, 255, 0.3);
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
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.result-header {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
}

.result-char {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  font-weight: 800;
  color: #fff;
  font-family: serif;
  margin-right: 24rpx;
}

.result-info {
  flex: 1;
}

.result-province {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.result-class {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.result-list {
  padding: 0 28rpx;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.result-row:last-child {
  border-bottom: none;
}

.row-label {
  font-size: 28rpx;
  color: $text-tertiary;
}

.row-value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

/* 网格 */
.plate-grid {
  background: $bg-card;
  margin: 0 24rpx;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.plate-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 0;
}

.plate-char {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.pc-text {
  font-size: 40rpx;
  font-weight: 800;
  color: #fff;
  font-family: serif;
}

.plate-name {
  font-size: 22rpx;
  color: $text-secondary;
}
</style>
