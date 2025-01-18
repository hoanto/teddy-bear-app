<script setup lang="ts">
const handleSuccess = () => {
  window.location.href = "/";
};
</script>

<template>
  <div class="card">
    <div style="
        border-radius: 200px;
        height: 200px;
        width: 200px;
        background: #f8faf5;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
      <i class="checkmark">✓</i>
    </div>
    <h1>ĐẶT HÀNG THÀNH CÔNG !</h1>
    <p>Chúng tôi sẽ kiểm tra đơn hàng và gửi phản hồi tới email của bạn. Vui lòng kiểm tra email<br /></p>
    <div style="display: flex; align-items: center; margin-top: 20px">
      <el-button @click="handleSuccess"
        style="margin-right: 20px; height: 45px; background-color: orangered; color: white;"
        class="primary">Trang chủ</el-button>

      <router-link to="my-order"><el-button style="height: 45px; background-color: orangered; color: white;"
          class="primary">Đơn hàng của tôi</el-button></router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
h1 {
  color: #88b04b;
  font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
  font-weight: 900;
  font-size: 40px;
  margin-bottom: 10px;
}

p {
  color: #404f5e;
  font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
  font-size: 20px;
  margin: 0;
}

i {
  color: #9abc66;
  font-size: 100px;
  line-height: 200px;
  margin-left: -15px;
}

.card {
  background: white;
  padding: 60px;
  display: inline-block;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
