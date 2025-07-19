# Full Stack Online Voting Project

## 🛠️ Setup

1. Jalankan container database dengan Docker:
   ```bash
   docker compose up -d
   ```
2. Setelah database berjalan, jalankan command ini untuk setup Prisma:
   ```bash
   npm run migrateDev
   ```

2. Setelah itu, jalankan:
   ```bash
   npm run seed
   npm run dev
   ```

## 👤 Akun Admin (dari seed)

- **ID**: `0`  
- **Password**: `admin123`

Terdapat juga **2 akun user mock lainnya** yang sudah disediakan di file seed.

## 📦 Tentang Proyek

Project ini adalah salah satu contoh full stack development dengan mengintegrasikan frontend, backend, dengan database.  
Database berbasis **SQL** menggunakan **PostgreSQL** dengan bantuan framework **Prisma** di **JavaScript** (pada project ini menggunakan TypeScript).
