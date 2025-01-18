<script lang="ts" setup>
import { useOrder } from "@/composables/useOrder";
import { useOrderStore } from "@/stores/order";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { formatCurrency, formatDate } from "@/utils/format";
import type { TProduct } from "@/common/type";
import { ORDER_STATUS } from "@/common/enum";

const { getOrderByUser, updateOrder } = useOrder();

export type TOrderData = {
  product?: TProduct;
  quantity?: number;
  totalMoney?: string;
  userNote?: string;
  createdAt?: string;
  orderStatus?: string;
  orderId?: number;
};

const { orderList } = storeToRefs(useOrderStore());

const data = computed(() => {
  const order = [] as TOrderData[];

  orderList.value.forEach((item) => {
    item.orderDetails?.forEach((details) => {
      order.push({
        orderId: item.id,
        product: details.product,
        quantity: details.quantity,
        totalMoney: item.totalMoney,
        userNote: item.userNote,
        createdAt: formatDate(item.createdAt as string),
        orderStatus: item.orderStatus,
      });
    });
  });

  return order;
});

onMounted(async () => await getOrderByUser());

const activities = [
  {
    content: "Chờ duyệt",
    color: "gray",
  },
  {
    content: "Đang giao hàng",
    color: "orange",
  },
  {
    content: "Hoàn tất",
    color: "green",
  },
  {
    content: "Đã hủy",
    color: "red",
  },
];

const handleCancelOrder = async (id: number) => {
  await updateOrder({ orderStatus: ORDER_STATUS.CANCEL }, id);
  await getOrderByUser();
};
</script>

<template>
  <h2 style="margin-top: 50px; font-weight: bold">ĐƠN HÀNG CỦA TÔI</h2>
  <div class="order-list">
    <el-timeline style="max-width: 600px">
    
    </el-timeline>
    <el-card>
      <el-table :data="data" style="width: 100%">
        <el-table-column label="#ID" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span> x {{ scope.row?.orderId }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Ảnh" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img width="90px" height="90px" :src="scope.row?.product?.image" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mô tả" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <div>
                <div>
                  Tên sản phẩm:
                  <b>{{ scope.row?.product?.name }}</b>
                </div>
                <span style="display: flex; align-items: center">Kích cỡ: &nbsp;
                  <div style="
                      width: 20px;
                      height: 20px;
                      background-color: #eeeeee;
                      text-align: center;
                      line-height: 20px;
                    ">
                    {{ scope.row?.product?.size }}
                  </div>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Giá tiền" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="color: orangered">{{
                formatCurrency(scope.row?.product?.price)
              }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Số lượng" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span> x {{ scope.row?.quantity }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Tổng tiền" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="color: red; font-weight: bold">  {{ formatCurrency(scope.row?.product?.price * scope.row?.quantity) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ngày đặt" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row?.createdAt }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ghi chú" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row?.userNote }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái đơn" width="120">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <div v-if="scope.row?.orderStatus === 'pending'" style="
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  background-color: gray;
                "></div>
              <div v-if="scope.row?.orderStatus === 'delivery'" style="
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  background-color: orange;
                "></div>
              <div v-if="scope.row?.orderStatus === 'success'" style="
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  background-color: green;
                "></div>
              <div v-if="scope.row?.orderStatus === 'cancel'" style="
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  background-color: red;
                "></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.order-list {
  width: 100%;
  padding: 0 190px;
  display: flex;
  align-items: flex-start;
  margin-top: 50px;

  .el-timeline {
    margin-right: 100px;
    margin-top: 10px;
  }
}
</style>
