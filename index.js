// index.js (atau app.js - file utama aplikasi Node.js Express Anda)

import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"; // Middleware untuk mengelola unggahan file
import path from "path"; // Untuk bekerja dengan path file dan direktori
import { fileURLToPath } from 'url'; // Untuk mendapatkan __filename dan __dirname di ES Modules

// --- Import Semua Model (dari models/index.js) ---
// Ini mengimpor semua model yang diekspor dari file models/index.js Anda.
// Pastikan models/index.js mengekspor semua model yang relevan.
import {
    UserModel,
    OrangTuaModel,
    PortofolioModel,
    BeasiswaModel,
    UserSavedBeasiswaModel,
    ArticleModel,
    UserSavedArticleModel,
    ForumModel,
    UserSavedForumModel,
    ForumParticipantModel,
    KompetisiModel,
    KompetisiRegistrasiModel,
    UserSavedKompetisiModel
} from "./models/index.js";

// --- Import Semua Route yang diperlukan ---
// Pastikan setiap file route sudah Anda buat dan diekspor dengan benar.
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import UserProfileRoutes from "./routes/UserProfileRoutes.js";
import OrangTuaRoutes from "./routes/OrangTuaRoutes.js";
import PortofolioRoutes from "./routes/PortofolioRoutes.js";
import BeasiswaRoute from "./routes/BeasiswaRoute.js";
import ArticleRoute from "./routes/ArticleRoute.js";
import UserSavedBeasiswaRoutes from "./routes/UserSavedBeasiswaRoutes.js";
import UserSavedArticleRoutes from "./routes/UserSavedArticleRoutes.js";
import ForumRoute from "./routes/ForumRoutes.js";
import UserSavedForumRoutes from "./routes/UserSavedForumRoutes.js";
import ForumParticipantRoutes from "./routes/ForumParticipantRoutes.js";
import KompetisiRoute from "./routes/KompetisiRoute.js";
import KompetisiRegistrasiRoutes from "./routes/KompetisiRegistrasiRoutes.js";
import UserSavedKompetisiRoutes from "./routes/UserSavedKompetisiRoutes.js";


// Muat variabel lingkungan dari file .env
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Konfigurasi __filename dan __dirname untuk kompatibilitas ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi Sequelize Store untuk menyimpan sesi di database
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// --- Sinkronisasi Database ---
// Bagian ini akan membuat atau memperbarui tabel di database Anda berdasarkan definisi model.
// Sangat penting untuk memahami bahwa `alter: true` akan mencoba membuat perubahan non-destruktif
// pada skema tabel yang ada. Di produksi, Anda mungkin ingin menggunakan migrasi Sequelize CLI
// untuk kontrol yang lebih baik terhadap perubahan skema.
(async () => {
    try {
        await db.authenticate(); // Tes koneksi database
        console.log('Database Connected...');

        // Sinkronkan model dengan database.
        // `alter: true` akan mencoba mengubah tabel yang ada agar sesuai dengan model.
        // HANYA GUNAKAN INI DI LINGKUNGAN PENGEMBANGAN/TESTING.
        // Untuk produksi, lebih disarankan menggunakan Sequelize Migrations.
        // await db.sync({ alter: true }); // Mengubah tabel yang ada agar sesuai dengan model
        // Jika Anda ingin DROP dan CREATE ulang tabel setiap kali server berjalan (HANYA UNTUK DEVELOPMENT BARU)
        // await db.sync({ force: true });
        console.log('Database Synced!');
    } catch (error) {
        console.error('Database Sync Error:', error);
    }
})();

// --- Middleware Global ---

// Konfigurasi Express Session
app.use(session({
    secret: process.env.SESS_SECRET, // String rahasia untuk menandatangani session ID cookie
    resave: false,                   // Jangan menyimpan session kembali jika tidak ada perubahan
    saveUninitialized: true,         // Simpan session baru yang belum diinisialisasi
    store: store,                    // Gunakan store Sequelize untuk menyimpan session
    cookie: {
        secure: 'auto',              // Set `true` untuk HTTPS, `false` untuk HTTP. 'auto' akan mendeteksi.
        // maxAge: 1000 * 60 * 60 * 24 // Contoh: 1 hari
    }
}));

// Konfigurasi CORS (Cross-Origin Resource Sharing)
// Mengizinkan permintaan dari origin tertentu (frontend Anda)
app.use(cors({
    credentials: true, // Izinkan pengiriman cookie lintas origin
    origin: process.env.FRONTEND_URL || 'http://localhost:3000' // Origin frontend Anda
}));

// Middleware untuk parsing body JSON dari request
app.use(express.json());

// Middleware untuk parsing cookie dari request
app.use(cookieParser());

// Middleware untuk menangani unggahan file (express-fileupload)
// Penting: Tempatkan ini sebelum rute yang akan menangani unggahan file
app.use(fileUpload());

// Middleware untuk melayani file statis dari folder 'public'
// Ini memungkinkan file yang diunggah (misalnya PDF portofolio) dapat diakses melalui URL
app.use(express.static(path.join(__dirname, 'public')));


// --- Urutan Routes ---
// Urutan penambahan rute terkadang penting untuk menghindari konflik atau rute yang tidak terjangkau.
// Umumnya, rute yang lebih spesifik atau yang perlu diproses lebih dulu diletakkan di atas.

// Rute terkait otentikasi (login, logout, session check) biasanya di awal
app.use(AuthRoute);

// Rute untuk operasi simpan (saved items)
// Ini sering kali memiliki prefix atau struktur yang berbeda, jadi bisa ditempatkan di sini
app.use(UserSavedArticleRoutes);
app.use(UserSavedBeasiswaRoutes);
app.use(UserSavedForumRoutes);
app.use(ForumParticipantRoutes); // Rute untuk partisipan forum
app.use(UserSavedKompetisiRoutes);
app.use(KompetisiRegistrasiRoutes);

// Rute untuk data profil dan data terkait (seringkali one-to-one atau one-to-many spesifik user)
app.use(UserProfileRoutes);
app.use(OrangTuaRoutes);
app.use(PortofolioRoutes); // Rute Portofolio Anda

// Rute untuk entitas utama (User, Beasiswa, Artikel, Forum, Kompetisi)
// Ini cenderung rute yang lebih umum atau yang mencakup GET all, GET by ID, dll.
app.use(UserRoute);
app.use(BeasiswaRoute);
app.use(ArticleRoute);
app.use(ForumRoute);
app.use(KompetisiRoute);


// --- Mulai Server ---
app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running on port ${process.env.APP_PORT}...`);
});