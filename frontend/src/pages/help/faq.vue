<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">❓</view>
        <text class="header-title">帮助中心</text>
        <text class="header-desc">有问题 这里找答案</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索问题关键词"
          placeholder-class="placeholder"
        />
        <text v-if="keyword" class="search-clear" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <view class="category-grid">
      <view
        v-for="c in categories"
        :key="c.name"
        class="category-item"
        @tap="onCategoryTap(c)"
      >
        <view class="category-icon" :style="{ background: c.color }">
          <text class="ci-text">{{ c.icon }}</text>
        </view>
        <text class="category-name">{{ c.name }}</text>
      </view>
    </view>

    <view class="hot-questions">
      <text class="section-title">热门问题</text>
      <view
        v-for="q in hotQuestions"
        :key="q.id"
        class="q-item"
        @tap="onQuestionTap(q)"
      >
        <view class="q-row">
          <text class="q-title">{{ q.title }}</text>
          <text class="q-arrow">›</text>
        </view>
        <text class="q-desc">{{ q.desc }}</text>
      </view>
    </view>

    <view class="contact-bar">
      <view class="contact-item" @tap="onContact('chat')">
        <text class="contact-icon">💬</text>
        <text class="contact-name">在线客服</text>
      </view>
      <view class="contact-item" @tap="onContact('phone')">
        <text class="contact-icon">📞</text>
        <text class="contact-name">电话客服</text>
      </view>
      <view class="contact-item" @tap="onContact('feedback')">
        <text class="contact-icon">📝</text>
        <text class="contact-name">意见反馈</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const keyword = ref('');

const categories = ref([
  { name: '查询问题', icon: '🔍', color: '#E8F5E9' },
  { name: '支付问题', icon: '💰', color: '#FFF3E0' },
  { name: '账户问题', icon: '👤', color: '#E3F2FD' },
  { name: '订单问题', icon: '📋', color: '#FCE4EC' },
  { name: '会员问题', icon: '💎', color: '#F3E5F5' },
  { name: '隐私问题', icon: '🔒', color: '#E0F7FA' },
  { name: '代理问题', icon: '🤝', color: '#FFF8E1' },
  { name: '其他问题', icon: '❔', color: '#F1F8E9' },
]);

const hotQuestions = ref([
  { id: 1, title: '如何查询手机号标记？', desc: '在首页输入 11 位手机号，点击查询即可查看全网标记情况' },
  { id: 2, title: '清除标记需要多久？', desc: '清除标记服务提交后 1-3 个工作日内处理完成' },
  { id: 3, title: '查询次数怎么用？', desc: '购买的查询次数永久有效，VIP 会员次数按月发放' },
  { id: 4, title: '充值后没到账怎么办？', desc: '请提供支付截图，联系客服 5 分钟内处理' },
  { id: 5, title: '如何申请退款？', desc: '未使用的服务 7 天内可申请全额退款' },
  { id: 6, title: '个人隐私如何保护？', desc: '我们采用银行级加密，不存储用户敏感信息' },
  { id: 7, title: '如何成为代理？', desc: '在代理中心提交申请，通过审核后即可获得推广码' },
  { id: 8, title: '企业用户有折扣吗？', desc: '企业用户联系商务可享受大客户折扣' },
]);

function onCategoryTap(c: any) {
  uni.showToast({ title: `查看${c.name}分类`, icon: 'none' });
}

function onQuestionTap(q: any) {
  uni.navigateTo({ url: `/pages/help/detail?id=${q.id}` });
}

function onContact(type: string) {
  if (type === 'chat') uni.navigateTo({ url: '/pages/hcc/chat' });
  else if (type === 'phone') uni.showModal({ title: '客服热线', content: '400-888-9999\n工作时间 9:00-21:00', showCancel: false });
  else if (type === 'feedback') uni.navigateTo({ url: '/pages/user/feedback' });
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
  background: linear-gradient(180deg, $info 0%, #0D47A1 100%);
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

/* 搜索 */
.search-bar {
  margin: -28rpx 24rpx 0;
  position: relative;
  z-index: 10;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: 999rpx;
  padding: 0 24rpx;
  height: 88rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
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

/* 分类 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 16rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 0;
}

.category-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ci-text {
  font-size: 40rpx;
}

.category-name {
  font-size: 22rpx;
  color: $text-secondary;
}

/* 问题 */
.hot-questions {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.q-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.q-item:last-child {
  border-bottom: none;
}

.q-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6rpx;
}

.q-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  flex: 1;
}

.q-arrow {
  font-size: 32rpx;
  color: $text-tertiary;
  font-weight: 300;
}

.q-desc {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 1.5;
}

/* 联系 */
.contact-bar {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 0;
}

.contact-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.contact-icon {
  font-size: 48rpx;
}

.contact-name {
  font-size: 24rpx;
  color: $text-secondary;
}
</style>
