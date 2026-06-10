<template>
  <view class="page">
    <!-- Tab切换 -->
    <view class="tabs">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-item"
        :class="{ active: activeTab === i }"
        @tap="activeTab = i"
      >
        <text class="tab-text">{{ tab.name }}</text>
        <view v-if="tab.badge > 0" class="tab-badge">
          <text class="tab-badge-text">{{ tab.badge > 99 ? '99+' : tab.badge }}</text>
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <view v-if="displayList.length > 0" class="msg-list">
      <view
        v-for="(msg, i) in displayList"
        :key="i"
        class="msg-item"
        @tap="onMsgTap(msg)"
      >
        <view class="msg-icon-wrap" :style="{ background: msg.bgColor }">
          <text class="msg-icon">{{ msg.icon }}</text>
        </view>
        <view class="msg-content">
          <view class="msg-top">
            <text class="msg-title">{{ msg.title }}</text>
            <text class="msg-time">{{ msg.time }}</text>
          </view>
          <text class="msg-desc">{{ msg.desc }}</text>
          <view v-if="!msg.read" class="msg-unread" />
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-wrap">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无消息</text>
      <text class="empty-hint">系统通知和活动消息将在这里显示</text>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const activeTab = ref(0);

const tabs = ref([
  { name: '全部', badge: 0 },
  { name: '系统通知', badge: 0 },
  { name: '活动公告', badge: 0 },
  { name: '查询结果', badge: 0 },
]);

// 全部消息数据
const allMessages = ref([
  {
    type: 'system',
    icon: '🔔',
    bgColor: '#E8F8EF',
    title: '欢迎使用数查',
    desc: '您的账户已成功注册，享受免费的号码标记查询服务。',
    time: '5分钟前',
    read: false,
  },
  {
    type: 'activity',
    icon: '🎁',
    bgColor: '#FFF0E8',
    title: '新用户专享福利',
    desc: '首次充值满10元送5元优惠券，限时领取，先到先得！',
    time: '1小时前',
    read: false,
  },
  {
    type: 'result',
    icon: '📊',
    bgColor: '#E0F7FA',
    title: '查询完成通知',
    desc: '您查询的手机号 138****8888 共有 3 条标记信息，详情请查看查询历史。',
    time: '2小时前',
    read: false,
  },
  {
    type: 'system',
    icon: '🛡️',
    bgColor: '#E8F5E9',
    title: '隐私政策更新',
    desc: '我们更新了隐私政策，新增了数据加密说明和第三方共享说明。',
    time: '昨天',
    read: true,
  },
  {
    type: 'activity',
    icon: '💎',
    bgColor: '#E8F0FF',
    title: 'VIP会员限时优惠',
    desc: '开通VIP会员享8折优惠，专享免费查询次数和专属客服。',
    time: '2天前',
    read: true,
  },
  {
    type: 'system',
    icon: '⭐',
    bgColor: '#FFF3E0',
    title: '服务升级公告',
    desc: '号码标记数据库已更新，新增 10万+ 标记数据，查询更准确。',
    time: '3天前',
    read: true,
  },
  {
    type: 'activity',
    icon: '👥',
    bgColor: '#FCE4EC',
    title: '邀请好友赢现金',
    desc: '邀请好友注册，双方各得 3 元现金红包，无上限奖励！',
    time: '5天前',
    read: true,
  },
  {
    type: 'result',
    icon: '⚖️',
    bgColor: '#F3E5F5',
    title: '企业尽调报告已生成',
    desc: '您购买的「XX科技有限公司」尽调报告已生成完成，请前往订单查看。',
    time: '1周前',
    read: true,
  },
]);

// 角标计算
tabs.value[0].badge = allMessages.value.filter(m => !m.read).length;
tabs.value[1].badge = allMessages.value.filter(m => m.type === 'system' && !m.read).length;
tabs.value[2].badge = allMessages.value.filter(m => m.type === 'activity' && !m.read).length;
tabs.value[3].badge = allMessages.value.filter(m => m.type === 'result' && !m.read).length;

const displayList = computed(() => {
  if (activeTab.value === 0) return allMessages.value;
  const types = ['all', 'system', 'activity', 'result'];
  return allMessages.value.filter(m => m.type === types[activeTab.value]);
});

function onMsgTap(msg: any) {
  msg.read = true;
  if (msg.type === 'result') {
    uni.navigateTo({ url: '/pages/hcc/history' });
  } else if (msg.type === 'activity') {
    uni.switchTab({ url: '/pages/index/index' });
  }
  // 刷新角标
  tabs.value[0].badge = allMessages.value.filter(m => !m.read).length;
  tabs.value[1].badge = allMessages.value.filter(m => m.type === 'system' && !m.read).length;
  tabs.value[2].badge = allMessages.value.filter(m => m.type === 'activity' && !m.read).length;
  tabs.value[3].badge = allMessages.value.filter(m => m.type === 'result' && !m.read).length;
}

onShow(() => {
  uni.setTabBarBadge && uni.setTabBarBadge({ index: 2, text: String(tabs.value[0].badge || '') });
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
}

/* Tab */
.tabs {
  display: flex;
  background: $bg-card;
  padding: 0 16rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 28rpx 0 24rpx;
  position: relative;
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
  font-size: 28rpx;
  color: $text-secondary;
}

.tab-item.active .tab-text {
  color: $primary;
  font-weight: 600;
}

.tab-badge {
  background: $danger;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.tab-badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: 500;
}

/* 消息列表 */
.msg-list {
  padding: 24rpx;
}

.msg-item {
  display: flex;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  position: relative;
}

.msg-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.msg-icon {
  font-size: 40rpx;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.msg-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.msg-time {
  font-size: 22rpx;
  color: $text-tertiary;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.msg-desc {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.5;
}

.msg-unread {
  position: absolute;
  top: 28rpx;
  right: 28rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $danger;
}

/* 空状态 */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: $text-primary;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: $text-tertiary;
}

.safe-bottom {
  height: 60rpx;
}
</style>
