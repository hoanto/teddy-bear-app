<script lang="ts" setup></script>

<template>
  <div class="navbar-container">
  </div>
</template>

<style lang="scss" scoped>
.navbar-container {
  display: flex;
  align-items: center;
  height: 60px;
  position: relative;
  width: 100%;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;

  .el-dropdown{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .el-dropdown-link {
      font-size: 16px;
      display: flex;
      align-items: flex-end;
      outline: none;
      cursor: pointer;
      
      img{
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }
}
</style>
