import { defineStore } from 'pinia';
import { ref } from 'vue';
import { shuchaApi, type QueryHistory } from '@/api/shucha';

export const useHistoryStore = defineStore('history', () => {
  const list = ref<QueryHistory[]>([]);
  const loading = ref(false);

  async function refresh() {
    loading.value = true;
    try {
      const res = await shuchaApi.listHistory(20, true);
      list.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  return { list, loading, refresh };
});
