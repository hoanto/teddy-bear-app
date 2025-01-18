<script lang="ts" setup></script>
<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="footer-col">
          <h4>THÔNG TIN LIÊN HỆ</h4>
          <ul>
            <li><a href="#">Tp.Hà Nội</a></li>
            <li><a href="#">0333 444 555</a></li>
            <li><a href="#">cuahanggaubong@gmail.com</a></li>
            <li><a href="#">08h30 - 23h các ngày trong tuần</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>CHUYỂN KHOẢN ONLINE</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">MoMo</a></li>
            <li><a href="#">VNPay</a></li>
            <li><a href="#">MB Bank</a></li>
            <li><a href="#">An toàn & bảo mật</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>FANPAGE</h4>
          <ul>
            <li><a href="#">Follow cửa hàng gấu bông nhé!</a></li>
          </ul>
          <div class="social-links">
            <a href="#"><i class="pi pi-facebook"></i></a>
            <a href="#"><i class="pi pi-twitter"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>6 LÝ DO CHỌN CỬA HÀNG GẤU BÔNG</h4>
          <ul>
            <li><a href="#">Hàng Ngàn Mẫu Có Sẵn Tại Showroom Hà Nội</a></li>
            <li><a href="#">Giá Bán Lẻ Luôn Luôn Thấp</a></li>
            <li><a href="#">Cam Kết Nhồi 100% Bông Sạch,Độ Đàn Hồi Cao</a></li>
            <li><a href="#">Bảo Hành Gấu 1 Năm</a></li>
            <li><a href="#">Miễn Phí Ship Hàng Khi Mua Hàng Lần 3</a></li>
            <li>
              <a href="#">Giao Hàng Nội Thành - Ngoại Thành Siêu Tốc (Giao Hẹn Giờ & Tận
                Tay)</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: auto;
  padding-left: 200px;
  border-top: 5px solid #fd6282;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

ul {
  list-style: none;
}

.footer {
  padding: 70px 0;
  width: 100%;
  margin-top: 50px;
}

.footer-col {
  width: 25%;
  padding: 0 15px;
}

.footer-col h4 {
  font-size: 18px;
  text-transform: capitalize;
  margin-bottom: 35px;
  font-weight: 500;
  position: relative;
  color: #fd6282;
}

.footer-col h4::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -10px;
  background-color: #e91e63;
  height: 2px;
  box-sizing: border-box;
  width: 50px;
}

.footer-col ul li:not(:last-child) {
  margin-bottom: 10px;
}

.footer-col ul li a {
  font-size: 16px;
  text-transform: capitalize;
  text-decoration: none;
  font-weight: 300;
  color: #333;
  display: block;
  transition: all 0.3s ease;
}

.footer-col ul li a:hover {
  color: #333;
  padding-left: 8px;
}

.footer-col .social-links a {
  display: inline-block;
  height: 40px;
  width: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 10px 10px 0;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  color: #333;
  transition: all 0.5s ease;
}
</style>
