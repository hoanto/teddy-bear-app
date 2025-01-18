<script setup lang="ts">
import { useCategory } from "@/composables/useCategory";
import { useProduct } from "@/composables/useProduct";
import { useCartStore } from "@/stores/cart";
import { useCategoryStore } from "@/stores/category";
import { useProductStore } from "@/stores/product";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const { setUser } = useUserStore();
const { user } = storeToRefs(useUserStore());
const { cartList } = storeToRefs(useCartStore());
const cartStore = useCartStore();
const { getCategoryList } = useCategory()
const { setFilter } = useProductStore();

const isShowNotify = ref(false);

const categoryStore = useCategoryStore()

const { categoryList } = storeToRefs(categoryStore)

const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  cartStore.$reset();
};

const q = ref<string>("");

const handleFilter = async () => {
  setFilter({ q: q.value });

  if (q.value === '') {
    getCategoryList()

    return
  }

  const category = categoryList.value.map(item => {

    return {
      ...item,
      products: item.products?.filter(item => item.name.toLocaleLowerCase().includes(q.value.toLocaleLowerCase()))
    }
  })

  categoryStore.setCategoryList(category)
};

const isAdmin = computed(() =>
  user?.value?.userRoles?.find((item) => item.role.roleName === "super_admin")
);

</script>

<template>
  <div class="nav-container">
    <div class="navbar">
      <div class="top">
        <div class="left">
          <router-link style="color: inherit; text-decoration: none" class="top-item logo" to="/">
            <div style="
                cursor: pointer;
                width: max-content;
                display: flex;
                align-items: center;
              ">
              <img style="object-fit: cover" width="max-content" height="45px" src="/logo.png" alt="" />
              <span style="
                  font-size: 1.5rem;
                  text-transform: uppercase;
                  color: #fd6282;
                  margin-left: 0.5rem;
                  font-weight: bold;
                ">CỬA HÀNG GẤU BÔNG</span>
            </div>
          </router-link>
          <div class="top-item search">
            <input @input="handleFilter" v-model="q" type="text" placeholder="Nhập sản phẩm cần tìm ..." />
            <button>
              <el-icon>
                <Search />
              </el-icon>
            </button>
          </div>
        </div>

        <div class="right">
          <div class="top-item action">
            <div v-if="isAdmin" class="item">
              <i class="pi pi-building-columns"></i>&nbsp;
              <router-link style="color: inherit; text-decoration: none" to="/admin/dashboard">
                <span style="font-weight: 300; color: gray">Trang quản trị</span>
              </router-link>
            </div>

            <div class="item" v-if="user">
              <i class="pi pi-shopping-bag"></i>&nbsp;
              <router-link style="color: inherit; text-decoration: none" to="/my-order">
                <span style="font-weight: 300; color: gray">Đơn hàng</span>
              </router-link>
            </div>
            <div class="item">
              <i class="pi pi-shopping-cart"></i>&nbsp;
              <router-link style="color: inherit; text-decoration: none" to="/cart"><span
                  style="font-weight: 300; color: gray; position: relative">Giỏ hàng
                  <span style="
                      position: absolute;
                      bottom: 17px;
                      left: -5px;
                      background-color: red;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      color: white;
                      display: flex;
                      font-size: 12px;
                      justify-content: center;
                      align-items: center;
                    ">{{ cartList.length }}</span></span></router-link>
            </div>
            <div class="item" v-if="!user">
              <router-link style="
                  color: inherit;
                  text-decoration: none;
                  margin-right: 20px;
                " to="/login">
                Đăng nhập
              </router-link>

              <router-link style="color: inherit; text-decoration: none; margin-left: 20px" to="/register">Đăng
                ký</router-link>
            </div>

            <div v-if="user" class="item">
              <i class="pi pi-user"></i>&nbsp;
              <span><b>{{ user.userName }}</b></span>
            </div>

            <div v-if="user" class="item" @click="handleLogout">
              <el-button style="
                  font-weight: 300;
                  height: 45px;
                  background-color: orangered;
                  color: white;
                "><li class="pi pi-sign-out"></li> &nbsp;Đăng xuất</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-container {
  width: 100%;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1300px;
  height: auto;
  margin: 0 auto;
  padding: 10px;
  font-weight: 500;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #ffffff;
  border-bottom: 0.5px solid #eeeeee;
  font-family: "Roboto", sans-serif;

  :deep(.el-dropdown-link) {
    &:hover {
      border: none;
      outline: none;
    }
  }

  .notify-list {
    min-width: 300px;
    width: auto;
    position: absolute;
    right: 50px;
    top: 20px;

    .notify-item {
      width: 100%;
      min-height: 45px;
      height: auto;
      padding-left: 10px;
      font-size: 12px;
      border-bottom: 0.5px solid #eeeeee;
      display: flex;
      align-items: center;

      &:hover {
        background-color: lightblue;
      }
    }
  }

  .top {
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;

    .top-item {
      margin: 0 20px;
      width: max-content;
    }

    .left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .right {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .search {
      border: 1px solid #333;
      height: 45px;
      display: flex;
      align-items: center;
      min-width: 40%;

      input {
        width: 99%;
        height: 99%;
        border: none;
        outline: none;
        padding-left: 10px;

        &::placeholder {
          font-weight: 300;
        }
      }

      button {
        width: 60px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background-color: transparent;
        font-weight: bold;
        font-size: 20px;
        cursor: pointer;
      }
    }

    .action {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      right: 0;

      .item {
        display: flex;
        align-items: center;
        width: max-content;
        margin-left: 45px;
        height: max-content;
        cursor: pointer;
      }

      .btn-auth {
        height: 45px;

        &:hover {
          background-color: orangered;
          color: #ffffff !important;
        }
      }
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;

    ul {
      width: 100%;
      display: flex;
      list-style: none;
      justify-content: center;
      align-items: flex-end;
      margin-top: 10px;

      li {
        margin: 0 50px;
        cursor: pointer;
        padding-bottom: 5px;

        &.active {
          border-bottom: 3px solid #3f51b5;
        }
      }
    }
  }
}

.hr {
  width: 100%;
  height: 1px;
  background-color: rgba(128, 128, 128, 0.205);
  margin-top: 10px;
}
</style>
