# データベース設計書

## 概要
Album-Videoアプリケーションのデータベース設計書です。
ユーザーが画像を複数アップロードし、それらの画像から動画を作成する機能を実現するためのテーブル設計を定義します。

## 前提条件
- MySQL 8.0以上を使用
- 画像・動画ファイルはAWS S3に保存
- LINEログイン機能を使用した認証

## テーブル設計

### 1. users テーブル
ユーザー情報を管理するテーブル（LINEログイン対応）

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    line_user_id VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(500),
    email VARCHAR(100),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_line_user_id (line_user_id),
    INDEX idx_email (email)
);
```

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|-----|-----|
| id | BIGINT | PK, AUTO_INCREMENT | 内部ユーザーID |
| line_user_id | VARCHAR(50) | NOT NULL, UNIQUE | LINE User ID |
| display_name | VARCHAR(100) | NOT NULL | LINEでの表示名 |
| profile_image_url | VARCHAR(500) | NULL | LINEプロフィール画像URL |
| email | VARCHAR(100) | NULL | メールアドレス（LINE設定により取得可能） |
| access_token | TEXT | NULL | LINEアクセストークン |
| refresh_token | TEXT | NULL | LINEリフレッシュトークン |
| token_expires_at | TIMESTAMP | NULL | トークン有効期限 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

### 2. images テーブル
アップロードされた画像情報を管理するテーブル

```sql
CREATE TABLE images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    width INT,
    height INT,
    upload_status ENUM('uploading', 'completed', 'failed') DEFAULT 'uploading',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_upload_status (upload_status),
    INDEX idx_created_at (created_at)
);
```

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|-----|-----|
| id | BIGINT | PK, AUTO_INCREMENT | 画像ID |
| user_id | BIGINT | FK, NOT NULL | ユーザーID |
| original_filename | VARCHAR(255) | NOT NULL | 元のファイル名 |
| s3_key | VARCHAR(500) | NOT NULL | S3オブジェクトキー |
| s3_bucket | VARCHAR(100) | NOT NULL | S3バケット名 |
| file_size | BIGINT | NOT NULL | ファイルサイズ（バイト） |
| mime_type | VARCHAR(50) | NOT NULL | MIMEタイプ |
| width | INT | NULL | 画像の幅（ピクセル） |
| height | INT | NULL | 画像の高さ（ピクセル） |
| upload_status | ENUM | DEFAULT 'uploading' | アップロード状態 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

### 3. videos テーブル
作成された動画情報を管理するテーブル

```sql
CREATE TABLE videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    s3_key VARCHAR(500),
    s3_bucket VARCHAR(100),
    file_size BIGINT,
    duration DECIMAL(10,2),
    resolution VARCHAR(20),
    frame_rate DECIMAL(5,2),
    processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_processing_status (processing_status),
    INDEX idx_created_at (created_at)
);
```

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|-----|-----|
| id | BIGINT | PK, AUTO_INCREMENT | 動画ID |
| user_id | BIGINT | FK, NOT NULL | ユーザーID |
| title | VARCHAR(255) | NOT NULL | 動画タイトル |
| description | TEXT | NULL | 動画説明 |
| s3_key | VARCHAR(500) | NULL | S3オブジェクトキー |
| s3_bucket | VARCHAR(100) | NULL | S3バケット名 |
| file_size | BIGINT | NULL | ファイルサイズ（バイト） |
| duration | DECIMAL(10,2) | NULL | 動画時間（秒） |
| resolution | VARCHAR(20) | NULL | 解像度（例：1920x1080） |
| frame_rate | DECIMAL(5,2) | NULL | フレームレート |
| processing_status | ENUM | DEFAULT 'pending' | 処理状態 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

### 4. video_images テーブル
動画と画像の関連を管理する中間テーブル

```sql
CREATE TABLE video_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    sequence_order INT NOT NULL,
    display_duration DECIMAL(5,2) DEFAULT 3.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    INDEX idx_video_id (video_id),
    INDEX idx_image_id (image_id),
    INDEX idx_sequence_order (sequence_order),
    UNIQUE KEY uk_video_image_sequence (video_id, sequence_order)
);
```

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|-----|-----|
| id | BIGINT | PK, AUTO_INCREMENT | 関連ID |
| video_id | BIGINT | FK, NOT NULL | 動画ID |
| image_id | BIGINT | FK, NOT NULL | 画像ID |
| sequence_order | INT | NOT NULL | 動画内での表示順序 |
| display_duration | DECIMAL(5,2) | DEFAULT 3.0 | 画像表示時間（秒） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

## LINEログイン認証フロー

### 認証処理
1. フロントエンドでLINE Login SDK経由で認証
2. 認証成功後、LINEからaccess_tokenとline_user_idを取得
3. バックエンドでline_user_idを使用してユーザー情報を検索
4. 初回ログインの場合は新規ユーザーとしてDB登録
5. 既存ユーザーの場合はトークン情報を更新

### トークン管理
- access_tokenは一定期間で無効化されるため定期更新が必要
- refresh_tokenを使用してaccess_tokenを再取得
- token_expires_atでトークン有効期限を管理

## インデックス設計

### パフォーマンス最適化のためのインデックス
- **users**: line_user_id での検索用（認証時）
- **images**: user_id, upload_status, created_at での検索・フィルタリング用
- **videos**: user_id, processing_status, created_at での検索・フィルタリング用
- **video_images**: video_id, image_id, sequence_order での検索・並び替え用

## 制約とルール

### 外部キー制約
- `images.user_id` → `users.id` (CASCADE DELETE)
- `videos.user_id` → `users.id` (CASCADE DELETE)
- `video_images.video_id` → `videos.id` (CASCADE DELETE)
- `video_images.image_id` → `images.id` (CASCADE DELETE)

### ビジネスルール
1. 1つの動画には複数の画像を関連付けることができる
2. 1つの画像は複数の動画で使用できる
3. 動画内での画像の表示順序は sequence_order で管理
4. ユーザーが削除されると、関連する画像・動画も削除される
5. 画像・動画ファイルの実体はS3に保存し、DBには参照情報のみ保存
6. LINEログインでのみユーザー認証を行う

## S3連携設計

### S3キー設計
```
画像: users/{user_id}/images/{image_id}/{filename}
動画: users/{user_id}/videos/{video_id}/{filename}
```

### バケット構成
- 画像用バケット: `album-video-images-{environment}`
- 動画用バケット: `album-video-videos-{environment}`

## セキュリティ考慮事項

### LINEトークン管理
- アクセストークンは暗号化して保存することを推奨
- リフレッシュトークンは安全な場所に保存
- トークン有効期限の適切な管理

### プライバシー保護
- LINEから取得した個人情報の適切な取り扱い
- 不要になったトークン情報の適切な削除

## 拡張性への配慮

### 将来的な機能拡張
- 画像へのタグ付け機能
- 動画への音楽追加機能
- 動画共有機能
- 画像のメタデータ（EXIF情報）保存
- 他のSNSログイン機能（Google、Facebook等）の追加

これらの機能追加時には、適切なテーブル設計の見直しを行います。