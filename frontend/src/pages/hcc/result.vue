<template>
  <view class="container">
    <view v-if="loading" class="loading">查询中...</view>
    <view v-else-if="data" class="result">
      <view class="number-display card">
        <text class="label">查询号码</text>
        <text class="number">{{ data.number }}</text>
      </view>
      <ResultPanel :data="data" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import ResultPanel from '@/components/ResultPanel.vue';
import { shuchaApi, type NumberLabel } from '@/api/shucha';

const number = ref('');
const data = ref<NumberLabel | null>(null);
const loading = ref(true);

onLoad((q: any) => {
  number.value = q?.number || '';
  doQuery();
});

async function doQuery() {
  loading.value = true;
  try {
    const res = await shuchaApi.queryNumber(number.value, true);
    data.value = res.data;
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.loading {
  text-align: center;
  padding: 96rpx 0;
  color: $text-tertiary;
}

.number-display {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
  text-align: center;
}

.number-display .label {
  font-size: 24rpx;
  color: $text-tertiary;
  margin-bottom: 8rpx;
}

.number-display .number {
  font-size: 48rpx;
  font-weight: 600;
  color: $primary;
  letter-spacing: 2rpx;
}
</style>
