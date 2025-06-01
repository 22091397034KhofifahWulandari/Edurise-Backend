// models/index.js
import db from '../config/Database.js';

// --- Import Semua Model ---
import UserModel from "./UserModel.js";
import OrangTuaModel from "./OrangTuaModel.js";
import PortofolioModel from "./PortofolioModel.js"; // Import PortofolioModel
// ... (import model-model lain yang sudah ada) ...
import BeasiswaModel from "./BeasiswaModel.js";
import UserSavedBeasiswaModel from "./UserSavedBeasiswaModel.js";
import ArticleModel from "./ArticleModel.js";
import UserSavedArticleModel from "./UserSavedArticleModel.js";
import ForumModel from "./ForumModel.js";
import UserSavedForumModel from "./UserSavedForumModel.js";
import ForumParticipantModel from "./ForumParticipantModel.js";
import KompetisiModel from "./KompetisiModel.js";
import KompetisiRegistrasiModel from "./KompetisiRegistrasiModel.js";
import UserSavedKompetisiModel from "./UserSavedKompetisiModel.js";


// --- DEFINISI SEMUA RELASI ---

// Relasi One-to-One: User dan OrangTua
// Asumsi ini sesuai dengan revisi terakhir Anda untuk OrangTua
UserModel.hasOne(OrangTuaModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    as: 'dataOrangTua'
});
OrangTuaModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

// Relasi One-to-Many: User dan Portofolio
// Setiap User bisa memiliki BANYAK Portofolio
UserModel.hasMany(PortofolioModel, {
    foreignKey: 'userId', // userId di tabel `portofolios` akan menunjuk ke `id` di tabel `users`
    onDelete: 'CASCADE',  // Jika user dihapus, semua portofolionya juga dihapus
    as: 'portofolios'     // Alias untuk eager loading: user.getPortofolios()
});
PortofolioModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'            // Alias untuk eager loading: portofolio.getUser()
});

// --- Relasi Lain yang Sudah Ada (Pastikan tetap ada dan tidak berubah) ---
// ... (relasi Many-to-Many untuk Beasiswa, Artikel, Forum, Kompetisi, dll.) ...
// Relasi Many-to-Many untuk Beasiswa yang Disimpan User
UserModel.belongsToMany(BeasiswaModel, { through: UserSavedBeasiswaModel, foreignKey: 'userId', otherKey: 'beasiswaId', as: 'savedBeasiswa' });
BeasiswaModel.belongsToMany(UserModel, { through: UserSavedBeasiswaModel, foreignKey: 'beasiswaId', otherKey: 'userId', as: 'savedByUsers' });
UserSavedBeasiswaModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserSavedBeasiswaModel.belongsTo(BeasiswaModel, { foreignKey: 'beasiswaId' });

// Relasi Many-to-Many untuk Artikel yang Disimpan User
UserModel.belongsToMany(ArticleModel, { through: UserSavedArticleModel, foreignKey: 'userId', otherKey: 'articleId', as: 'savedArticles' });
ArticleModel.belongsToMany(UserModel, { through: UserSavedArticleModel, foreignKey: 'articleId', otherKey: 'userId', as: 'savedByUsers' });
UserSavedArticleModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserSavedArticleModel.belongsTo(ArticleModel, { foreignKey: 'articleId' });

// Relasi One-to-Many: User (Creator) dan Forum
UserModel.hasMany(ForumModel, { foreignKey: 'userId', as: 'createdForums' });
ForumModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'creator' });

// Relasi Many-to-Many untuk Forum yang Disimpan User
UserModel.belongsToMany(ForumModel, { through: UserSavedForumModel, foreignKey: 'userId', otherKey: 'forumId', as: 'savedForums' });
ForumModel.belongsToMany(UserModel, { through: UserSavedForumModel, foreignKey: 'forumId', otherKey: 'userId', as: 'savedByUsers' });
UserSavedForumModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserSavedForumModel.belongsTo(ForumModel, { foreignKey: 'forumId' });

// Relasi Many-to-Many untuk Anggota Forum (User Join Forum)
UserModel.belongsToMany(ForumModel, { through: ForumParticipantModel, foreignKey: 'userId', otherKey: 'forumId', as: 'joinedForums' });
ForumModel.belongsToMany(UserModel, { through: ForumParticipantModel, foreignKey: 'forumId', otherKey: 'userId', as: 'participants' });
ForumParticipantModel.belongsTo(UserModel, { foreignKey: 'userId' });
ForumParticipantModel.belongsTo(ForumModel, { foreignKey: 'forumId' });

// --- RELASI UNTUK KOMPETISI ---
UserModel.belongsToMany(KompetisiModel, { through: KompetisiRegistrasiModel, foreignKey: 'userId', otherKey: 'kompetisiId', as: 'registeredKompetisis' });
KompetisiModel.belongsToMany(UserModel, { through: KompetisiRegistrasiModel, foreignKey: 'kompetisiId', otherKey: 'userId', as: 'registrants' });
KompetisiRegistrasiModel.belongsTo(UserModel, { foreignKey: 'userId' });
KompetisiRegistrasiModel.belongsTo(KompetisiModel, { foreignKey: 'kompetisiId' });

// --- RELASI UNTUK KOMPETISI YANG DISIMPAN USER ---
UserModel.belongsToMany(KompetisiModel, { through: UserSavedKompetisiModel, foreignKey: 'userId', otherKey: 'kompetisiId', as: 'savedKompetisis' });
KompetisiModel.belongsToMany(UserModel, { through: UserSavedKompetisiModel, foreignKey: 'kompetisiId', otherKey: 'userId', as: 'savedByUsersKompetisi' });
UserSavedKompetisiModel.belongsTo(UserModel, { foreignKey: 'userId' });
UserSavedKompetisiModel.belongsTo(KompetisiModel, { foreignKey: 'kompetisiId' });


// --- Export Semua Model ---
export {
    UserModel,
    OrangTuaModel,
    PortofolioModel, // Pastikan diekspor
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
};