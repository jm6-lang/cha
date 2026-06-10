<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">🅾️</view>
        <text class="header-title">QQ 查询</text>
        <text class="header-desc">账号信息 · 头像 · 冻结检测</text>
      </view>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="输入 QQ 号" placeholder-class="placeholder" />
        <text class="search-btn" @tap="onSearch">查询</text>
      </view>
    </view>

    <view class="tabs">
      <view class="tab" :class="{ active: mode === 'info' }" @tap="mode = 'info'">账号信息</view>
      <view class="tab" :class="{ active: mode === 'check' }" @tap="mode = 'check'">冻结检测</view>
      <view class="tab" :class="{ active: mode === 'group' }" @tap="mode = 'group'">群查询</view>
    </view>

    <view v-if="mode === 'group'" class="group-hint">
      <text class="gh-icon">💡</text>
      <text class="gh-text">输入 QQ 群号查询群信息</text>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在查询...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <!-- 账号信息结果 -->
    <view v-if="mode === 'info' && info" class="result-card">
      <view class="result-top">
        <image :src="info.avatarUrl" class="avatar" mode="aspectFill" @error="onAvatarError" />
        <view class="top-info">
          <text class="info-nick">{{ info.nickname }}</text>
          <text class="info-meta">QQ: {{ info.uin }} · {{ info.astro || '未知星座' }}</text>
        </view>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">QQ 昵称</text>
          <text class="grid-value">{{ info.nickname }}</text>
        </view>
        <view v-if="info.gender" class="grid-row">
          <text class="grid-label">性别</text>
          <text class="grid-value">{{ info.gender }}</text>
        </view>
        <view v-if="info.astro" class="grid-row">
          <text class="grid-label">星座</text>
          <text class="grid-value">{{ info.astro }}</text>
        </view>
        <view v-if="info.from" class="grid-row">
          <text class="grid-label">所在地</text>
          <text class="grid-value">{{ info.from }}</text>
        </view>
        <view v-if="info.qzone" class="grid-row">
          <text class="grid-label">空间状态</text>
          <text class="grid-value">{{ info.qzone }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">QQ 等级</text>
          <text class="grid-value highlight">{{ info.vip ? 'VIP' + info.vip : '普通用户' }}</text>
        </view>
      </view>
    </view>

    <!-- 冻结检测结果 -->
    <view v-if="mode === 'check' && checkResult" class="result-card">
      <view class="result-top" :class="`status-${checkResult.status}`">
        <view>
          <text class="info-nick">{{ statusName }}</text>
          <text class="info-meta">查询结果码: {{ checkResult.result }}</text>
        </view>
        <text class="result-score">{{ checkResult.status === 'normal' ? '✓' : '!' }}</text>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">账号状态</text>
          <text class="grid-value" :class="`status-${checkResult.status}`">{{ statusName }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">结果码</text>
          <text class="grid-value">{{ checkResult.result }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">提示</text>
          <text class="grid-value">{{ checkResult.msg }}</text>
        </view>
      </view>
    </view>

    <!-- 群查询结果 -->
    <view v-if="mode === 'group' && groupInfo" class="result-card">
      <view class="result-top">
        <view class="top-info">
          <text class="info-nick">{{ groupInfo.groupName }}</text>
          <text class="info-meta">群号: {{ groupInfo.groupId }}</text>
        </view>
      </view>
      <view class="result-grid">
        <view class="grid-row">
          <text class="grid-label">群名称</text>
          <text class="grid-value">{{ groupInfo.groupName }}</text>
        </view>
        <view class="grid-row">
          <text class="grid-label">成员数</text>
          <text class="grid-value highlight">{{ groupInfo.memberCount }} / {{ groupInfo.maxMemberCount }}</text>
        </view>
        <view v-if="groupInfo.ownerUin" class="grid-row">
          <text class="grid-label">群主</text>
          <text class="grid-value">{{ groupInfo.ownerUin }}</text>
        </view>
        <view v-if="groupInfo.createTime" class="grid-row">
          <text class="grid-label">创建时间</text>
          <text class="grid-value">{{ formatTimestamp(groupInfo.createTime) }}</text>
        </view>
        <view v-if="groupInfo.fingerMemo" class="grid-row memo">
          <text class="grid-label">群简介</text>
          <text class="grid-value">{{ groupInfo.fingerMemo }}</text>
        </view>
      </view>
    </view>

    <view v-if="!loading && !error && !info && !checkResult && !groupInfo" class="placeholder-block">
      <text class="ph-icon">🅾️</text>
      <text class="ph-text">输入 QQ 号开始查询</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryQQInfo, queryQQCheck, queryQQGroup, type QQInfo, type QQCheckResult, type QQGroupInfo } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);
const keyword = ref('');
const mode = ref<'info' | 'check' | 'group'>('info');
const loading = ref(false);
const error = ref('');

const info = ref<QQInfo | null>(null);
const checkResult = ref<QQCheckResult | null>(null);
const groupInfo = ref<QQGroupInfo | null>(null);

const STATUS_NAME: Record<string, string> = {
  normal: '账号正常',
  frozen: '账号冻结',
  recovered: '账号已回收',
  limited: '功能受限',
  unknown: '未知状态',
};
const statusName = computed(() => checkResult.value ? STATUS_NAME[checkResult.value.status] : '');

const formatTimestamp = (ts: number) => {
  if (!ts || ts < 1000000000) return '-';
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const onAvatarError = (e: any) => {
  // 头像加载失败时使用默认色块
};

const onSearch = async () => {
  const kw = keyword.value.trim();
  if (!/^\d{5,12}$/.test(kw)) {
    uni.showToast({ title: '请输入正确 QQ 号', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  info.value = null;
  checkResult.value = null;
  groupInfo.value = null;
  try {
    if (mode.value === 'info') {
      const r = await queryQQInfo(kw);
      if (!r) error.value = '未查询到此 QQ 号信息';
      else info.value = r;
    } else if (mode.value === 'check') {
      const r = await queryQQCheck(kw);
      if (!r) error.value = '查询失败，请稍后重试';
      else checkResult.value = r;
    } else {
      const r = await queryQQGroup(kw);
      if (!r) error.value = '未查询到此群号信息';
      else groupInfo.value = r;
    }
  } catch (e) {
    error.value = '查询异常';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.search-bar { margin: 24rpx 24rpx 0; }
.search-input-wrap { background: #fff; border-radius: 50rpx; padding: 8rpx 12rpx 8rpx 30rpx; display: flex; align-items: center; box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08); }
.search-icon { font-size: 28rpx; color: $text-tertiary; margin-right: 12rpx; }
.search-input { flex: 1; height: 70rpx; font-size: 28rpx; }
.placeholder { color: $text-tertiary; }
.search-btn { background: linear-gradient(135deg, #1976D2, #42A5F5); color: #fff; font-size: 26rpx; padding: 16rpx 30rpx; border-radius: 40rpx; }
.tabs { display: flex; margin: 24rpx 24rpx 0; background: #fff; border-radius: 16rpx; padding: 8rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.tab { flex: 1; text-align: center; padding: 18rpx 0; font-size: 28rpx; color: $text-secondary; border-radius: 12rpx; transition: all 0.2s; }
.tab.active { background: linear-gradient(135deg, #1976D2, #42A5F5); color: #fff; font-weight: 600; }
.group-hint { display: flex; align-items: center; padding: 16rpx 30rpx 0; }
.gh-icon { font-size: 24rpx; margin-right: 8rpx; }
.gh-text { font-size: 22rpx; color: $warning; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; background: #FFF3E0; border-radius: 20rpx; padding: 30rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 26rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx 0; background: #fff; border-radius: 20rpx; overflow: hidden; }
.result-top { background: linear-gradient(135deg, #1976D2, #42A5F5); padding: 30rpx; display: flex; align-items: center; }
.result-top.status-frozen { background: linear-gradient(135deg, #FF5252, #FF7676); }
.result-top.status-recovered { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.result-top.status-limited { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; background: #fff; margin-right: 24rpx; }
.top-info { flex: 1; }
.info-nick { font-size: 34rpx; color: #fff; font-weight: 700; display: block; }
.info-meta { font-size: 24rpx; color: rgba(255,255,255,0.9); display: block; margin-top: 8rpx; }
.result-score { font-size: 60rpx; color: #fff; font-weight: 700; }
.result-grid { padding: 10rpx 30rpx; }
.grid-row { display: flex; justify-content: space-between; padding: 24rpx 0; border-bottom: 1rpx solid $border-color; gap: 20rpx; }
.grid-row:last-child { border-bottom: none; }
.grid-row.memo { flex-direction: column; gap: 8rpx; }
.grid-label { font-size: 26rpx; color: $text-secondary; flex-shrink: 0; }
.grid-value { font-size: 26rpx; color: $text-primary; font-weight: 500; text-align: right; }
.grid-value.highlight { color: $warning; font-weight: 700; }
.grid-value.status-normal { color: $primary; font-weight: 700; }
.grid-value.status-frozen { color: #FF5252; font-weight: 700; }
.grid-value.status-recovered { color: #FF9800; font-weight: 700; }
.placeholder-block { padding: 120rpx 0; display: flex; flex-direction: column; align-items: center; }
.ph-icon { font-size: 100rpx; opacity: 0.4; }
.ph-text { font-size: 26rpx; color: $text-tertiary; margin-top: 20rpx; }
</style>
