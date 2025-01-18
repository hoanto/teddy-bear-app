<script setup lang="ts">
import { useProduct } from "@/composables/useProduct";
import ProductList from "../components/product/ProductList.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/product";
import { useCartStore } from "@/stores/cart";
import { formatCurrency, formatDate } from "@/utils/format";
import { useComment } from "@/composables/useComment";
import { ElMessage } from "element-plus";
import { useCommentStore } from "@/stores/comment";
import { useUserStore } from "@/stores/user";

const { getSingleProduct, getSingleDescByProduct } = useProduct();
const { getComments } = useComment();

const { singleProduct, productList, singleDesc } = storeToRefs(useProductStore());
const { getProducts } = useProduct();
const { commentList } = storeToRefs(useCommentStore());
const { user } = storeToRefs(useUserStore());
const quantity = ref(1);

const { addCart, updatePropsCart } = useCartStore();

const route = useRoute();

const id = computed(() => parseInt(route.params.id as string));

const sizes = computed(() => singleProduct.value.size?.split(","));

const price = ref(0);

const chooseSize = ref("");
const chooseColor = ref((sizes?.value[0] as string) || "");

watch(
  () => sizes.value,
  () => {
    chooseSize.value = (sizes?.value[0] as string) || "";
  }
);

const form = reactive({
  productId: id.value || null,
  content: "",
});

const handleAddToCart = () => {
  addCart(
    {
      ...singleProduct.value,
      size: chooseSize.value,
    },
    quantity.value
  );

  ElMessage.success("Đã thêm vào giỏ !");
};

const { createComment } = useComment();

const handleCreateComment = async () => {
  if (!user.value && !localStorage.getItem("user"))
    return ElMessage.error("Please login !");

  const response = await createComment({
    productId: form.productId as number,
    content: form.content,
  });

  if (!response) return;

  form.content = "";

  await getComments(id.value);
};

onMounted(async () => {
  getComments(id.value);
  getSingleDescByProduct(id.value);
  getProducts();

  await getSingleProduct(id.value);

  price.value = parseFloat(singleProduct.value.price);
});

const handleChooseSize = (payload: string) => {
  const num = Number(payload.split("M")[0]);

  singleProduct.value.price = (price.value * num * 10).toString();

  chooseSize.value = payload;

  updatePropsCart(id.value, {
    size: chooseSize.value,
    color: chooseColor.value,
  });
};
</script>

<template>
  <div class="product-details">
    <div class="top">
      <el-card class="left">
        <img :src="singleProduct.image" alt="" />
      </el-card>
      <el-card class="right">
        <h1>{{ singleProduct.name }}</h1>
        <span style="color: gray">{{ singleProduct.description }}</span>
        <hr style="margin-top: 10px" />
        <div class="details-item">
          <span>
            <i class="pi pi-star"></i>&nbsp; <i class="pi pi-star"></i>&nbsp;
            <i class="pi pi-star"></i>&nbsp; <i class="pi pi-star"></i>&nbsp;
            <i class="pi pi-star"></i>&nbsp;
          </span>
          <span>{{ commentList.length }} Bình luận</span>
        </div>

        <div class="details-item">
          <span> Kích cỡ: </span>
          <div
            style="
              width: max-content;
              padding: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            v-for="size in sizes"
            :key="size"
            :class="chooseSize === size ? 'size active' : 'size'"
            @click="handleChooseSize(size)"
          >
            {{ size }}
          </div>
        </div>

        <div class="details-price">
          <span> Giá: </span>
          <span>{{ formatCurrency(singleProduct.price) }}</span>
        </div>

        <div class="details-quantity">
          <el-button
            @click="
              () => {
                if (quantity > 1) {
                  quantity = quantity - 1;
                }
              }
            "
            >-</el-button
          >
          <div>{{ quantity }}</div>
          <el-button @click="quantity = quantity + 1">+</el-button>
          <el-button
            @click="handleAddToCart"
            style="
              width: max-content;
              height: 45px;
              margin-left: 30px;
              color: #ffffff;
              background-color: orangered;
            "
          >
            Thêm vào giỏ hàng
          </el-button>
        </div>

        <div class="details-item">
          <span style="cursor: pointer">
            <i class="pi pi-heart"></i>
          </span>
        </div>
      </el-card>
    </div>

    <el-card class="bottom">
      <div style="display: flex; flex-direction: column; align-items: center;"
        v-for="(item, index) in singleDesc?.description?.descItem"
        :key="index"
      >
        <div v-if="item.content" style="margin-top: 20px;">
          <span>{{ item.content }}</span>
        </div>
        <img v-if="item.image" width="700px" height="500px;" style="object-fit: contain; margin-top: 10px;" :src="item.image" alt="" />
      </div>

      <h2>Bình luận & Đánh giá</h2>

      <div class="comment-list">
        <div class="item" v-for="item in commentList" :key="item.id">
          <div style="color: orangered; font-weight: 500">
            {{ item.user?.userName }} |
            <span style="font-size: 12px">{{
              formatDate(item.createdAt as string)
            }}</span>
          </div>
          <div style="margin-top: 10px">
            {{ item.content }}
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-top: 50px">
        <el-input
          v-model="form.content"
          style="height: 50px"
          placeholder="Bình luận..."
        />
        <el-button
          @click="handleCreateComment"
          style="
            height: 50px;
            width: 180px;
            margin-left: 30px;
            background-color: orangered;
            color: white;
            border: none;
          "
          type="primary"
          >Bình luận</el-button
        >
      </div>
    </el-card>

    <div class="product-list">
      <h2>Sản phẩm liên quan</h2>
      <ProductList :productList="productList" :hiddenTitle="true" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-details {
  width: 100%;
  padding: 0 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;

  span {
    color: gray;
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .left {
      flex: 1;
      border-radius: 5px;
      margin-right: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .right {
      flex: 1;
      min-width: 500px;

      .details-quantity {
        display: flex;
        align-items: center;
        margin-top: 20px;

        div {
          &:nth-child(2) {
            margin: 0 20px;
          }
        }
      }

      .details-item {
        margin-top: 20px;
        display: flex;
        align-items: center;

        span {
          &:first-child {
            margin-right: 20px;
          }
        }

        .size {
          width: 25px;
          height: 25px;
          border: 0.5px solid gray;
          text-align: center;
          line-height: 25px;
          margin: 0 10px;
          cursor: pointer;

          &.active {
            border: none;
            background-color: green;
            color: white;
          }
        }

        .color {
          margin: 0 10px;
          cursor: pointer;

          &.active {
            border: 3px solid orangered;
          }
        }

        .pi-star {
          color: orange;
        }
      }

      .details-price {
        margin-top: 20px;

        span {
          margin-right: 20px;

          &:last-child {
            color: orangered;
          }
        }
      }
    }
  }

  .bottom {
    margin-top: 50px;
    width: 100%;

    .comment-list {
      width: 100%;
      margin-top: 50px;

      .item {
        margin-top: 15px;
        width: 100%;
        min-height: 70px;
        height: auto;
        background-color: #eeeeee70;
        padding: 10px;
        border-radius: 5px;
      }
    }
  }

  .product-list {
    width: 100%;
    text-align: center;
    margin-top: 50px;
  }
}
</style>
