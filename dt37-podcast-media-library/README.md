# Đề tài 37 — Spotify-inspired Podcast / Media Library

Website quản lý podcast/audio với giao diện tối lấy cảm hứng từ các ứng dụng nghe nhạc hiện đại (không sử dụng logo/tài nguyên thương hiệu Spotify).

## Thành phần
- Frontend: HTML, CSS, JavaScript responsive.
- Backend: Node.js + Express REST API.
- Database: MySQL 8; phpMyAdmin để quản trị.
- Reverse proxy: Nginx.
- Monitoring: Prometheus + Grafana + Loki + Promtail.
- Hardening cơ bản: không publish cổng MySQL/API trực tiếp ra host; biến môi trường qua `.env`; healthcheck; container restart policy; giới hạn quyền ghi của Nginx frontend.

> **Lưu ý:** Đây là nền tảng đồ án để phát triển tiếp. Dữ liệu tập podcast ban đầu là dữ liệu mẫu; trường `audio_url` để trống thì nút phát chỉ hiển thị trạng thái demo, chưa phát âm thanh thật. Chưa có đăng nhập/phân quyền, HTTPS/chứng chỉ, backup tự động hoặc cấu hình production hoàn chỉnh. Không dùng mật khẩu mặc định trong triển khai thật.

## 1. Chạy trên Windows
1. Cài Git và Docker Desktop; mở Docker Desktop chờ trạng thái Running.
2. Giải nén dự án, mở thư mục `dt37-podcast-media-library` trong VS Code.
3. Tạo file `.env` ở thư mục gốc bằng cách sao chép `.env.example` thành `.env`.
4. Thay các mật khẩu trong `.env` trước khi chạy.
5. Mở Terminal trong VS Code tại thư mục có `docker-compose.yml`, chạy:

```powershell
docker compose up -d --build
docker compose ps
```

6. Truy cập:
- Website: http://localhost:8080
- phpMyAdmin: http://localhost:8081
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (đăng nhập theo `GRAFANA_ADMIN_USER` và `GRAFANA_ADMIN_PASSWORD` trong `.env`)

Dừng: `docker compose down`
Dừng và xóa cả dữ liệu database: `docker compose down -v` (**cẩn thận, sẽ xóa dữ liệu**).

## 2. API mẫu
- `GET /api/health`
- `GET /api/episodes`
- `GET /api/categories`

Nginx chuyển tiếp `/api/` đến Node.js. Các API quản lý tạo/sửa/xóa, tài khoản và phân quyền cần được bổ sung theo yêu cầu chấm đồ án.

## 3. GitHub — đẩy dự án lên repository
Tạo repository trống trên GitHub, ví dụ `dt37-podcast-media-library`. Không chọn thêm README/.gitignore nếu thư mục local đã có sẵn các file này.

Trong VS Code Terminal, đứng tại thư mục gốc dự án:

```powershell
git init
git branch -M main
git add .
git status
git commit -m "feat: build Spotify-inspired podcast media library"
git remote add origin https://github.com/TEN-GITHUB/dt37-podcast-media-library.git
git push -u origin main
```

Thay `TEN-GITHUB` bằng username GitHub của bạn và dùng đúng URL repository đang sở hữu. Nếu đã cấu hình `origin`, kiểm tra bằng `git remote -v`; nếu sai thì chạy:
```powershell
git remote set-url origin https://github.com/TEN-GITHUB/dt37-podcast-media-library.git
git push -u origin main
```

Nếu Git báo `remote origin already exists`, dùng `git remote set-url origin ...` thay vì `git remote add origin ...`.
Nếu báo `Repository not found`, kiểm tra URL, username, repository đã tạo chưa và tài khoản có quyền truy cập không. Không dán dấu `]`, dấu cách hoặc dấu câu vào cuối URL.

## 4. Quy trình branch nhóm (nếu giảng viên yêu cầu)
```powershell
git checkout -b feature/US1-FE
git add .
git commit -m "feat: create podcast library UI"
git push -u origin feature/US1-FE
```
Sau đó tạo Pull Request từ `feature/US1-FE` vào `develop` trên GitHub và nhờ thành viên review. Không push trực tiếp vào `main` nếu quy trình nhóm yêu cầu Pull Request.

## 5. Cấu trúc
```text
dt37-podcast-media-library/
├── backend/                  # Node.js API
├── database/init.sql         # schema + dữ liệu mẫu
├── nginx/default.conf        # reverse proxy
├── monitoring/prometheus.yml
├── monitoring/loki-config.yml
├── monitoring/promtail-config.yml
├── docker-compose.yml
├── .env.example
└── site/                     # Spotify-inspired UI
```

## 6. Gợi ý kiểm thử/chụp minh chứng
- Giao diện ở `http://localhost:8080`
- Tìm kiếm và lọc chủ đề; lưu podcast; nghe gần đây
- `docker compose ps` hiển thị các container đang chạy
- `http://localhost:8080/api/health`
- phpMyAdmin hiển thị database `podcast_library`
- Prometheus target và Grafana datasource
- Truy vấn log trong Grafana Explore với datasource Loki

Chỉ ghi nhận các chức năng đã chạy và kiểm thử thực tế trong báo cáo.
