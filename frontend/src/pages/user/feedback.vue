<template>
  <view class="page">
    <!-- 反馈类型 -->
    <view class="section">
      <text class="section-title">反馈类型</text>
      <view class="type-list">
        <view
          v-for="(t, i) in typeList"
          :key="i"
          class="type-item"
          :class="{ active: selectedType === i }"
          @tap="selectedType = i"
        >
          <text class="type-text" :class="{ 'type-text-active': selectedType === i }">{{ t }}</text>
        </view>
      </view>
    </view>

    <!-- 反馈内容 -->
    <view class="section">
      <text class="section-title">反馈内容</text>
      <textarea
        class="content-input"
        placeholder="请详细描述您的问题或建议..."
        placeholder-class="placeholder"
        :maxlength="500"
        v-model="content"
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- 图片上传 -->
    <view class="section">
      <text class="section-title">上传图片（最多3张）</text>
      <view class="image-list">
        <view v-for="(img, i) in imageList" :key="i" class="image-item">
          <view class="image-placeholder">
            <text class="image-icon">🖼️</text>
          </view>
        </view>
        <view v-if="imageList.length < 3" class="image-add" @tap="addImage">
          <text class="add-icon">+</text>
          <text class="add-text">添加图片</text>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="section">
      <text class="section-title">联系方式</text>
      <input
        class="contact-input"
        placeholder="请输入手机号或邮箱"
        placeholder-class="placeholder"
        v-model="contact"
      />
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="btn-submit" @tap="onSubmit">提交反馈</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const typeList = ['功能建议', 'Bug反馈', '投诉', '其他'];
const selectedType = ref(0);
const content = ref('');
const imageList = ref<number[]>([]);
const contact = ref('');

function addImage() {
  if (imageList.value.length < 3) {
    imageList.value.push(imageList.value.length);
  }
}

function onSubmit() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' });
    return;
  }
  uni.showToast({ title: '提交成功，感谢您的反馈', icon: 'success' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 通用section */
.section {
  margin: 24rpx;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 28rpx 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20rpx;
}

/* 反馈类型 */
.type-list {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.type-item {
  padding: 14rpx 32rpx;
  border: 2rpx solid $border;
  border-radius: 999rpx;
  background: $bg-card;
  transition: all 0.2s;
}

.type-item.active {
  border-color: $primary;
  background: $primary-light;
}

.type-text {
  font-size: 26rpx;
  color: $text-secondary;
}

.type-text-active {
  color: $primary;
  font-weight: 500;
}

/* 反馈内容 */
.content-input {
  width: 100%;
  height: 240rpx;
  font-size: 28rpx;
  color: $text-primary;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 20rpx;
  box-sizing: border-box;
}

.placeholder {
  color: $text-tertiary;
}

.char-count {
  font-size: 22rpx;
  color: $text-tertiary;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

/* 图片上传 */
.image-list {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.image-item {
  width: 180rpx;
  height: 180rpx;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-grey;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  font-size: 48rpx;
}

.image-add {
  width: 180rpx;
  height: 180rpx;
  border: 2rpx dashed $border;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-grey;
}

.add-icon {
  font-size: 48rpx;
  color: $text-tertiary;
  line-height: 1;
}

.add-text {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 8rpx;
}

/* 联系方式 */
.contact-input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  color: $text-primary;
  background: $bg-grey;
  border-radius: $radius-md;
  padding: 0 20rpx;
  box-sizing: border-box;
}

/* 提交按钮 */
.submit-section {
  padding: 24rpx;
}

.btn-submit {
  background: $primary;
  color: #fff;
  border-radius: 999rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
}

.btn-submit:active {
  opacity: 0.85;
}
</style>
