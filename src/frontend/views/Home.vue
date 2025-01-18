<script setup lang="ts">
import Featured from "../components/featured/Featured.vue";
import CategoryList from '../components/category/CategoryList.vue'
import CategoryDetails from "./CategoryDetails.vue";
</script>

<template>
  <div class="home">
    <Featured />
    <div class="main">
      <CategoryDetails/>
      <CategoryList />
    </div>
  </div>
</template>


<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  overflow-x: hidden;

  .main{
    width: 1500px;
    display: flex;
    align-items: flex-start;
    margin: 0 auto;
  }
}
</style>
