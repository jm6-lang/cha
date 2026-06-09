<template>
  <view class="number-input">
    <input
      v-model="value"
      :maxlength="13"
      type="number"
      class="input"
      placeholder="输入手机号/固话/400/95"
      placeholder-class="placeholder"
      @input="onInput"
    />
    <view v-if="value" class="clear" @tap="clear">×</view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const value = ref(props.modelValue || '');

watch(() => props.modelValue, (v) => (value.value = v));
watch(value, (v) => emit('update:modelValue', v));

function onInput(e: any) {
  value.value = e.detail.value.replace(/\s/g, '');
}

function clear() {
  value.value = '';
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.number-input {
  position: relative;
  display: flex;
  align-items: center;
  background: $bg-page;
  border-radius: $radius-md;
  padding: 0 24rpx;
  height: 96rpx;
}

.input {
  flex: 1;
  height: 96rpx;
  font-size: 32rpx;
  color: $text-primary;
}

.placeholder {
  color: $text-tertiary;
}

.clear {
  width: 40rpx;
  height: 40rpx;
  line-height: 36rpx;
  text-align: center;
  color: #fff;
  background: $text-tertiary;
  border-radius: 50%;
  font-size: 32rpx;
}
</style>
