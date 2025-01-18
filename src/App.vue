<script setup lang="ts">
import { RouterView } from "vue-router";
import Overlay from "./components/Overlay.vue";
import { useAppStore } from "./stores/app";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useOrder } from "./composables/useOrder";

const appStore = useAppStore();
const { getOrders } = useOrder()

const { isShowOverlay } = storeToRefs(appStore);

onMounted(() => {
  getOrders()
});
</script>

<template>
  <RouterView />
  <Overlay v-if="isShowOverlay" />
</template>

<style scoped lang="scss">
.app-container {
  display: flex;

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100vh;
    overflow-y: auto;
  }
}

.web-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
