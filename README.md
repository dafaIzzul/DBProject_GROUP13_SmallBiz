# DBProject_GROUP13_Small-Business-Inventory-and-Sales-System
Project Kelompok Mata kuliah Database Ilmu Komputer Universitas Gadjah Mada

Kelompok 13
Nama Anggota:
1. Muhammad Dafa 'Izzul Iman A. (24/535342/PA/22711)
2. Ivan Zuhri Ramadhani Syahrial (24/540342/PA/22939)

### Apa itu `README.md`?

**README.md** adalah file teks dengan format *Markdown* (itu sebabnya berakhiran `.md`) yang akan ditampilkan secara otomatis di halaman depan repository GitHub Anda.

**Fungsinya adalah:**

1. **Identitas:** Memberi tahu orang lain (atau rekruter) apa nama proyek ini.
2. **Instruksi:** Memberi tahu cara menginstal dan menjalankan program di komputer mereka.
3. **Dokumentasi:** Menjelaskan fitur-fitur utama dan teknologi yang digunakan.
4. **Portfolio:** Bagi mahasiswa/developer, README yang rapi menunjukkan profesionalisme.

---

### Isi README untuk Proyek SmallBiz

Karena saya sudah tahu detail proyek Anda, saya telah membuatkan **Template README** yang lengkap. Anda tinggal membuat file bernama `README.md` (huruf besar semua), lalu **Copy-Paste** isi di bawah ini ke dalamnya.

---

## (Copy dari sini ke bawah)

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

```

## 📄 Laporan Proyek

Laporan lengkap mengenai analisis, perancangan, dan hasil pengujian sistem ini dapat dilihat pada file [Final_Report_SmallBiz.docx](https://www.google.com/search?q=./Final_Report_SmallBiz.docx) yang disertakan dalam repository ini.

---

**Dibuat oleh:** [Nama Kelompok/Nama Anda]

---

## (Akhir Copy)

### Tips Tambahan untuk GitHub:

1. **Screenshots:** Agar bagian "Screenshots" di atas berfungsi, Anda perlu mengambil *screenshot* aplikasi Anda (Login, Inventory, Kasir), simpan gambar tersebut dalam folder baru di proyek Anda (misalnya folder `screenshots/`), lalu ganti tulisan `path/to/image1.png` dengan lokasi gambar yang sebenarnya, misal `screenshots/login.png`.
2. **Upload Laporan:** Pastikan file `.docx` laporan Anda juga ikut di-upload ke GitHub agar link di bagian bawah README berfungsi.

Dengan README seperti ini, repositori Anda akan terlihat sangat profesional dan siapa pun (termasuk dosen) akan mudah menilai pekerjaan Anda!
