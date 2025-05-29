// index.js (Yang sudah diperbarui)
import express from "express";
import cors from "cors";
import db from "./config/Database.js";

// ---- PENTING: IMPORT SEMUA MODEL DULU ----
import User from "./models/UserModel.js";
import OrangTua from "./models/OrtuModel.js";
import Portofolio from "./models/PortofolioModel.js";
import Article from "./models/ArticleModel.js";
import UserSavedArticle from "./models/UserSavedArticleModel.js";
import Beasiswa from "./models/BeasiswaModel.js";
import UserSavedBeasiswa from "./models/UserSavedBeasiswaModel.js";
// --- Tambahkan Model Baru ---
import Kompetisi from "./models/KompetisiModel.js";
import UserSavedKompetisi from "./models/UserSavedKompetisiModel.js";
import KompetisiRegistrasi from "./models/KompetisiRegistrasiModel.js";
// --- PENAMBAHAN BARU: Model Forum dan UserSavedForum ---
import Forum from "./models/ForumModel.js";
import UserSavedForum from "./models/UserSavedForumModel.js";
// --- PENAMBAHAN BARU: Model Webinar dan WebinarPeserta ---
import Webinar from "./models/WebinarModel.js";
import WebinarPeserta from "./models/WebinarPesertaModel.js";
// ------------------------------------------

// ---- BARU IMPORT FILE RELASI ----
import "./models/Relasi.js";
// ---------------------------------

// Import routes
import UserRoute from "./routes/UserRoute.js";
import OrtuRoute from "./routes/OrtuRoute.js";
import PortofolioRoute from "./routes/PortofolioRoute.js";
import ArticleRoute from "./routes/ArticleRoute.js";
import UserSavedArticleRoute from "./routes/UserSavedArticleRoute.js";
import BeasiswaRoute from "./routes/BeasiswaRoute.js";
import UserSavedBeasiswaRoute from "./routes/UserSavedBeasiswaRoute.js";
// --- Tambahkan Route Baru ---
import KompetisiRoute from "./routes/KompetisiRoute.js";
import UserSavedKompetisiRoute from "./routes/UserSavedKompetisiRoute.js";
import KompetisiRegistrasiRoute from "./routes/KompetisiRegistrasiRoute.js";
// --- PENAMBAHAN BARU: Route Forum dan UserSavedForum ---
import ForumRoute from "./routes/ForumRoute.js";
import UserSavedForumRoute from "./routes/UserSavedForumRoute.js";
// --- PENAMBAHAN BARU: Route Webinar dan WebinarPeserta ---
import WebinarRoute from "./routes/WebinarRoute.js";
import WebinarPesertaRoute from "./routes/WebinarPesertaRoute.js";
// ----------------------------

const app = express();
app.use(cors());
app.use(express.json());

app.use(UserRoute);
app.use(OrtuRoute);
app.use(PortofolioRoute);
app.use(ArticleRoute);
app.use(UserSavedArticleRoute);
app.use(BeasiswaRoute);
app.use(UserSavedBeasiswaRoute);
// --- Gunakan Route Baru ---
app.use(KompetisiRoute);
app.use(UserSavedKompetisiRoute);
app.use(KompetisiRegistrasiRoute);
// --- PENAMBAHAN BARU: Gunakan Route Forum dan UserSavedForum ---
app.use(ForumRoute);
app.use(UserSavedForumRoute);
// --- PENAMBAHAN BARU: Gunakan Route Webinar dan WebinarPeserta ---
app.use(WebinarRoute);
app.use(WebinarPesertaRoute);
// --------------------------

(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        
        // --- PENTING: SINKRONISASI DATABASE (Telah selesai atau tidak aktif) ---
        // Baris ini digunakan untuk:
        // 1. Membuat tabel baru yang belum ada di database berdasarkan definisi model.
        // 2. Mengubah (alter) tabel yang sudah ada agar sesuai dengan perubahan pada definisi model.
        // 
        // Setelah tabel terbentuk di database pada pengembangan awal, SANGAT disarankan untuk
        // mengomentari baris ini untuk mencegah perubahan skema yang tidak diinginkan dan
        // potensi kehilangan data, terutama di lingkungan produksi.
        // Jika Anda perlu memperbarui skema di masa depan, pertimbangkan untuk menggunakan migrasi Sequelize.
        // await db.sync({ alter: true }); // <--- BARIS INI DIKOMENTARI KEMBALI
        
        console.log('Database & tables synced!'); // Pesan ini akan tetap tercetak jika tidak ada error koneksi
    } catch (error) {
        console.error('Error connecting or syncing database:', error);
    }
})();

app.listen(5000, () => console.log('server up and running on port 5000...'));