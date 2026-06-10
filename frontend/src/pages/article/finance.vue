<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📚</view>
        <text class="header-title">金融知识</text>
        <text class="header-desc">信用贷款 理财投资 风险防范</text>
      </view>
    </view>

    <view class="category-bar">
      <view
        v-for="c in categories"
        :key="c.key"
        class="cat-item"
        :class="{ active: activeCat === c.key }"
        @tap="activeCat = c.key"
      >
        <text class="cat-text">{{ c.name }}</text>
      </view>
    </view>

    <view class="article-list">
      <view
        v-for="a in filteredArticles"
        :key="a.id"
        class="article-item"
        @tap="onArticleTap(a)"
      >
        <view class="article-icon" :style="{ background: a.color }">
          <text class="ai-text">{{ a.icon }}</text>
        </view>
        <view class="article-info">
          <text class="a-title">{{ a.title }}</text>
          <text class="a-desc">{{ a.desc }}</text>
          <view class="a-meta">
            <text class="a-views">{{ a.views }} 阅读</text>
            <text class="a-time">{{ a.time }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const activeCat = ref('all');

const categories = [
  { key: 'all', name: '全部' },
  { key: 'credit', name: '征信知识' },
  { key: 'loan', name: '贷款知识' },
  { key: 'invest', name: '投资理财' },
  { key: 'risk', name: '风险防范' },
];

const articles = ref([
  { id: 1, cat: 'credit', icon: '💳', color: '#E3F2FD', title: '什么是个人征信？', desc: '个人征信是您的"经济身份证"，记录您的信用历史和还款能力。', views: '12.5万', time: '2天前' },
  { id: 2, cat: 'loan', icon: '💰', color: '#FFF3E0', title: '如何选择适合自己的贷款？', desc: '从利率、期限、还款方式三个维度分析，教你选到最适合的贷款产品。', views: '8.3万', time: '5天前' },
  { id: 3, cat: 'invest', icon: '📈', color: '#E8F5E9', title: '理财入门：从余额宝开始', desc: '低风险理财的入门指南，新手也能轻松学会的理财方法。', views: '15.2万', time: '1周前' },
  { id: 4, cat: 'risk', icon: '🛡️', color: '#FCE4EC', title: '如何识别和防范网贷诈骗？', desc: '揭秘常见网贷诈骗手段，保护自己的财产安全和征信记录。', views: '20.1万', time: '1周前' },
  { id: 5, cat: 'credit', icon: '📊', color: '#F3E5F5', title: '征信花了怎么办？', desc: '征信查询过多、负债过高都会"花"，修复方法看这里。', views: '9.6万', time: '2周前' },
  { id: 6, cat: 'loan', icon: '🏠', color: '#E0F7FA', title: '房贷利率怎么算？', desc: '详细解读 LPR、加点、还款方式等房贷核心概念。', views: '11.3万', time: '2周前' },
  { id: 7, cat: 'invest', icon: '💎', color: '#FFF8E1', title: '基金定投的正确姿势', desc: '基金定投的时机选择、品种搭配和止盈策略详解。', views: '7.8万', time: '3周前' },
  { id: 8, cat: 'risk', icon: '⚠️', color: '#FFE0B2', title: '银行卡盗刷怎么办？', desc: '第一时间该做什么？保留哪些证据？如何申请赔付？', views: '13.4万', time: '3周前' },
]);

const filteredArticles = computed(() => {
  if (activeCat.value === 'all') return articles.value;
  return articles.value.filter(a => a.cat === activeCat.value);
});

function onArticleTap(a: any) {
  uni.showToast({ title: `查看：${a.title}`, icon: 'none' });
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
  background: linear-gradient(180deg, #5C6BC0 0%, #283593 100%);
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

/* 分类 */
.category-bar {
  display: flex;
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-md;
  padding: 8rpx;
  gap: 4rpx;
  overflow-x: auto;
}

.cat-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 16rpx;
  border-radius: $radius-sm;
  white-space: nowrap;
}

.cat-item.active {
  background: $info;
}

.cat-text {
  font-size: 24rpx;
  color: $text-secondary;
}

.cat-item.active .cat-text {
  color: #fff;
  font-weight: 600;
}

/* 列表 */
.article-list {
  margin: 20rpx 24rpx 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.article-item {
  display: flex;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.article-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.ai-text {
  font-size: 48rpx;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.a-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 6rpx;
}

.a-desc {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 1.5;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.a-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.a-views {
  font-size: 20rpx;
  color: $text-tertiary;
}

.a-time {
  font-size: 20rpx;
  color: $text-tertiary;
}
</style>
