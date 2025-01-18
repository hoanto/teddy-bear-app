<script setup lang="ts">
import { useCategory } from "@/composables/useCategory";
import Category from "./Category.vue";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "@/stores/category";

const { getCategoryList } = useCategory();

const { categoryList } = storeToRefs(useCategoryStore());

onMounted(() => {
  getCategoryList();
});
</script>

<template>
  <div class="category-list">
    <Category v-for="item in categoryList" :key="item.id" :category="item" />
  </div>
</template>

<style lang="scss" scoped>
.category-list {
  width: 70%;
  margin-top: 100px;
  min-height: 200px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}
</style>
