<script lang="ts" setup>
import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/utils/format";
import { storeToRefs } from "pinia";

const { addCart, removeCart, decrementCart } = useCartStore();
const { cartList, total } = storeToRefs(useCartStore());

const handleRemoveCart = (id: number) => {
  removeCart(id);
};
</script>

<template>
  <el-card class="cart">
    <h2 style="
        display: flex;
        align-items: center;
        text-align: center;
        margin-bottom: 30px;
        margin-left: 10px;
      ">
      GIỎ HÀNG
    </h2>
    <el-table :data="cartList" style="width: 100%">
      <el-table-column label="Ảnh" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <img width="90px" height="90px" :src="scope.row.product.image" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Mô tả" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <div style="display: flex;align-items: center; flex-direction:row;">
              <span>Kích cỡ:
                <div style="
                    width: max-content;
                    height: 20px;
                    background-color: #eeeeee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: green;
                    color: white;                 
                    padding: 3px;               
                  ">
                  {{ scope.row.product.size }}
                </div>

              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Giá" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ formatCurrency(scope.row.product.price) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Số lượng" width="180">
        <template #default="scope">
          <el-button @click="decrementCart(scope.row.product.id)">-</el-button>
          <span style="margin: 0 15px">{{ scope.row.quantity }}</span>
          <el-button @click="addCart(scope.row.product, 1)">+</el-button>
        </template>
      </el-table-column>

      <el-table-column label="Tổng tiền" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="color: red">{{
              formatCurrency(scope.row.product.price * scope.row.quantity)
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button size="small" type="danger" @click="() => handleRemoveCart(scope.row.product.id)">
            <i class="pi pi-trash"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <div class="bottom">
    <div style="margin-top: 20px">
      <span>Tổng tiền thanh toán : &nbsp;</span>
      <span style="color: red; font-weight: bold">{{ cartList.length ? formatCurrency(total) : 0 }}</span>
    </div>

    <router-link style="text-decoration: none; color: inherit" to="/payment">
      <el-button style="
          height: 45px;
          margin-top: 30px;
          background-color: orangered;
          color: white;
        ">Thanh toán</el-button>
    </router-link>
  </div>
</template>

<style lang="scss" setup>
.cart {
  width: 70%;
  padding: 0 200px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom {
  width: 80%;
  padding: 0 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
}
</style>
