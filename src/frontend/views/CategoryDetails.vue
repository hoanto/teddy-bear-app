<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/product";
import type { TProductParams } from "@/common/type";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "@/stores/category";
import { useCategory } from "@/composables/useCategory";
const categoryStore = useCategoryStore();

const { categoryList } = storeToRefs(categoryStore);

const { getCategoryList } = useCategory();

const route = useRoute();

const { filter } = storeToRefs(useProductStore());

const filterParams = ref<TProductParams>({
  size: filter.value.size || "",
  price: filter.value.price || "",
  categoryId: filter.value.categoryId || "",
});

const submitFilter = async () => {
  await getCategoryList();

  const category = categoryList.value.map((item) => {
    if (filterParams.value.price) {
      item.products =
        filterParams.value.price === "ASC"
          ? item.products?.sort((x, y) => parseInt(x.price) - parseInt(y.price))
          : item.products?.sort(
              (x, y) => parseInt(y.price) - parseInt(x.price)
            );
    }

    if (filterParams.value.size) {
      item.products = item.products?.filter((item) =>
        item.size
          ?.split(",")
          .find(
            (s) =>
              s.toLocaleLowerCase() === filterParams.value.size?.toLowerCase()
          )
      );
    }

    return item;
  });

  categoryStore.setCategoryList(category);
};

const sizes = ref<string[]>(["0.3M", "0.5M", "0.75M", "1M", "1.5M", "2M"]);
</script>

<template>
  <div class="category-details">
    <el-card class="left">
      <div
        style="
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          justify-content: space-between;
        "
      >
        <span style="font-weight: bold">Bộ lọc</span>
        <i
          style="cursor: pointer"
          class="pi pi-sync"
          @click="
            () => {
              filterParams = {
                color: '',
                size: '',
                price: '',
              };
              getCategoryList();
            }
          "
        ></i>
      </div>
      <div class="filter-item">
        <span>Giá</span>
        <div class="hr"></div>
        <div style="display: flex; align-items: center; margin-top: 10px">
          <input
            type="checkbox"
            :checked="filterParams.price === 'DESC'"
            @change="
              () => {
                filterParams.price = 'DESC';
                submitFilter();
              }
            "
          />
          <span>Cao - Thấp</span>
        </div>

        <div style="display: flex; align-items: center; margin-top: 10px">
          <input
            type="checkbox"
            :checked="filterParams.price === 'ASC'"
            @change="
              () => {
                filterParams.price = 'ASC';
                submitFilter();
              }
            "
          />
          <span>Thấp - Cao</span>
        </div>
      </div>

      <div class="filter-item">
        <span>Kích cỡ</span>
        <div class="hr"></div>
        <div
          v-for="size in sizes"
          :key="size"
          style="display: flex; align-items: center; margin-top: 10px"
        >
          <input
            type="checkbox"
            :checked="size === filterParams.size"
            @change="
              () => {
                filterParams.size = size;
                submitFilter();
              }
            "
          />
          <span>{{ size }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  appearance: none;
  /* Remove the default checkbox styling */
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

input[type="checkbox"]:checked {
  background-color: orangered;
  /* Change the background when checked */
  border-color: orangered;
}

.category-details {
  width: 30% !important;
  display: flex;
  align-items: flex-start;
  height: auto;
  justify-content: space-between;
  margin-top: 120px;
  margin-bottom: 20px;

  .left {
    width: 300px;
    border-radius: 5px;
    padding: 20px;
    color: gray;
    margin-top: 70px;

    .filter-item {
      height: auto;
      min-height: 100px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      span {
        font-size: 14px;
        min-width: 80px;
        width: auto;

        &:first-child {
          font-weight: 400;
          font-size: inherit;
          color: #333;
        }
      }

      .hr {
        width: 80%;
        height: 1px;
        background-color: rgba(105, 99, 99, 0.363);
        margin-bottom: 20px;
      }

      input {
        margin-right: 20px;
        width: 20px;
        height: 20px;

        &:hover {
          cursor: pointer;
        }
      }

      .color {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        margin-left: 50px;
        border: 0.5px solid rgba(128, 128, 128, 0.199);
        opacity: 0.5;
      }
    }
  }

  .right {
    width: 100%;
  }
}
</style>
