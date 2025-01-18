<script lang="ts" setup>
import { ACTION_ENUM } from "@/common/enum";
import type { TColor, TProduct } from "@/common/type";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import BaseUpload from "@/base/BaseUpload.vue";
import { useProduct } from "@/composables/useProduct";
import { useCategoryStore } from "@/stores/category";
import { useProductStore } from "@/stores/product";
import type { FormInstance, FormRules } from "element-plus";

const sizes = ["0.3M", "0.5M", "0.75M", "1M", "1.5M", "2M"];

const appStore = useAppStore();
const category = useCategoryStore();
const productStore = useProductStore();
const { actionType } = storeToRefs(appStore);
const { singleProduct } = storeToRefs(productStore);
const { categoryList } = storeToRefs(category);

const chooseColor = ref<string[]>([]);
const chooseSize = ref<string[]>([]);

const { createProduct, getProducts, updateProduct } = useProduct();

const ruleFormRef = ref<FormInstance>();

const emit = defineEmits(["close"]);

const ruleForm = reactive<TProduct>({
  name: "",
  description: "",
  image: "",
  price: "",
  sold: 0,
  size: "",
  stock: 0,
  categoryId: null,
  color: "",
});

const rules = reactive<FormRules<TProduct>>({
  name: [
    {
      required: true,
      message: "Tên sản phẩm không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],
  description: [
    {
      required: true,
      message: "Mô tả không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],

  image: [
    {
      required: true,
      message: "Ảnh không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],

  price: [
    {
      required: true,
      message: "Giá không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],

  size: [
    {
      required: true,
      message: "Kích cỡ không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],
  categoryId: [
    {
      required: true,
      message: "ID danh mục không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],
});

const actionText = computed(() =>
  actionType.value === ACTION_ENUM.CREATE ? "Tạo" : "Cập nhật"
);

const handleCloseForm = () => {
  emit("close");
  appStore.setIsShowActionForm(false);
  appStore.setIsShowOverlay(false);
};

const handleChangeFile = (url: string) => {
  ruleForm.image = url;
};

const handleSubmit = async () => {
  await ruleFormRef?.value?.validate(async (valid, fields) => {
    if (valid) {
      actionType.value === ACTION_ENUM.CREATE
        ? await createProduct(ruleForm)
        : await updateProduct(ruleForm, singleProduct.value.id as number);

      await getProducts();

      handleCloseForm();
    } else {
      console.log("error submit!", fields);
    }
  });
};

watch(
  () => singleProduct.value,
  () => {
    ruleForm.name = singleProduct.value.name;
    ruleForm.description = singleProduct.value.description;
    ruleForm.color = singleProduct.value.color;
    ruleForm.size = singleProduct.value.size;
    ruleForm.price = singleProduct.value.price;
    ruleForm.sold = singleProduct.value.sold;
    ruleForm.stock = singleProduct.value.stock;
    ruleForm.categoryId = singleProduct.value.categoryId;
    ruleForm.createdAt = singleProduct.value.createdAt;
    ruleForm.updatedAt = singleProduct.value.updatedAt;
  }
);

watch(
  () => chooseColor.value,
  () => {
    ruleForm.color = chooseColor.value.join(",");
  }
);

watch(
  () => chooseSize.value,
  () => {
    ruleForm.size = chooseSize.value.join(",");
  }
);

onUnmounted(() => {
  productStore.setSingleProduct({
    name: "",
    image: "",
    price: "",
    stock: 0,
    sold: 0,
    size: "",
    description: "",
    color: "",
    categoryId: null,
  });

  appStore.setActionType(ACTION_ENUM.CREATE);
});
</script>

<template>
  <div class="product-form-container">
    <el-card class="main">
      <div class="top">
        <h2>{{ actionText }} sản phẩm</h2>
        <el-icon style="cursor: pointer" @click="handleCloseForm">
          <CloseBold />
        </el-icon>
      </div>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item label="Tên sản phẩm" label-position="top" prop="name">
          <el-input v-model="ruleForm.name" placeholder="Nhập tên sản phẩm" />
        </el-form-item>

        <el-form-item label="Mô tả" label-position="top" prop="description">
          <el-input v-model="ruleForm.description" placeholder="Nhập mô tả" />
        </el-form-item>

        <el-form-item label="Kích cỡ" label-position="top" prop="size">
          <el-select
            multiple
            v-model="chooseSize"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in sizes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Giá" label-position="top" prop="price">
          <el-input v-model="ruleForm.price" placeholder="Nhập giá" />
        </el-form-item>

        <el-form-item label="Danh mục" label-position="top" prop="categoryId">
          <el-select
            v-model="ruleForm.categoryId"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Ảnh sản phẩm" label-position="top" prop="image">
          <BaseUpload @change="handleChangeFile" :url="ruleForm.image" />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="bottom">
      <el-button type="info" @click="handleCloseForm">Hủy</el-button>
      <el-button
        style="background-color: orangered; color: white"
        @click="handleSubmit"
        >{{ actionType === ACTION_ENUM.CREATE ? "Thêm" : "Sửa" }}</el-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-form-container {
  width: 25vw;
  height: 87vh;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  overflow: hidden;

  .main {
    width: 100%;
    height: 85vh;
    position: relative;
    overflow-y: auto;
    padding-bottom: 60px;

    .top {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .el-icon {
        cursor: pointer;
        font-size: 25px;
      }
    }

    .el-form {
      margin-top: 30px;
      position: relative;

      .el-input {
        height: 40px;
      }
    }
  }

  .main::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  .main::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  .main::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  .main::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.562);
  }

  .bottom {
    background-color: #ffffff;
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10;
    position: sticky;
    bottom: 0;
    border-top: 0.5px solid #eeeeeea2;

    .el-button {
      width: 180px;
      height: 50px;
    }
  }
}
</style>
