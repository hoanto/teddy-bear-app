<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import { useCartStore } from "@/stores/cart";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useOrder } from "@/composables/useOrder";
import { useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import { ORDER_TYPE } from "@/common/enum"
import PaypalButton from './PaypalButton.vue'
import { formatCurrency } from "@/utils/format";
import axios from "axios";

type RuleForm = {
  userName: string;
  phoneNumber: string;
  address: string;
  note: string;
};

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();

const { user } = storeToRefs(useUserStore());

const ruleForm = reactive<RuleForm>({
  userName:
    user.value?.userName ||
    JSON.parse(localStorage.getItem("user") as string)?.user?.userName ||
    "",
  phoneNumber: user.value?.userInfo?.phoneNumber || "",
  address: user.value?.userInfo?.address || "",
  note: "",
});

const district = ref('')
const province = ref('')

const router = useRouter();

const cartStore = useCartStore();

const provinces = ref<[{ name: string, districts: [{ name: string }] }]>([{ name: '', districts: [{ name: '' }] }])
const districts = ref<[{ name: string }]>([{ name: '' }])

const { cartList, total } = storeToRefs(cartStore);

const { createOrder, createOrderDetails } = useOrder();

const { updateUserInfo } = useUser();

const switchPayment = ref(false);

const rules = reactive<FormRules<RuleForm>>({
  phoneNumber: [
    {
      required: true,
      message: "Số điện thoại không được trống",
      trigger: ["change", "blur"],
    },
    {
      min: 10,
      max: 11,
      message: "Số điện thoại phải dài từ 10 - 11 số",
      trigger: ["change", "blur"],
    },
  ],
  address: [
    {
      required: true,
      message: "Địa chỉ không được bỏ trống",
      trigger: ["change", "blur"],
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await submitCreateOrder(ORDER_TYPE.NORMAL);

      localStorage.removeItem("cart");

      router.replace("/success");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const submitCreateOrder = async (type: ORDER_TYPE) => {
  const dataOrder = cartList.value.map(item =>({productId: item.product.id, quantity: item.quantity}))

  const orderId = await createOrder({
    dataOrder,
    userNote: ruleForm.note,
    paymentType: type
  });

  await updateUserInfo(
    {
      phoneNumber: ruleForm.phoneNumber,
      address: province.value + ' - ' + district.value + ' - ' + ruleForm.address,
    },
    false
  );

  if (orderId) {
    await Promise.all(
      cartList.value.map(async (item) => {
        await createOrderDetails(
          {
            productId: item.product.id as number,
            orderId,
            quantity: item.quantity,
            size: item.product.size,
            color: item.product.color,
          },
          false
        );
      })
    );
  }

  cartStore.clearCart();
};

const handleOrderSuccess = async (payload: {
  name: string;
  address: string;
}) => {
  ruleForm.userName = payload.name;
  ruleForm.address = payload.address;

  await submitCreateOrder(ORDER_TYPE.ONLINE);

  localStorage.removeItem("cart");

  router.replace("/success");
};

const getAddress = async () => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=2')

    provinces.value = response.data
  } catch (error) {
    ElMessage.error(error as any)
  }

}

watch(() => province.value, () => {
  district.value = ''
  districts.value = provinces.value.find((item: { name: string }) => item.name === province.value)?.districts || [{ name: '' }]
})

onMounted(() => getAddress())



</script>

<template>
  <h2>THANH TOÁN</h2>
  <div class="payment">
    <el-card class="left">
      <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
        class="demo-ruleForm" :size="formSize">
        <el-form-item label="Số điện thoại" prop="phoneNumber">
          <el-input v-model="ruleForm.phoneNumber" style="height: 40px" />
        </el-form-item>

        <div v-if="!switchPayment">
          <el-form-item label="Tỉnh thành" style="height: 60px">
            <el-select v-model="province" placeholder="Chọn tỉnh" style="height:60px;">
              <el-option v-for="item in provinces" :key="item.name" :label="item.name" :value="item.name"
                style="height: 60px" />
            </el-select>
          </el-form-item>

          <el-form-item label="Huyện xã" style="height: 60px">
            <el-select v-model="district" placeholder="Chọn huyện" style="height:60px;">
              <el-option v-for="item in districts" :key="item.name" :label="item.name" :value="item.name"
                style="height: 60px" />
            </el-select>
          </el-form-item>

          <el-form-item label="Địa chỉ" prop="address">
            <el-input v-model="ruleForm.address" style="height: 40px" />
          </el-form-item>

          <el-form-item label="Ghi chú">
            <el-input v-model="ruleForm.note" type="textarea" />
          </el-form-item>
        </div>

        <el-form-item style="margin-left: 150px;" label="Thanh toán với PayPal" prop="delivery">
          <el-switch v-model="switchPayment" />
        </el-form-item>

        <PaypalButton @success="handleOrderSuccess" :total="total" v-if="switchPayment" />

        <el-form-item v-else>
          <el-button style="height: 45px; width: 200px; color: white; background-color: orangered; margin-left: 150px;"
            @click="submitForm(ruleFormRef)">
            Thanh toán
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="cart-list">
      <div v-for="(item, index) in cartList" :key="index" class="cart-item">
        <img width="90px" height="90px" style="border-radius: 5px" :src="item.product.image" alt="" />
        <div class="info">
          <span><b style="color: #333">Tên sản phẩm:</b>&nbsp;
            {{ item.product.description }}
          </span>
          <span style="margin-top: 5px"><b style="color: #333">Số lượng: </b>&nbsp; x {{ item.quantity }}</span>
          <span style="margin-top: 5px"><b style="color: #333">Đơn giá: </b>&nbsp;
            <span style="color: red">{{ formatCurrency(item.product.price) }}</span></span>
        </div>
      </div>
      <span style="margin-top: 30px"><b style="margin-top: 20px; color: #333">Tổng tiền thanh toán: </b>
        <span style="color: red">{{ cartList.length ? formatCurrency(total) : 0 }}</span></span>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  height: 40px !important;
}


h2 {
  margin-top: 50px;
}

.payment {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 10px 200px;
  margin-top: 50px;
  border: 0.5px solid rgba(128, 128, 128, 0.26);
  border-radius: 5px;
  height: auto;

  .left {
    flex: 1;
    margin-top: 20px;

    .el-form {
      margin-top: 50px;
    }
  }

  .cart-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-left: 20px;
    color: gray;
    max-height: 500px;
    overflow-y: auto;

    .cart-item {
      display: flex;
      align-items: flex-start;
      padding-bottom: 10px;
      border-bottom: 0.5px solid rgba(128, 128, 128, 0.301);
      margin-top: 15px;
      margin-bottom: 30px;

      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 20px;
      }
    }
  }

  .cart-list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  .cart-list::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  .cart-list::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.562);
  }
}
</style>
