<script setup lang="ts">
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

</script>

<template>
  <div style="width: 100vw">
    <Carousel :autoplay="5000" :wrap-around="true">
      <Slide key="2">
        <div class="carousel__item">
          <img width="100%" height="100%" src="/banner-1.jpg" alt="" />
        </div>
      </Slide>
      <Slide key="1">
        <div class="carousel__item">
          <img width="100%" height="100%" src="/banner-2.jpg" alt="" />
        </div>
      </Slide>
      <Slide key="3">
        <div class="carousel__item">
          <img width="100%" height="100%" src="/banner-3.jpg" alt="" />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>

    <div class="featured-banner">
      <div class="banner-item">
        <img src="/banner-4.jpg" alt="" />
      </div>
      <div class="banner-item">
        <img src="/banner-5.jpg" alt="" />
      </div>
      <div class="banner-item">
        <img src="/banner-6.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel__item {
  height: 77vh;
  width: 100%;
  font-size: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f3f3;

  img {
    object-fit: fill;
  }

  h1 {
    font-size: 50px;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    span {
      text-align: left;
      margin: 40px 0;
      color: gray;
    }
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}

.featured-banner {
  width: 1300px;
  display: flex;
  margin: 0 auto;
  margin-top: 10px;
  justify-content: space-between;

  .banner-item {
    width: 30%;
    overflow: hidden;
    cursor: pointer;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;

      &:hover {
        transform: scale(1.1);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
