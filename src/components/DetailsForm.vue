<script lang="ts" setup>
import { ACTION_ENUM } from "@/common/enum";
import type { TProduct } from "@/common/type";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import BaseUpload from "@/base/BaseUpload.vue";
import { useProduct } from "@/composables/useProduct";
import { useProductStore } from "@/stores/product";
import type { FormInstance, FormRules } from "element-plus";

const appStore = useAppStore();
const productStore = useProductStore();
const { actionType } = storeToRefs(appStore);
const { productList, singleDesc } = storeToRefs(productStore);

const chooseColor = ref<string[]>([]);
const chooseSize = ref<string[]>([]);

const { createDescProduct, updateDescProduct, getDescProduct, getProducts } =
  useProduct();

const ruleFormRef = ref<FormInstance>();

type TDesc = {
  content: string;
  image: string;
};

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

const images = ref<any[]>([]);
const desc = ref<TDesc[]>([{ content: "", image: "" }]);

const rules = reactive<FormRules<TProduct>>({});

const actionText = computed(() =>
  actionType.value === ACTION_ENUM.CREATE ? "Tạo" : "Cập nhật"
);

const handleCloseForm = () => {
  appStore.setIsShowActionForm(false);
  appStore.setIsShowOverlay(false);
};

const sizeImg = ref(1);
const sizeDesc = ref(1);

const productId = ref(null);

const handleChangeFile = (url: string, type: string, index: number) => {
  if (type === "desc") {
    desc.value[index].image = url;
  } else {
    images.value.push(url);
  }

  ruleForm.image = url;
};

const handleSubmit = async () => {
  await ruleFormRef?.value?.validate(async (valid, fields) => {
    if (valid) {
      actionType.value === ACTION_ENUM.CREATE
        ? await createDescProduct({
            productId: productId.value,
            description: {
              images: images.value,
              descItem: desc.value,
            },
          })
        : await updateDescProduct(
            {
              productId: productId.value,
              description: {
                images: images.value,
                descItem: desc.value,
              },
            },
            productId.value as any
          );

      await getDescProduct();

      handleCloseForm();
    } else {
      console.log("error submit!", fields);
    }
  });
};

watch(
  () => singleDesc.value,
  () => {
    productId.value = singleDesc?.value?.productId as any;
    desc.value = singleDesc.value?.description?.descItem as any;
    images.value = singleDesc.value?.description?.images as any;
    sizeDesc.value = singleDesc.value?.description?.descItem.length as number;
    sizeImg.value = singleDesc.value?.description?.images.length as number;
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

const handleClear = (index: number, type: string) => {
  if (type === "desc") {
    desc.value[index].image = "";
  }

  if (type === "img") {
    images.value[index] = "";
  }
};

onMounted(() => {
  getDescProduct();
  getProducts();
});
</script>

<template>
  <div class="product-form-container">
    <el-card class="main">
      <div class="top">
        <h2>{{ actionText }} chi tiết sản phẩm</h2>
        <el-icon style="cursor: pointer" @click="handleCloseForm">
          <CloseBold />
        </el-icon>
      </div>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item label="ID sản phẩm" label-position="top">
          <el-select
            v-model="productId"
            placeholder="Chọn ID sản phẩm"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in productList.sort((x: any, y: any) => x?.id - y?.id)"
              :key="item.name"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <div
          style="
            display: flex;
            align-items: flex-start;
            width: 100%;
            justify-content: space-between;
          "
        >
          <div
            style="
              display: flex;
              width: 80%;
              flex-wrap: wrap;
              justify-content: space-between;
            "
          >
            <el-form-item
              v-for="(, index) in sizeImg"
              :key="index"
              label="Ảnh sản phẩm"
              label-position="top"
              prop="image"
            >
              <BaseUpload
                type="img"
                @clear="handleClear"
                @change="handleChangeFile"
                :url="images[index]"
                :index="index"
              />
            </el-form-item>
          </div>

          <el-button
            type="primary"
            @click="sizeImg += 1"
            style="display: flex; align-items: center"
            ><i class="pi pi-plus"></i
          ></el-button>
        </div>

        <div
          style="
            display: flex;
            align-items: flex-start;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 30px;
          "
        >
          <div style="display: flex; flex-direction: column">
            <el-form-item
              label="Mô tả"
              label-position="top"
              v-for="(, index) in sizeDesc"
            >
              <el-input
                v-model="desc[index].content"
                style="margin-bottom: 10px"
              />

              <div
                style="
                  display: flex;
                  width: 80%;
                  flex-wrap: wrap;
                  justify-content: space-between;
                "
              >
                <el-form-item
                  :key="index"
                  label="Ảnh mô tả"
                  label-position="top"
                  prop="image"
                >
                  <BaseUpload
                    type="desc"
                    @change="handleChangeFile"
                    @clear="handleClear"
                    :url="desc[index].image"
                    :index="index"
                  />
                </el-form-item>
              </div>
            </el-form-item>
          </div>

          <el-button
            type="primary"
            @click="
              () => {
                sizeDesc += 1;
                desc.push({ content: '', image: '' });
              }
            "
            style="display: flex; align-items: center"
            ><i class="pi pi-plus"></i
          ></el-button>
        </div>
      </el-form>
    </el-card>

    <div class="bottom">
      <el-button type="info" @click="handleCloseForm">Hủy</el-button>
      <el-button type="primary" style="color: white" @click="handleSubmit">{{
        actionType === ACTION_ENUM.CREATE ? "Thêm" : "Sửa"
      }}</el-button>
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
