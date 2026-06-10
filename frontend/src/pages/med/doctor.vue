<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">👨‍⚕️</view>
        <text class="header-title">医生查询</text>
        <text class="header-desc">执业医生 · 资质核验</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入医生姓名/医院" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="dept-list">
      <text class="section-title">按科室</text>
      <view class="dept-grid">
        <view v-for="d in depts" :key="d" class="dept-item">{{ d }}</view>
      </view>
    </view>

    <view class="doctor-list">
      <text class="section-title">推荐医生</text>
      <view v-for="(d, i) in doctors" :key="i" class="doctor-card">
        <view class="doctor-avatar">{{ d.name[0] }}</view>
        <view class="doctor-info">
          <text class="doctor-name">{{ d.name }}</text>
          <text class="doctor-title">{{ d.title }} · {{ d.dept }}</text>
          <text class="doctor-hospital">📍 {{ d.hospital }}</text>
          <view class="doctor-tags">
            <text v-for="t in d.tags" :key="t" class="doctor-tag">{{ t }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const depts = ['内科', '外科', '妇产科', '儿科', '骨科', '眼科', '口腔', '皮肤', '精神', '中医', '肿瘤', '心内'];
const doctors = [
  { name: '张明远', title: '主任医师', dept: '心内科', hospital: '北京协和医院', tags: ['30年经验', '博士生导师'] },
  { name: '李静怡', title: '副主任医师', dept: '妇产科', hospital: '北京大学第一医院', tags: ['15年经验'] },
  { name: '王建明', title: '主治医师', dept: '骨科', hospital: '上海瑞金医院', tags: ['12年经验', '运动医学'] }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入医生姓名', icon: 'none' });
    return;
  }
  uni.showToast({ title: '查询中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #00BCD4, #4DD0E1); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: $text-primary; display: block; padding: 30rpx 24rpx 20rpx; }
.dept-list { }
.dept-grid { background: #fff; margin: 0 24rpx; border-radius: 20rpx; padding: 20rpx; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.dept-item { text-align: center; font-size: 26rpx; color: $text-secondary; padding: 16rpx 0; background: $bg-page; border-radius: 10rpx; }
.doctor-list { }
.doctor-card { background: #fff; margin: 0 24rpx 20rpx; border-radius: 20rpx; padding: 24rpx; display: flex; }
.doctor-avatar { width: 100rpx; height: 100rpx; border-radius: 50%; background: linear-gradient(135deg, #00BCD4, #4DD0E1); color: #fff; font-size: 44rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.doctor-info { flex: 1; margin-left: 20rpx; }
.doctor-name { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.doctor-title { font-size: 24rpx; color: $info; display: block; margin: 6rpx 0; }
.doctor-hospital { font-size: 22rpx; color: $text-tertiary; display: block; margin-bottom: 10rpx; }
.doctor-tags { display: flex; gap: 10rpx; }
.doctor-tag { font-size: 20rpx; color: $warning; background: rgba(255,152,0,0.1); padding: 4rpx 12rpx; border-radius: 6rpx; }
</style>
