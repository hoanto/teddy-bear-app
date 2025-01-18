import { ref } from "vue";
import { defineStore } from "pinia";
import type { TOrder } from "@/common/type";

export const useOrderStore = defineStore("orderStore", () => {
  const orderList = ref<TOrder[]>([]);

  const count = ref(0);

  const singleOrder = ref<TOrder>();

  const setOrderList = (payload: TOrder[]) => {
    orderList.value = payload;
    count.value = orderList.value.length;
  };

  const setSingleOrder = (payload: TOrder) => {
    singleOrder.value = payload;
  };

  const setCount = (length: number) => {
    count.value = length;
  };

  return {
    orderList,
    setOrderList,
    singleOrder,
    setSingleOrder,
    count,
    setCount
  };
});
