<script lang="ts" setup>
import BaseTable from "@/base/BaseTable.vue";
import DetailsForm from "@/components/DetailsForm.vue";
import { useCategory } from "@/composables/useCategory";
import { useOrder } from "@/composables/useOrder";
import { useProduct } from "@/composables/useProduct";
import { useAppStore } from "@/stores/app";
import { useProductStore } from "@/stores/product";
import { exportToExcel } from "@/utils/export";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

const {
  getProducts,
  getProductSellTheMost,
  getDescProduct,
  getSingleDescProduct,
  deleteDescProduct,
} = useProduct();

const appStore = useAppStore();
const { isShowActionForm } = storeToRefs(appStore);

const { getCategoryList } = useCategory();
const { getOrders } = useOrder();

const productStore = useProductStore();

const { descList } = storeToRefs(productStore);

const tableData = computed(() =>
  descList.value.map((item) => ({
    ...item,
    descImages: item?.description?.images,
    descItems: item?.description?.descItem,
  }))
);

const tableColumns = [
  { prop: "id", label: "#ID", width: "auto" },
  { prop: "productId", label: "#ID sản phẩm", width: "auto" },
  { prop: "descImages", label: "Chi tiết mô tả", width: "auto" },
  { prop: "descItems", label: "Chi tiết mô tả", width: "auto" },
];

const handleEditData = async (id: number) => {
  await getSingleDescProduct(id);
};

const handleDelete = async (id: number) => {
  await deleteDescProduct(id);
  await getDescProduct();
};

const handleExportFile = () => {
  exportToExcel(descList.value);
};

onMounted(async () => {
  getProducts();
  getCategoryList();
  getOrders();
  getProductSellTheMost();
  getDescProduct();
});
</script>

<template>
  <div class="product-container">
    <div class="product-list">
      <BaseTable
        styleValue="height:600px"
        :data="tableData"
        :columns="tableColumns"
        @edit="handleEditData"
        @delete="handleDelete"
        @export="handleExportFile"
      />
    </div>
    <DetailsForm v-if="isShowActionForm" />
  </div>
</template>

<style lang="scss" scoped>
.product-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .product-featured {
    width: 100%;
    display: flex;
    align-items: center;

    .el-card {
      height: 200px;
      flex: 1;
      margin: 20px;
    }
  }

  .product-list {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;

    .el-input {
      margin-bottom: 20px;
    }
  }
}
</style>
