<template>
  <view class="page">
    <!-- 账号信息 -->
    <view class="card">
      <text class="card-title">账号信息</text>
      <view class="info-row">
        <text class="info-label">手机号</text>
        <text class="info-value">138****8888</text>
      </view>
      <view class="info-row">
        <text class="info-label">UID</text>
        <text class="info-value">10001</text>
      </view>
      <view class="info-row">
        <text class="info-label">注册时间</text>
        <text class="info-value">2024-12-01</text>
      </view>
      <view class="info-row">
        <text class="info-label">最后登录</text>
        <text class="info-value">刚刚</text>
      </view>
    </view>

    <!-- 账号安全 -->
    <view class="card">
      <text class="card-title">账号安全</text>
      <view class="action-row">
        <view class="action-info">
          <text class="action-name">登录密码</text>
          <text class="action-desc">未设置（推荐设置以保障账号安全）</text>
        </view>
        <text class="action-link" @tap="onSet">设置</text>
      </view>
      <view class="action-row">
        <view class="action-info">
          <text class="action-name">手机号绑定</text>
          <text class="action-desc">已绑定 138****8888</text>
        </view>
        <text class="action-link" @tap="onChange">修改</text>
      </view>
      <view class="action-row">
        <view class="action-info">
          <text class="action-name">登录设备管理</text>
          <text class="action-desc">当前 1 台设备</text>
        </view>
        <text class="action-link" @tap="onManage">管理</text>
      </view>
      <view class="action-row">
        <view class="action-info">
          <text class="action-name">注销账号</text>
          <text class="action-desc">注销后账号无法恢复</text>
        </view>
        <text class="action-link danger" @tap="onDelete">注销</text>
      </view>
    </view>

    <!-- 隐私设置 -->
    <view class="card">
      <text class="card-title">隐私设置</text>
      <view class="setting-row">
        <view class="setting-info">
          <text class="setting-name">个性化推荐</text>
          <text class="setting-desc">根据查询记录推荐相关服务</text>
        </view>
        <switch :checked="personalized" @change="personalized = !personalized" color="#07C160" />
      </view>
      <view class="setting-row">
        <view class="setting-info">
          <text class="setting-name">活动通知推送</text>
          <text class="setting-desc">接收优惠活动与服务更新</text>
        </view>
        <switch :checked="activityPush" @change="activityPush = !activityPush" color="#07C160" />
      </view>
      <view class="setting-row">
        <view class="setting-info">
          <text class="setting-name">查询历史保存</text>
          <text class="setting-desc">保存查询记录便于回看</text>
        </view>
        <switch :checked="historySave" @change="historySave = !historySave" color="#07C160" />
      </view>
      <view class="setting-row">
        <view class="setting-info">
          <text class="setting-name">公开查询主页</text>
          <text class="setting-desc">好友可查看你的查询主页</text>
        </view>
        <switch :checked="publicProfile" @change="publicProfile = !publicProfile" color="#07C160" />
      </view>
    </view>

    <!-- 数据管理 -->
    <view class="card">
      <text class="card-title">数据管理</text>
      <view class="action-row" @tap="onExportData">
        <view class="action-info">
          <text class="action-name">导出我的数据</text>
          <text class="action-desc">下载账号信息与查询历史</text>
        </view>
        <text class="action-link">导出</text>
      </view>
      <view class="action-row" @tap="onClearHistory">
        <view class="action-info">
          <text class="action-name">清除查询历史</text>
          <text class="action-desc">删除所有查询记录</text>
        </view>
        <text class="action-link">清除</text>
      </view>
    </view>

    <!-- 法律协议 -->
    <view class="card">
      <text class="card-title">法律协议</text>
      <view class="action-row" @tap="goUserAgreement">
        <view class="action-info">
          <text class="action-name">用户协议</text>
        </view>
        <text class="action-link">查看</text>
      </view>
      <view class="action-row" @tap="goPrivacyPolicy">
        <view class="action-info">
          <text class="action-name">隐私政策</text>
        </view>
        <text class="action-link">查看</text>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const personalized = ref(true);
const activityPush = ref(true);
const historySave = ref(true);
const publicProfile = ref(false);

function onSet() {
  uni.showToast({ title: '设置密码功能开发中', icon: 'none' });
}

function onChange() {
  uni.showToast({ title: '换绑手机号功能开发中', icon: 'none' });
}

function onManage() {
  uni.showModal({
    title: '设备管理',
    content: '当前在线设备：\n• iPhone (本机)\n\n如非本人操作，请立即修改密码。',
    showCancel: false,
  });
}

function onDelete() {
  uni.showModal({
    title: '注销账号',
    content: '注销后所有数据将清除且无法恢复，确定要继续吗？',
    confirmText: '确认注销',
    confirmColor: '#FF3B30',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '注销申请已提交', icon: 'none' });
      }
    },
  });
}

function onExportData() {
  uni.showToast({ title: '数据导出包已发送至您手机', icon: 'success' });
}

function onClearHistory() {
  uni.showModal({
    title: '清除历史',
    content: '确定要清除所有查询历史吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('shucha_history');
        uni.showToast({ title: '已清除', icon: 'success' });
      }
    },
  });
}

function goUserAgreement() {
  uni.navigateTo({ url: '/pages/agreement/user' });
}

function goPrivacyPolicy() {
  uni.navigateTo({ url: '/pages/agreement/privacy' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding: 24rpx;
}

.card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.card-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $primary;
  line-height: 1;
}

.info-row,
.action-row,
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.info-row:last-child,
.action-row:last-child,
.setting-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: $text-tertiary;
}

.info-value {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

.action-info,
.setting-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.action-name,
.setting-name {
  font-size: 28rpx;
  color: $text-primary;
}

.action-desc,
.setting-desc {
  font-size: 22rpx;
  color: $text-tertiary;
}

.action-link {
  font-size: 26rpx;
  color: $primary;
  font-weight: 500;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.action-link.danger {
  color: $danger;
}

.safe-bottom {
  height: 40rpx;
}
</style>
