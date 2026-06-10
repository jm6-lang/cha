<template>
  <view class="container">
    <!-- 聊天消息列表 -->
    <scroll-view
      class="chat-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <!-- 时间分割 -->
      <view class="time-divider">
        <text class="time-text">{{ currentTime }}</text>
      </view>

      <!-- 消息列表 -->
      <view
        v-for="(msg, i) in messages"
        :key="i"
        class="msg-wrap"
        :class="msg.isSelf ? 'msg-self' : 'msg-other'"
      >
        <!-- 头像 -->
        <view class="avatar" :class="msg.isSelf ? 'avatar-self' : 'avatar-other'">
          <text class="avatar-text">{{ msg.isSelf ? '我' : '客' }}</text>
        </view>
        <!-- 消息气泡 -->
        <view class="bubble" :class="msg.isSelf ? 'bubble-self' : 'bubble-other'">
          <text class="bubble-text" :class="msg.isSelf ? 'text-self' : 'text-other'">{{ msg.content }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区 -->
    <view class="input-area">
      <input
        v-model="inputText"
        class="chat-input"
        placeholder="请输入您的问题..."
        placeholder-class="input-placeholder"
        confirm-type="send"
        @confirm="onSend"
      />
      <view class="send-btn" :class="{ active: inputText.trim() }" @tap="onSend">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface Message {
  isSelf: boolean;
  content: string;
}

const inputText = ref('');
const scrollTop = ref(0);

const currentTime = ref(formatTime(new Date()));

function formatTime(d: Date) {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// 预设客服消息
const messages = ref<Message[]>([
  { isSelf: false, content: '您好！欢迎来到数查在线客服，请问有什么可以帮您？' },
  { isSelf: false, content: '您可以咨询以下问题：\n1. 查询服务使用方法\n2. 订单与支付问题\n3. 账号相关问题\n4. 投诉与建议' },
]);

// 自动回复关键词映射
const autoReplies: Array<{ keywords: string[]; reply: string }> = [
  { keywords: ['你好', '您好', 'hi', 'hello'], reply: '您好！请问有什么可以帮您的？' },
  { keywords: ['查询', '怎么查', '如何查', '使用方法'], reply: '您可以在首页搜索框输入手机号码或公司名称进行查询，也可以点击功能分类进入对应服务页面进行查询。' },
  { keywords: ['价格', '多少钱', '收费', '费用'], reply: '不同查询服务价格不同，基础查询免费，深度查询从3元到299元不等。具体价格请在对应服务页面查看。' },
  { keywords: ['支付', '付款', '充值'], reply: '目前支持微信支付和支付宝支付。您可以在"我的-钱包"中进行充值，也可以在查询时直接支付。' },
  { keywords: ['订单', '记录', '历史'], reply: '您可以在"我的订单"页面查看所有查询记录和订单详情。' },
  { keywords: ['退款', '退钱'], reply: '如需退款，请在订单详情页申请退款，我们会在1-3个工作日内处理。退款将原路返回。' },
  { keywords: ['投诉', '建议', '反馈'], reply: '非常感谢您的反馈！您可以在"设置-意见反馈"中提交您的建议，我们会认真对待每一条反馈。' },
  { keywords: ['清除标记', '标记'], reply: '清除标记服务可以帮助您消除号码上的错误标记。请进入"号码服务-清除标记"页面，输入需要清除的号码即可。' },
  { keywords: ['婚姻', '结婚', '离婚'], reply: '婚姻相关查询服务包括婚姻状态查询、婚恋交友核验等，请进入"婚姻情感"分类查看详细服务。' },
  { keywords: ['企业', '公司', '工商'], reply: '企业查询服务包括工商信息、关联关系、风险扫描等，您可以在首页搜索框输入公司名称，或进入"企业查询"分类查看。' },
];

function onSend() {
  const text = inputText.value.trim();
  if (!text) return;

  // 添加用户消息
  messages.value.push({ isSelf: true, content: text });
  inputText.value = '';

  scrollToBottom();

  // 模拟客服回复延迟
  setTimeout(() => {
    const reply = getAutoReply(text);
    messages.value.push({ isSelf: false, content: reply });
    scrollToBottom();
  }, 800);
}

function getAutoReply(text: string): string {
  const lowerText = text.toLowerCase();
  for (const item of autoReplies) {
    if (item.keywords.some(kw => lowerText.includes(kw))) {
      return item.reply;
    }
  }
  return '感谢您的咨询！您的问题已记录，我们的客服人员会尽快为您处理。如需紧急帮助，请拨打客服热线 400-888-8888。';
}

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = scrollTop.value + 9999;
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg-page;
}

/* 聊天消息列表 */
.chat-list {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
}

/* 时间分割 */
.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24rpx 0;
}

.time-text {
  font-size: 22rpx;
  color: $text-tertiary;
  background: rgba(0, 0, 0, 0.05);
  padding: 4rpx 20rpx;
  border-radius: 999rpx;
}

/* 消息项 */
.msg-wrap {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.msg-self {
  flex-direction: row-reverse;
}

/* 头像 */
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-other {
  background: $primary;
}

.avatar-self {
  background: $info;
}

.avatar-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
}

/* 气泡 */
.bubble {
  max-width: 70%;
  padding: 20rpx 28rpx;
  border-radius: $radius-lg;
  margin: 0 16rpx;
  word-break: break-all;
}

.bubble-other {
  background: $bg-card;
  border-top-left-radius: 4rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.bubble-self {
  background: $primary;
  border-top-right-radius: 4rpx;
}

.text-other {
  font-size: 28rpx;
  color: $text-primary;
  line-height: 1.6;
}

.text-self {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
}

/* 底部输入区 */
.input-area {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: $bg-card;
  border-top: 1rpx solid $border;
  gap: 16rpx;
}

.chat-input {
  flex: 1;
  height: 72rpx;
  background: $bg-page;
  border-radius: 999rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: $text-primary;
}

.input-placeholder {
  color: $text-placeholder;
  font-size: 26rpx;
}

.send-btn {
  background: $bg-grey;
  border-radius: 999rpx;
  padding: 0 32rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.send-btn.active {
  background: $primary;
}

.send-text {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-tertiary;
}

.send-btn.active .send-text {
  color: #fff;
}
</style>
