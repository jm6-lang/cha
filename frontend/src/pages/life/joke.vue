<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">😄</view>
        <text class="header-title">笑话大全</text>
        <text class="header-desc">笑一笑 · 十年少</text>
      </view>
    </view>

    <view class="filter-bar">
      <view v-for="t in types" :key="t" class="filter" :class="{ active: activeType === t }" @tap="activeType = t">
        <text class="filter-text">{{ t }}</text>
      </view>
    </view>

    <view class="joke-list">
      <view v-for="(j, i) in jokes" :key="i" class="joke-card">
        <view class="joke-header">
          <text class="joke-emoji">{{ j.emoji }}</text>
          <view class="joke-info">
            <text class="joke-title">{{ j.title }}</text>
            <text class="joke-meta">{{ j.meta }}</text>
          </view>
        </view>
        <text class="joke-content">{{ j.content }}</text>
        <view class="joke-footer">
          <view class="action">
            <text class="action-icon">👍</text>
            <text class="action-num">{{ j.likes }}</text>
          </view>
          <view class="action">
            <text class="action-icon">⭐</text>
            <text class="action-num">{{ j.favorites }}</text>
          </view>
          <view class="action">
            <text class="action-icon">💬</text>
            <text class="action-num">{{ j.comments }}</text>
          </view>
          <view class="action share">
            <text class="action-icon">🔗</text>
            <text class="action-num">分享</text>
          </view>
        </view>
      </view>
    </view>

    <view class="load-more" @tap="loadMore">换一批</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const activeType = ref('全部');
const types = ['全部', '段子', '糗事', '职场', '校园', '家庭'];
const jokes = [
  { emoji: '😄', title: '程序员糗事', meta: '职场 · 3分钟前', content: '昨天加班写代码，bug一直找不到。老婆打电话问：这么晚还在干嘛？我：写bug呢。老婆：什么是bug？我：就是程序员养的宠物。老婆：那你养了几只？我：几十只吧。', likes: '1.2k', favorites: '328', comments: '52' },
  { emoji: '🤣', title: '老王的故事', meta: '段子 · 5分钟前', content: '老王去修电脑，师傅说：你这电脑该换了。老王：再修修看吧。师傅：你这硬盘都坏道了，内存也老化了，显卡也……老王：你就直接说要多少钱吧！', likes: '856', favorites: '215', comments: '38' },
  { emoji: '😊', title: '夫妻日常', meta: '家庭 · 8分钟前', content: '老公对老婆说：你是家里的CEO。老婆：真的？老公：是的，Cao E Ou。', likes: '1.5k', favorites: '456', comments: '78' },
  { emoji: '😂', title: '学生趣事', meta: '校园 · 12分钟前', content: '上数学课，老师：小明，1+1等于几？小明：老师我不知道。老师：那我告诉你，1+1=2。然后呢？小明：然后老师你给我解释一下 1+1 怎么就等于 2 了？', likes: '956', favorites: '267', comments: '45' }
];

const loadMore = () => {
  uni.showToast({ title: '已更新', icon: 'success' });
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #FF9800, #FFB74D); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.filter-bar { display: flex; gap: 16rpx; padding: 30rpx 24rpx 0; overflow-x: auto; }
.filter { padding: 10rpx 24rpx; background: #fff; border-radius: 30rpx; }
.filter.active { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.filter-text { font-size: 24rpx; color: $text-secondary; white-space: nowrap; }
.filter.active .filter-text { color: #fff; }
.joke-list { padding: 24rpx; }
.joke-card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.joke-header { display: flex; align-items: center; }
.joke-emoji { font-size: 50rpx; margin-right: 20rpx; }
.joke-info { }
.joke-title { font-size: 28rpx; color: $text-primary; font-weight: 700; display: block; }
.joke-meta { font-size: 22rpx; color: $text-tertiary; display: block; margin-top: 4rpx; }
.joke-content { font-size: 28rpx; color: $text-primary; line-height: 1.7; display: block; margin: 20rpx 0; }
.joke-footer { display: flex; padding-top: 16rpx; border-top: 1rpx solid $border-color; }
.action { display: flex; align-items: center; margin-right: 30rpx; }
.action.share { margin-left: auto; margin-right: 0; color: $primary; }
.action-icon { font-size: 28rpx; margin-right: 6rpx; }
.action-num { font-size: 24rpx; color: $text-tertiary; }
.load-more { text-align: center; padding: 30rpx; color: $primary; font-size: 28rpx; }
</style>
