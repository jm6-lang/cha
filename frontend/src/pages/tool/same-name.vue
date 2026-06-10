<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👥</view>
        <text class="header-title">同名同姓</text>
        <text class="header-desc">全国同名人查询</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入姓名" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view v-if="searched" class="result-card">
      <view class="total-block">
        <text class="total-num">68,425</text>
        <text class="total-label">全国叫"{{ keyword }}"的人数</text>
        <view class="ratio-bar">
          <view class="ratio-item">
            <text class="r-num">42,158</text>
            <text class="r-lbl">男</text>
            <view class="r-bar"><view class="r-fill male" :style="{ width: '61%' }" /></view>
          </view>
          <view class="ratio-item">
            <text class="r-num">26,267</text>
            <text class="r-lbl">女</text>
            <view class="r-bar"><view class="r-fill female" :style="{ width: '38%' }" /></view>
          </view>
        </view>
      </view>

      <view class="region-section">
        <text class="section-title">地域分布 TOP 5</text>
        <view v-for="(r, i) in regions" :key="i" class="region-item">
          <text class="r-rank">{{ i + 1 }}</text>
          <text class="r-name">{{ r.name }}</text>
          <view class="r-progress">
            <view class="r-pbar" :style="{ width: r.percent + '%' }" />
          </view>
          <text class="r-count">{{ r.count }}</text>
        </view>
      </view>

      <view class="age-section">
        <text class="section-title">年龄分布</text>
        <view class="age-grid">
          <view v-for="(a, i) in ages" :key="i" class="age-item">
            <text class="a-num">{{ a.count }}</text>
            <text class="a-range">{{ a.range }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('张伟');
const searched = ref(true);
const regions = [
  { name: '河南省', count: '8,256', percent: 100 },
  { name: '山东省', count: '6,824', percent: 82 },
  { name: '河北省', count: '5,632', percent: 68 },
  { name: '江苏省', count: '4,215', percent: 51 },
  { name: '安徽省', count: '3,856', percent: 47 }
];
const ages = [
  { range: '0-18', count: '8,210' },
  { range: '19-30', count: '15,632' },
  { range: '31-45', count: '22,158' },
  { range: '46-60', count: '16,425' },
  { range: '60+', count: '6,000' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入姓名', icon: 'none' });
    return;
  }
  searched.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; }
.header { background: linear-gradient(135deg, #7B61FF, #A78BFA); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #7B61FF, #A78BFA); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.result-card { margin: 30rpx 24rpx; }
.total-block { background: linear-gradient(135deg, #7B61FF, #A78BFA); border-radius: 20rpx; padding: 50rpx 30rpx; text-align: center; color: #fff; }
.total-num { font-size: 80rpx; font-weight: 700; display: block; }
.total-label { font-size: 26rpx; opacity: 0.9; display: block; margin: 12rpx 0 30rpx; }
.ratio-bar { display: flex; gap: 20rpx; }
.ratio-item { flex: 1; }
.r-num { font-size: 30rpx; font-weight: 700; display: block; }
.r-lbl { font-size: 22rpx; opacity: 0.9; display: block; margin: 4rpx 0 8rpx; }
.r-bar { height: 12rpx; background: rgba(255,255,255,0.2); border-radius: 6rpx; overflow: hidden; }
.r-fill { height: 100%; border-radius: 6rpx; }
.r-fill.male { background: #1976D2; }
.r-fill.female { background: #E91E63; }
.region-section { background: #fff; border-radius: 20rpx; margin-top: 20rpx; padding: 10rpx 30rpx; }
.section-title { font-size: 28rpx; font-weight: 700; color: $text-primary; display: block; padding: 24rpx 0 16rpx; }
.region-item { display: flex; align-items: center; padding: 16rpx 0; }
.r-rank { width: 50rpx; font-size: 28rpx; color: $warning; font-weight: 700; }
.r-name { font-size: 28rpx; color: $text-primary; width: 130rpx; }
.r-progress { flex: 1; height: 16rpx; background: $bg-page; border-radius: 8rpx; overflow: hidden; margin: 0 20rpx; }
.r-pbar { height: 100%; background: linear-gradient(90deg, #7B61FF, #A78BFA); border-radius: 8rpx; }
.r-count { font-size: 24rpx; color: $text-tertiary; min-width: 100rpx; text-align: right; }
.age-section { background: #fff; border-radius: 20rpx; margin-top: 20rpx; padding: 10rpx 30rpx; }
.age-grid { display: flex; padding: 16rpx 0 30rpx; }
.age-item { flex: 1; text-align: center; }
.a-num { font-size: 24rpx; color: $text-primary; font-weight: 700; display: block; }
.a-range { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 6rpx; }
</style>
