CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS episodes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  host VARCHAR(120) NOT NULL,
  duration VARCHAR(12) NOT NULL DEFAULT '00:00',
  cover_theme VARCHAR(24) NOT NULL DEFAULT 'green',
  audio_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_episodes_category FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_episodes_title (title),
  INDEX idx_episodes_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO categories (id, name) VALUES
(1, 'Phát triển'), (2, 'Công nghệ'), (3, 'Đời sống'), (4, 'Âm nhạc');

INSERT INTO episodes (category_id, title, description, host, duration, cover_theme, audio_url) VALUES
(1, 'Nghệ thuật bắt đầu lại', 'Những thay đổi nhỏ giúp bạn xây dựng một phiên bản tốt hơn của chính mình.', 'Minh Anh', '18:42', 'green', NULL),
(2, 'Công nghệ đang đổi thay', 'Cùng nhìn vào những xu hướng công nghệ đang định hình cuộc sống.', 'Hoàng Nam', '24:16', 'blue', NULL),
(3, 'Chậm lại giữa thành phố', 'Tìm những khoảng bình yên nhỏ giữa lịch trình bận rộn mỗi ngày.', 'Thảo My', '16:08', 'orange', NULL),
(1, 'Tư duy sáng tạo mỗi ngày', 'Cách nuôi dưỡng trí tò mò và biến ý tưởng thành hành động.', 'Gia Huy', '21:35', 'pink', NULL),
(2, 'AI và tương lai công việc', 'Hiểu AI bằng ngôn ngữ gần gũi và chuẩn bị cho những thay đổi mới.', 'Bảo Linh', '29:04', 'night', NULL),
(3, 'Một tách trà, một câu chuyện', 'Những câu chuyện đời thường nhắc ta trân trọng hiện tại.', 'Khánh Vy', '14:52', 'purple', NULL);
