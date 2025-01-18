import { ref } from "vue";
import { defineStore } from "pinia";
import type { TDesc, TProduct, TProductParams } from "@/common/type";

export const useProductStore = defineStore("productStore", () => {
  const productList = ref<TProduct[]>([]);
  const productSellTheMost = ref<TProduct>({
    name: "",
    image: "",
    price: "",
    stock: 0,
    sold: 0,
    description: "",
    color: "",
    size: "",
    categoryId: null,
  });
  const descList = ref<TDesc[]>([]);
  const singleDesc = ref<TDesc>({
    productId: undefined,
    description: {
      images: [],
      descItem: [
        {
          image: "",
          content: "",
        },
      ],
    },
  });

  const filter = ref<TProductParams>({});
  const singleProduct = ref<TProduct>({
    name: "",
    image: "",
    price: "",
    stock: 0,
    sold: 0,
    description: "",
    color: "",
    size: "",
    categoryId: null,
  });

  const setProductList = (payload: TProduct[]) => {
    productList.value = payload;
  };

  const setSingleProduct = (payload: TProduct) => {
    singleProduct.value = payload;
  };

  const setProductSellTheMost = (payload: TProduct) => {
    productSellTheMost.value = payload;
  };

  const setFilter = (payload: TProductParams) => {
    filter.value = payload;
  };

  const setDescList = (payload: TDesc[]) => {
    descList.value = payload;
  };

  const setSingleDesc = (payload: TDesc) => {
    singleDesc.value = payload;
  };

  return {
    productList,
    setProductList,
    singleProduct,
    setSingleProduct,
    filter,
    setFilter,
    productSellTheMost,
    setProductSellTheMost,
    descList,
    singleDesc,
    setDescList,
    setSingleDesc,
  };
});
