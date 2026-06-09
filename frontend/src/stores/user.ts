import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false);
  const userId = ref<number | null>(null);
  const nickname = ref('访客用户');
  const avatar = ref('');

  function mockLogin() {
    isLoggedIn.value = true;
    userId.value = 10001;
    nickname.value = '演示用户';
  }

  function logout() {
    isLoggedIn.value = false;
    userId.value = null;
    nickname.value = '访客用户';
  }

  return { isLoggedIn, userId, nickname, avatar, mockLogin, logout };
});
