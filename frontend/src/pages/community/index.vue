<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="nav-title">社区</text>
    </view>

    <!-- Tab切换 -->
    <view class="tabs">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-item"
        :class="{ active: activeTab === i }"
        @tap="activeTab = i"
      >
        <text class="tab-text">{{ tab }}</text>
      </view>
    </view>

    <!-- 帖子列表 -->
    <view class="post-list">
      <view v-for="(post, i) in posts" :key="i" class="post-card">
        <view class="post-header">
          <view class="post-avatar">{{ post.author.charAt(0) }}</view>
          <view class="post-author-info">
            <text class="post-author">{{ post.author }}</text>
            <text class="post-time">{{ post.time }}</text>
          </view>
        </view>
        <view class="post-content">
          <text class="post-text">{{ post.content }}</text>
        </view>
        <view class="post-footer">
          <view class="post-action">
            <text class="action-icon">&#128077;</text>
            <text class="action-count">{{ post.likes }}</text>
          </view>
          <view class="post-action">
            <text class="action-icon">&#128172;</text>
            <text class="action-count">{{ post.comments }}</text>
          </view>
          <view class="post-action">
            <text class="action-icon">&#128228;</text>
            <text class="action-count">分享</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="posts.length === 0" class="empty">
        <text class="empty-text">暂无内容，敬请期待</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);
const tabs = ['热门', '最新', '关注'];

const posts = ref([
  {
    author: '数查官方',
    time: '2小时前',
    content: '号码标记查询功能已上线，快来体验吧！输入手机号即可查询标记信息，免费使用中~',
    likes: 128,
    comments: 36,
  },
  {
    author: '用户小王',
    time: '5小时前',
    content: '用了数查查了一个骚扰电话，果然标记了推销，以后再也不接了！',
    likes: 56,
    comments: 12,
  },
  {
    author: '安全达人',
    time: '1天前',
    content: '提醒大家注意陌生号码，特别是400开头的，很多都是推销或诈骗。建议用数查先查一下再接听。',
    likes: 89,
    comments: 24,
  },
]);
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

.nav-bar {
  background: $primary;
  padding: 60rpx 32rpx 24rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.tabs {
  display: flex;
  background: $bg-card;
  padding: 0 32rpx;
  border-bottom: 1rpx solid $border;
}

.tab-item {
  padding: 24rpx 32rpx;
  position: relative;
}

.tab-item.active .tab-text {
  color: $primary;
  font-weight: 700;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 6rpx;
  background: $primary;
  border-radius: 3rpx;
}

.tab-text {
  font-size: 30rpx;
  color: $text-secondary;
}

.post-list {
  padding: 24rpx;
}

.post-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.post-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: $primary;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.post-author-info {
  display: flex;
  flex-direction: column;
}

.post-author {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-primary;
}

.post-time {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

.post-content {
  margin-bottom: 16rpx;
}

.post-text {
  font-size: 28rpx;
  color: $text-primary;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  gap: 48rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid $border;
}

.post-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 28rpx;
}

.action-count {
  font-size: 24rpx;
  color: $text-tertiary;
}

.empty {
  text-align: center;
  padding: 96rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: $text-tertiary;
}
</style>
