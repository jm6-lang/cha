<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('[ShuCha] App Launch');
});
onShow(() => {
  console.log('[ShuCha] App Show');
});
onHide(() => {
  console.log('[ShuCha] App Hide');
});
</script>

<style lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/global.scss';
</style>
