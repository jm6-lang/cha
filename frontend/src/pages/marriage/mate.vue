<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">💑</view>
        <text class="header-title">伴侣匹配</text>
        <text class="header-desc">血型 · 生肖 · 星座 配对</text>
      </view>
    </view>

    <view class="tab-bar">
      <view v-for="t in TABS" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @tap="onSwitchTab(t.key)">
        <text class="tab-emoji">{{ t.emoji }}</text>
        <text class="tab-text">{{ t.name }}</text>
      </view>
    </view>

    <view class="picker-row">
      <view class="picker-cell">
        <text class="picker-label">{{ activeTab === 'blood' ? 'TA 的血型' : activeTab === 'zodiac' ? 'TA 的生肖' : 'TA 的星座' }}</text>
        <picker mode="selector" :range="optionList" :value="idx2" @change="(e: any) => idx2 = e.detail.value">
          <view class="picker-value">{{ optionList[idx2] || '请选择' }}</view>
        </picker>
      </view>
      <view class="picker-heart">💕</view>
      <view class="picker-cell">
        <text class="picker-label">{{ activeTab === 'blood' ? '您的血型' : activeTab === 'zodiac' ? '您的生肖' : '您的星座' }}</text>
        <picker mode="selector" :range="optionList" :value="idx1" @change="(e: any) => idx1 = e.detail.value">
          <view class="picker-value">{{ optionList[idx1] || '请选择' }}</view>
        </picker>
      </view>
    </view>

    <view class="action-row">
      <text class="submit-btn" @tap="onMatch">✨ 立即配对</text>
    </view>

    <view v-if="loading" class="loading-card">
      <text class="loading-text">🔄 正在配对...</text>
    </view>

    <view v-if="error" class="error-card">
      <text class="error-icon">⚠️</text>
      <text class="error-text">{{ error }}</text>
    </view>

    <view v-if="result" class="result-card">
      <view class="r-head">
        <text class="r-title">{{ optionList[idx2] }} ⨯ {{ optionList[idx1] }} 配对</text>
      </view>
      <view class="r-score">
        <text class="score-num">{{ result.score }}</text>
        <text class="score-unit">分</text>
      </view>
      <view class="r-bar">
        <view class="r-bar-inner" :style="{ width: Math.min(100, parseInt(result.score) || 80) + '%' }" />
      </view>
      <view class="r-content">
        <text class="content-label">📜 配对分析</text>
        <text class="content-text">{{ result.content }}</text>
      </view>
      <view class="r-tip">
        <text class="tip-text">💡 提示：在「我的」→「API 配置」中填入天行数据 Key 可使用真实数据，否则展示示例结果。</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { queryBloodMatch, queryZodiacMatch, queryStarMatch, getTianapiKey } from '@/api/free-apis';

const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 44);

type Tab = 'blood' | 'zodiac' | 'star';
const TABS: { key: Tab; name: string; emoji: string; options: string[] }[] = [
  { key: 'blood', name: '血型', emoji: '🩸', options: ['A型', 'B型', 'AB型', 'O型'] },
  { key: 'zodiac', name: '生肖', emoji: '🐭', options: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] },
  { key: 'star', name: '星座', emoji: '⭐', options: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'] },
];

const activeTab = ref<Tab>('blood');
const idx1 = ref(0);
const idx2 = ref(0);
const loading = ref(false);
const error = ref('');
const result = ref<{ score: string; content: string } | null>(null);

const optionList = computed(() => TABS.find(t => t.key === activeTab.value)!.options);

const onSwitchTab = (k: Tab) => {
  activeTab.value = k;
  idx1.value = 0;
  idx2.value = 0;
  result.value = null;
  error.value = '';
};

const onMatch = async () => {
  const a = optionList.value[idx1.value];
  const b = optionList.value[idx2.value];
  if (!a || !b) {
    uni.showToast({ title: '请完整选择', icon: 'none' });
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    let r: { score: string; content: string } | null = null;
    if (activeTab.value === 'blood') {
      const t1 = a.replace('型', '');
      const t2 = b.replace('型', '');
      r = await queryBloodMatch(t1, t2);
    } else if (activeTab.value === 'zodiac') {
      r = await queryZodiacMatch(a, b);
    } else {
      r = await queryStarMatch(a, b);
    }
    if (!r) {
      // 兜底示例数据
      r = mockMatch(a, b);
      if (!getTianapiKey()) error.value = '未配置天行 API Key，已展示示例数据';
    }
    result.value = r;
  } catch (e) {
    error.value = '配对失败，请重试';
  } finally {
    loading.value = false;
  }
};

const mockMatch = (a: string, b: string) => {
  const seed = (a.charCodeAt(0) + b.charCodeAt(0)) % 30;
  return {
    score: String(70 + seed),
    content: `${a} 与 ${b} 性格互补/相似，${activeTab.value === 'blood' ? '血型契合' : activeTab.value === 'zodiac' ? '生肖相合' : '星座相吸'}，相处中既有共鸣也有惊喜。`,
  };
};
</script>

<style lang="scss" scoped>
@import '@/static/styles/variables.scss';
.page { min-height: 100vh; background: $bg-page; padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #E91E63, #F06292); padding: 30rpx 40rpx 60rpx; }
.header-content { display: flex; flex-direction: column; align-items: center; }
.header-icon { font-size: 80rpx; margin-bottom: 16rpx; }
.header-title { font-size: 40rpx; font-weight: 700; color: #fff; }
.header-desc { font-size: 24rpx; color: rgba(255,255,255,0.85); margin-top: 8rpx; }
.tab-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; margin: 24rpx; }
.tab { background: #fff; padding: 24rpx 0; text-align: center; border-radius: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.tab.active { background: linear-gradient(135deg, #E91E63, #F06292); }
.tab-emoji { display: block; font-size: 40rpx; }
.tab-text { display: block; font-size: 24rpx; color: $text-secondary; margin-top: 6rpx; }
.tab.active .tab-text { color: #fff; font-weight: 600; }
.picker-row { display: flex; align-items: center; margin: 30rpx 24rpx 0; }
.picker-cell { flex: 1; background: #fff; border-radius: 16rpx; padding: 24rpx 20rpx; }
.picker-label { font-size: 24rpx; color: $text-tertiary; display: block; }
.picker-value { font-size: 32rpx; color: $text-primary; font-weight: 600; margin-top: 12rpx; }
.picker-heart { font-size: 50rpx; margin: 0 16rpx; }
.action-row { padding: 30rpx 24rpx 0; }
.submit-btn { display: block; background: linear-gradient(135deg, #E91E63, #F06292); color: #fff; font-size: 30rpx; text-align: center; padding: 24rpx 0; border-radius: 40rpx; font-weight: 600; }
.loading-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; padding: 60rpx 30rpx; text-align: center; }
.loading-text { font-size: 28rpx; color: $text-secondary; }
.error-card { margin: 30rpx 24rpx; padding: 30rpx; background: #FFF3E0; border-radius: 20rpx; display: flex; align-items: center; }
.error-icon { font-size: 36rpx; margin-right: 16rpx; }
.error-text { font-size: 24rpx; color: $warning; flex: 1; }
.result-card { margin: 30rpx 24rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.r-head { padding: 30rpx; background: linear-gradient(135deg, #FFE4EC, #FFF0F5); }
.r-title { font-size: 30rpx; color: $text-primary; font-weight: 700; }
.r-score { text-align: center; padding: 40rpx 0 20rpx; }
.score-num { font-size: 90rpx; color: #E91E63; font-weight: 700; }
.score-unit { font-size: 28rpx; color: $text-secondary; margin-left: 8rpx; }
.r-bar { height: 16rpx; background: #FFE4EC; margin: 0 30rpx; border-radius: 8rpx; overflow: hidden; }
.r-bar-inner { height: 100%; background: linear-gradient(90deg, #E91E63, #F06292); border-radius: 8rpx; transition: width 0.6s; }
.r-content { padding: 30rpx; }
.content-label { font-size: 28rpx; color: $text-primary; font-weight: 600; display: block; margin-bottom: 12rpx; }
.content-text { font-size: 26rpx; color: $text-secondary; line-height: 1.8; display: block; }
.r-tip { padding: 0 30rpx 30rpx; }
.tip-text { font-size: 22rpx; color: $text-tertiary; line-height: 1.6; }
</style>
