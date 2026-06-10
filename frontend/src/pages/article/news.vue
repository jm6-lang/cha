<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📰</view>
        <text class="header-title">新闻头条</text>
        <text class="header-desc">实时热点 · 资讯</text>
      </view>
    </view>

    <view class="filter-bar">
      <view v-for="t in types" :key="t" class="filter" :class="{ active: activeType === t }" @tap="activeType = t">
        <text class="filter-text">{{ t }}</text>
      </view>
    </view>

    <view class="news-list">
      <view v-for="(n, i) in news" :key="i" class="news-item">
        <view class="news-content">
          <view class="news-tag-row">
            <text class="news-tag" :class="{ hot: i < 2 }">{{ n.tag }}</text>
            <text class="news-time">{{ n.time }}</text>
          </view>
          <text class="news-title">{{ n.title }}</text>
          <text class="news-source">{{ n.source }} · 阅读 {{ n.views }}</text>
        </view>
        <view v-if="n.image" class="news-image">{{ n.image }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeType = ref('推荐');
const types = ['推荐', '国内', '国际', '财经', '科技', '体育', '娱乐', '军事'];
const news = [
  { tag: '热', title: '央行宣布下调存款准备金率 0.25 个百分点', source: '新华社', views: '128万', time: '5分钟前', image: '🏦' },
  { tag: '热', title: '国产大飞机 C919 完成商业飞行一周年', source: '人民日报', views: '98万', time: '12分钟前', image: '✈️' },
  { tag: '新', title: '某科技公司发布最新 AI 大模型，性能超越 GPT-4', source: '科技日报', views: '65万', time: '23分钟前', image: '🤖' },
  { tag: '财经', title: '上证指数突破 3500 点，创年内新高', source: '证券时报', views: '52万', time: '35分钟前', image: '📈' },
  { tag: '科技', title: '华为发布 Mate70 系列手机，搭载全新麒麟芯片', source: '第一财经', views: '78万', time: '1小时前', image: '📱' },
  { tag: '社会', title: '多地推出促消费政策，发放消费券超 10 亿元', source: '经济参考报', views: '32万', time: '1小时前', image: '🎟️' }
];
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF5252, #FF7676); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.filter-bar { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; overflow-x: auto; }
.filter { padding: 10rpx 24rpx; background: #fff; border-radius: 30rpx; }
.filter.active { background: linear-gradient(135deg, #FF5252, #FF7676); }
.filter-text { font-size: 24rpx; color: $text-secondary; white-space: nowrap; }
.filter.active .filter-text { color: #fff; }
.news-list { padding: 24rpx; }
.news-item { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; display: flex; }
.news-content { flex: 1; }
.news-tag-row { display: flex; align-items: center; gap: 12rpx; }
.news-tag { font-size: 20rpx; color: $primary; background: rgba(7,193,96,0.1); padding: 4rpx 12rpx; border-radius: 6rpx; }
.news-tag.hot { color: #fff; background: linear-gradient(135deg, #FF5252, #FF7676); }
.news-time { font-size: 22rpx; color: $text-tertiary; }
.news-title { font-size: 30rpx; color: $text-primary; font-weight: 600; display: block; margin: 12rpx 0 16rpx; line-height: 1.4; }
.news-source { font-size: 22rpx; color: $text-tertiary; }
.news-image { width: 180rpx; height: 140rpx; background: $bg-page; border-radius: 16rpx; display: flex; align-items: center; justify-content: center; font-size: 60rpx; margin-left: 20rpx; }
</style>
