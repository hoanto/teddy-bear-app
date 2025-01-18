<script setup lang="ts">
import type { TProduct } from "@/common/type";
import { formatCurrency } from "@/utils/format";
import { computed } from "vue";

const props = defineProps<{
  product: TProduct;
}>();


const sizeList = computed(()=> props.product.size?.split(','))

</script>

<template>
  <router-link
    style="text-decoration: none"
    class="product-container"
    :to="`/product/${props.product?.id}`"
  >
    <img :src="props.product?.image" alt="" />
    <div class="main">
      <span
        style="
          display: block;
          text-align: center;
          width: 60%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
          color: #333;
        "
        >{{ props.product?.name }}</span
      >

      <div style="margin-top: 10px; color: red">
        {{ formatCurrency(props.product.price) }}
      </div>

      <div style="width: 100%; display: flex; align-items: center; justify-content: center;">
        <div style="margin: 5px; background-color: green; color: white; padding: 5px; font-size: 14px; margin-top: 10px;" v-for="size in sizeList" :key="size">{{ size }}</div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.product-container {
  min-width: 230px;
  height: 350px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: gray;
  margin: 0 40px 40px 20px;
  cursor: pointer;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  }

  img {
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
    object-fit: cover;
  }

  .main {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10px;

    .product-cate {
      width: 100%;
      height: auto;

      div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      i {
        color: orange;
      }
    }

    .product-price {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
    }
  }

  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    .color-list {
      display: flex;
      align-items: center;
      height: auto;
      flex: 1;

      .color {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background-color: pink;
        margin-right: 10px;
      }
    }

    .size-list {
      display: flex;
      align-items: center;
      height: auto;
      flex: 1;
      justify-content: flex-end;

      .size {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background-color: #eeeeee;
        margin-right: 10px;
        text-align: center;
        line-height: 20px;
      }
    }
  }
}
</style>
