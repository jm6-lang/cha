<template>
  <view class="page">
    <!-- 顶部操作区 -->
    <view class="action-bar">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="action-title">分享给好友</text>
      <view class="save-btn" @tap="savePoster">
        <text class="save-text">保存图片</text>
      </view>
    </view>

    <!-- 海报预览 -->
    <view class="poster-wrap">
      <view class="poster" id="poster">
        <view class="poster-bg" />
        <view class="poster-content">
          <!-- 顶部品牌区 -->
          <view class="poster-header">
            <view class="poster-logo">数</view>
            <view class="poster-brand">
              <text class="poster-name">数查 ShuCha</text>
              <text class="poster-slogan">查号码 · 查企业 · 查关系</text>
            </view>
          </view>

          <!-- 中部展示区 -->
          <view class="poster-feature">
            <view v-if="shareType === 'phone'" class="feature-phone">
              <text class="feature-icon">📱</text>
              <text class="feature-title">号码标记免费查</text>
              <text class="feature-desc">10万+ 标记数据  精准识别骚扰电话</text>
            </view>
            <view v-else-if="shareType === 'company'" class="feature-company">
              <text class="feature-icon">🏢</text>
              <text class="feature-title">企业信息一键查</text>
              <text class="feature-desc">工商信息 法人代表 风险扫描</text>
            </view>
            <view v-else class="feature-default">
              <text class="feature-icon">🔍</text>
              <text class="feature-title">专业信息查询工具</text>
              <text class="feature-desc">8大分类 90+ 服务  免费体验</text>
            </view>
          </view>

          <!-- 亮点列表 -->
          <view class="poster-highlights">
            <view class="highlight-item">
              <text class="highlight-dot">✓</text>
              <text class="highlight-text">号码标记 免费查询</text>
            </view>
            <view class="highlight-item">
              <text class="highlight-dot">✓</text>
              <text class="highlight-text">企业工商 全面信息</text>
            </view>
            <view class="highlight-item">
              <text class="highlight-dot">✓</text>
              <text class="highlight-text">专业报告 深度分析</text>
            </view>
            <view class="highlight-item">
              <text class="highlight-dot">✓</text>
              <text class="highlight-text">隐私安全 严格保护</text>
            </view>
          </view>

          <!-- 优惠信息 -->
          <view class="poster-promo">
            <text class="promo-text">新用户专享 · 首次充值满10元送5元</text>
          </view>

          <!-- 二维码区 -->
          <view class="poster-footer">
            <view class="qrcode">
              <view class="qrcode-mock">
                <view class="qr-row" v-for="(r, i) in 7" :key="i">
                  <view
                    v-for="(c, j) in 7"
                    :key="j"
                    class="qr-cell"
                    :class="{ black: qrPattern[i][j] }"
                  />
                </view>
              </view>
            </view>
            <view class="footer-info">
              <text class="footer-title">扫码立即体验</text>
              <text class="footer-desc">长按识别二维码</text>
              <text class="footer-desc">下载数查 App</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分享方式 -->
    <view class="share-section">
      <text class="share-title">选择分享方式</text>
      <view class="share-grid">
        <view class="share-item" @tap="onShareApp">
          <view class="share-icon-wrap wechat">
            <text class="share-icon-letter">💬</text>
          </view>
          <text class="share-name">微信好友</text>
        </view>
        <view class="share-item" @tap="onShareMoments">
          <view class="share-icon-wrap moments">
            <text class="share-icon-letter">🌐</text>
          </view>
          <text class="share-name">朋友圈</text>
        </view>
        <view class="share-item" @tap="onCopyLink">
          <view class="share-icon-wrap link">
            <text class="share-icon-letter">🔗</text>
          </view>
          <text class="share-name">复制链接</text>
        </view>
        <view class="share-item" @tap="onSaveImage">
          <view class="share-icon-wrap image">
            <text class="share-icon-letter">🖼️</text>
          </view>
          <text class="share-name">保存图片</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const shareType = ref('default');

// 简单二维码样式 (mock)
const qrPattern = ref([
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]);

onLoad((q: any) => {
  shareType.value = q?.type || 'default';
});

function goBack() {
  uni.navigateBack();
}

function onShareApp() {
  uni.showToast({ title: '请使用右上角菜单分享', icon: 'none' });
}

function onShareMoments() {
  uni.showToast({ title: '请使用右上角菜单分享', icon: 'none' });
}

function onCopyLink() {
  uni.setClipboardData({
    data: 'https://shucha.com',
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' }),
  });
}

function onSaveImage() {
  savePoster();
}

function savePoster() {
  uni.showToast({ title: '图片已保存到相册', icon: 'success' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 60rpx;
}

/* 顶部操作栏 */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 24rpx 16rpx;
  background: $bg-card;
  border-bottom: 1rpx solid $border;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 48rpx;
  color: $text-primary;
  font-weight: 300;
}

.action-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-primary;
}

.save-btn {
  padding: 12rpx 24rpx;
  background: $primary;
  border-radius: 999rpx;
}

.save-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

/* 海报 */
.poster-wrap {
  padding: 32rpx 24rpx;
}

.poster {
  position: relative;
  width: 100%;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.poster-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, $primary 0%, $primary-dark 50%, #047857 100%);
}

.poster-content {
  position: relative;
  padding: 40rpx 32rpx;
}

.poster-header {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.poster-logo {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 44rpx;
  font-weight: 700;
  margin-right: 20rpx;
}

.poster-brand {
  display: flex;
  flex-direction: column;
}

.poster-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4rpx;
}

.poster-slogan {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
}

.poster-feature {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 40rpx 28rpx;
  text-align: center;
  margin-bottom: 24rpx;
}

.feature-icon {
  display: block;
  font-size: 72rpx;
  margin-bottom: 16rpx;
}

.feature-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8rpx;
}

.feature-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.poster-highlights {
  background: rgba(255, 255, 255, 0.95);
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
  margin-bottom: 24rpx;
}

.highlight-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
}

.highlight-dot {
  width: 36rpx;
  height: 36rpx;
  background: $primary;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.highlight-text {
  font-size: 28rpx;
  color: $text-primary;
}

.poster-promo {
  background: #FFD700;
  border-radius: $radius-md;
  padding: 16rpx 24rpx;
  text-align: center;
  margin-bottom: 24rpx;
}

.promo-text {
  font-size: 26rpx;
  color: #8B4513;
  font-weight: 600;
}

.poster-footer {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $radius-lg;
  padding: 24rpx;
}

.qrcode {
  width: 160rpx;
  height: 160rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.qrcode-mock {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.qr-row {
  flex: 1;
  display: flex;
}

.qr-cell {
  flex: 1;
  background: #fff;
}

.qr-cell.black {
  background: #000;
}

.footer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-title {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.footer-desc {
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.6;
}

/* 分享方式 */
.share-section {
  background: $bg-card;
  border-radius: $radius-lg;
  margin: 24rpx;
  padding: 28rpx 24rpx;
}

.share-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 24rpx;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.share-icon-wrap.wechat {
  background: #E8F8EF;
}

.share-icon-wrap.moments {
  background: #FFF0E8;
}

.share-icon-wrap.link {
  background: #E3F2FD;
}

.share-icon-wrap.image {
  background: #F3E5F5;
}

.share-icon-letter {
  font-size: 48rpx;
}

.share-name {
  font-size: 24rpx;
  color: $text-secondary;
}
</style>
