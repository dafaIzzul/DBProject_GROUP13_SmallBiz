# DBProject_GROUP13_Small-Business-Inventory-and-Sales-System
Project Kelompok Mata kuliah Database Ilmu Komputer Universitas Gadjah Mada

Kelompok 13
Nama Anggota:
1. Muhammad Dafa 'Izzul Iman A. (24/535342/PA/22711)
2. Ivan Zuhri Ramadhani Syahrial (24/540342/PA/22939)

# 📦 SmallBiz - Inventory Management System

**SmallBiz** adalah aplikasi berbasis web untuk manajemen inventaris dan *Point of Sales* (POS) yang dirancang untuk Usaha Kecil Menengah (UKM). Sistem ini membantu pemilik bisnis memantau stok secara real-time, mencatat transaksi penjualan, dan mengelola pembelian ke supplier dengan akurat.

## 🌟 Fitur Utama

* **Role-Based Access Control (RBAC):** Sistem login aman dengan pembagian peran (Admin, Manager, Cashier).
* **Real-time Inventory Tracking:** Status stok otomatis berubah warna (Hijau/Kuning/Merah) berdasarkan jumlah ketersediaan.
* **Point of Sales (POS):** Kasir dapat melakukan transaksi penjualan yang otomatis memotong stok database.
* **Restocking System:** Manager dapat mencatat pembelian barang masuk dari supplier.
* **Secure Authentication:** Menggunakan JSON Web Token (JWT) untuk keamanan sesi login.

## 🛠️ Teknologi yang Digunakan

* **Backend:** Node.js, Express.js
* **Database:** MySQL (Relational DB)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Auth:** JWT (JSON Web Token)

## 📸 Screenshots

*(Opsional: Anda bisa memasukkan gambar/screenshot aplikasi di sini nanti)*

| Login Page | Dashboard Inventory | Halaman Kasir |
| --- | --- | --- |
|  |  |  |

## 🚀 Cara Instalasi & Menjalankan (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda:

### 1. Prasyarat

Pastikan Anda sudah menginstal:

* [Node.js](https://nodejs.org/)
* MySQL (bisa via XAMPP atau MySQL Workbench)

### 2. Clone Repository

```bash
git clone https://github.com/username-anda/SmallBiz-Inventory.git
cd SmallBiz-Inventory

```

### 3. Setup Database

1. Buka phpMyAdmin atau MySQL Workbench.
2. Buat database baru dengan nama `smallbiz_db`.
3. Import file SQL yang ada di folder `database/schema.sql` (atau copy paste query SQL manual).

### 4. Konfigurasi Backend

1. Masuk ke folder backend dan install dependencies:
```bash
cd backend
npm install

```


2. Buka file `backend/config/database.js`.
3. Sesuaikan konfigurasi database dengan komputer Anda (terutama password database):
```javascript
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Ganti sesuai user mysql Anda
  password: '',      // Ganti sesuai password mysql Anda
  database: 'smallbiz_db'
});

```



### 5. Jalankan Aplikasi

1. **Jalankan Server (Backend):**
Di terminal folder backend, ketik:
```bash
npm start

```


*(Pastikan muncul pesan: Server running on port 3000)*
2. **Jalankan Frontend:**
* Buka folder `frontend` menggunakan VS Code.
* Buka file `login.html`.
* Klik kanan -> **Open with Live Server**.



## 🔑 Akun Demo (Default)

Gunakan akun berikut untuk mencoba sistem:

| Role | Username | Password | Akses Fitur |
| --- | --- | --- | --- |
| **Admin** | `admin` | `admin123` | Kelola User |
| **Manager** | `manager` | `manager123` | Inventaris, Pembelian |
| **Cashier** | `kasir` | `kasir123` | Transaksi Penjualan |

## 📂 Struktur Folder

```
/backend
  ├── config/       # Koneksi Database
  ├── controllers/  # Logika Bisnis
  ├── routes/       # API Endpoints
  └── server.js     # Entry Point
/frontend
  ├── assets/       # CSS & JS
  └── pages/        # Halaman HTML per Role

