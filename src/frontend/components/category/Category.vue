<script setup lang="ts">
import type { TCategory, TProduct } from "@/common/type";
import ProductList from "../product/ProductList.vue";

const props = defineProps<{
  category: TCategory;
}>();
</script>

<template>
  <div style="text-decoration: none;" class="category-container">
    <span
      style="margin-top: 60px; font-weight: 500; color: #333;border-bottom: 3px solid #fd6282; width: 100%; text-align: center; padding-bottom: 10px">{{
        props.category.name
      }}&nbsp;({{ props.category.products?.length }}) </span>
    <ProductList :productList="category.products" />
  </div>
</template>

<style lang="scss" scoped>
.category-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  cursor: pointer;

  .category-img {
    display: flex;
    width: 120px;
    height: 120px;
    justify-content: center;
    align-items: center;
    background-color: #ecf0ff;
    position: absolute;
    top: -50%;
    transform: translateY(50%);

    img {
      width: 80%;
      height: 80%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  span {
    color: gray;
  }
}
</style>
