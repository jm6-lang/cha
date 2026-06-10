<template>
  <view class="page">
    <view class="q-header">
      <text class="q-category">查询问题</text>
      <text class="q-title">如何查询手机号标记？</text>
      <text class="q-stats">阅读 12,358 次 · 1,256 人觉得有用</text>
    </view>

    <view class="q-content">
      <text class="section-title">问题描述</text>
      <text class="content-text">在使用数查 App 时，如何查询一个陌生手机号的标记信息？</text>

      <text class="section-title">操作步骤</text>
      <text class="content-text">1. 打开数查 App，进入首页</text>
      <text class="content-text">2. 在顶部搜索框输入 11 位手机号</text>
      <text class="content-text">3. 点击"查询"按钮</text>
      <text class="content-text">4. 等待 1-3 秒查看查询结果</text>
      <text class="content-text">5. 标记查询免费，归属地查询免费</text>

      <text class="section-title">常见问题</text>
      <text class="content-text">Q：查询结果显示 0 标记，是否代表号码一定安全？</text>
      <text class="content-text">A：不一定。0 标记可能是因为：</text>
      <text class="content-text">  • 该号码确实无任何公开标记</text>
      <text class="content-text">  • 号码新启用，还未被他人标记</text>
      <text class="content-text">  • 标记信息尚未同步到平台</text>
      <text class="content-text">建议结合查询次数多的"号码深度报告"综合判断。</text>

      <text class="content-text">Q：查询结果中的"标记来源"是什么意思？</text>
      <text class="content-text">A：标记来源指标记信息来自哪个第三方平台，如腾讯手机管家、360 手机卫士、电话邦等。多个来源都有的标记通常比较准确。</text>

      <text class="content-text">Q：自己的号码被错误标记了怎么办？</text>
      <text class="content-text">A：可在"清除标记"服务中提交申诉，我们会在 1-3 个工作日内联系各平台处理。</text>
    </view>

    <view class="helpful-bar">
      <text class="helpful-text">这个回答对您有帮助吗？</text>
      <view class="helpful-btns">
        <view class="h-btn" @tap="onHelpful(true)">
          <text class="h-icon">👍</text>
          <text class="h-text">有用</text>
        </view>
        <view class="h-btn" @tap="onHelpful(false)">
          <text class="h-icon">👎</text>
          <text class="h-text">无用</text>
        </view>
      </view>
    </view>

    <view class="related-list">
      <text class="section-title">相关问题</text>
      <view
        v-for="r in related"
        :key="r.id"
        class="related-item"
        @tap="onRelatedTap(r)"
      >
        <text class="r-title">{{ r.title }}</text>
        <text class="r-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const related = ref([
  { id: 2, title: '清除标记需要多久？' },
  { id: 3, title: '查询次数怎么用？' },
  { id: 6, title: '个人隐私如何保护？' },
]);

function onHelpful(positive: boolean) {
  uni.showToast({ title: positive ? '感谢您的反馈' : '感谢反馈,我们会改进', icon: 'success' });
}

function onRelatedTap(r: any) {
  uni.showToast({ title: r.title, icon: 'none' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.q-header {
  background: $bg-card;
  padding: 32rpx 28rpx 24rpx;
  border-bottom: 1rpx solid $border;
}

.q-category {
  display: inline-block;
  font-size: 22rpx;
  color: $info;
  background: rgba(26, 108, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-bottom: 12rpx;
}

.q-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.q-stats {
  font-size: 22rpx;
  color: $text-tertiary;
}

.q-content {
  background: $bg-card;
  margin: 16rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin: 20rpx 0 12rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.section-title:first-child {
  margin-top: 0;
}

.content-text {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 4rpx;
}

/* 反馈 */
.helpful-bar {
  background: $bg-card;
  margin: 16rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.helpful-text {
  font-size: 28rpx;
  color: $text-primary;
}

.helpful-btns {
  display: flex;
  gap: 12rpx;
}

.h-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background: $bg-grey;
  border-radius: 999rpx;
}

.h-icon {
  font-size: 28rpx;
}

.h-text {
  font-size: 24rpx;
  color: $text-primary;
}

/* 相关 */
.related-list {
  background: $bg-card;
  margin: 16rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.related-item:last-child {
  border-bottom: none;
}

.r-title {
  font-size: 28rpx;
  color: $text-primary;
  flex: 1;
}

.r-arrow {
  font-size: 32rpx;
  color: $text-tertiary;
  font-weight: 300;
}
</style>
