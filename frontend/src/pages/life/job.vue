<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🏆</view>
        <text class="header-title">招聘查询</text>
        <text class="header-desc">企业招聘 · 薪资 · 评价</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入职位/公司" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">搜索</text>
      </view>
    </view>

    <view class="filter-bar">
      <view class="filter">城市 ▾</view>
      <view class="filter">薪资 ▾</view>
      <view class="filter">经验 ▾</view>
      <view class="filter">学历 ▾</view>
    </view>

    <view class="job-list">
      <view v-for="(j, i) in jobs" :key="i" class="job-card">
        <view class="job-top">
          <view>
            <text class="job-name">{{ j.name }}</text>
            <text class="job-salary">{{ j.salary }}</text>
          </view>
          <text class="job-company">{{ j.company }}</text>
        </view>
        <view class="job-tags">
          <text v-for="t in j.tags" :key="t" class="job-tag">{{ t }}</text>
        </view>
        <view class="job-bottom">
          <text class="job-meta">{{ j.location }} · {{ j.exp }} · {{ j.edu }}</text>
          <text class="job-cta">查看</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const jobs = [
  { name: '高级前端工程师', salary: '25-50K·15薪', company: '某互联网大厂', tags: ['Vue', 'React', 'TypeScript'], location: '北京', exp: '5-10年', edu: '本科' },
  { name: '产品经理', salary: '20-40K', company: '某创业公司', tags: ['B端', 'SaaS', '从0到1'], location: '上海', exp: '3-5年', edu: '本科' },
  { name: 'Java 开发工程师', salary: '18-35K', company: '某金融科技公司', tags: ['Spring Cloud', 'MySQL', 'Redis'], location: '深圳', exp: '3-5年', edu: '本科' },
  { name: 'UI 设计师', salary: '15-30K', company: '某设计公司', tags: ['移动端', 'Figma', 'UX'], location: '杭州', exp: '3-5年', edu: '本科' }
];

const onSearch = () => {
  if (!keyword.value) {
    uni.showToast({ title: '请输入关键词', icon: 'none' });
    return;
  }
  uni.showToast({ title: '搜索中', icon: 'loading' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF6B35, #FF9F66); padding: 30rpx 40rpx 80rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: -40rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #FF6B35, #FF9F66); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.filter-bar { display: flex; padding: 30rpx 24rpx 0; gap: 16rpx; }
.filter { flex: 1; padding: 16rpx 0; text-align: center; background: #fff; border-radius: 12rpx; font-size: 24rpx; color: $text-secondary; }
.job-list { padding: 24rpx; }
.job-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.job-top { display: flex; justify-content: space-between; align-items: flex-start; }
.job-name { font-size: 30rpx; color: $text-primary; font-weight: 700; display: block; }
.job-salary { font-size: 28rpx; color: $danger; font-weight: 700; display: block; margin-top: 8rpx; }
.job-company { font-size: 24rpx; color: $text-secondary; }
.job-tags { display: flex; gap: 10rpx; margin: 16rpx 0; }
.job-tag { font-size: 20rpx; color: $info; background: rgba(26,108,255,0.08); padding: 4rpx 14rpx; border-radius: 6rpx; }
.job-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 16rpx; border-top: 1rpx solid $border-color; }
.job-meta { font-size: 22rpx; color: $text-tertiary; }
.job-cta { font-size: 24rpx; color: $primary; font-weight: 600; }
</style>
