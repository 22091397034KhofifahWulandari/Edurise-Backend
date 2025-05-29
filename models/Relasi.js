// models/Relasi.js
import db from "../config/Database.js";
import User from "./UserModel.js";
import OrangTua from "./OrtuModel.js";
import Portofolio from "./PortofolioModel.js";
import Article from "./ArticleModel.js";
import UserSavedArticle from "./UserSavedArticleModel.js";
import Beasiswa from "./BeasiswaModel.js";
import UserSavedBeasiswa from "./UserSavedBeasiswaModel.js";
import Kompetisi from "./KompetisiModel.js";
import UserSavedKompetisi from "./UserSavedKompetisiModel.js";
import KompetisiRegistrasi from "./KompetisiRegistrasiModel.js";
import Forum from "./ForumModel.js";
import UserSavedForum from "./UserSavedForumModel.js";
// IMPORT MODEL BARU
import Webinar from "./WebinarModel.js";
import WebinarPeserta from "./WebinarPesertaModel.js";


// ===================================
// RELASI MODEL
// ===================================

// Relasi User (One) - OrangTua (Many)
User.hasMany(OrangTua, { foreignKey: 'userId', as: 'parentsData' });
OrangTua.belongsTo(User, { foreignKey: 'userId', as: 'childUser' });

// Relasi User (One) - Portofolio (Many)
User.hasMany(Portofolio, { foreignKey: 'userId', as: 'portfolios' });
Portofolio.belongsTo(User, { foreignKey: 'userId', as: 'ownerUser' });

// Relasi User - Article - UserSavedArticle (Many-to-Many)
User.hasMany(UserSavedArticle, { foreignKey: 'userId', as: 'userArticleSaves' });
UserSavedArticle.belongsTo(User, { foreignKey: 'userId', as: 'saverUser' });
Article.hasMany(UserSavedArticle, { foreignKey: 'articleId', as: 'articleSaves' });
UserSavedArticle.belongsTo(Article, { foreignKey: 'articleId', as: 'savedArticle' });
User.belongsToMany(Article, {
  through: UserSavedArticle,
  foreignKey: 'userId',
  otherKey: 'articleId',
  as: 'savedArticles'
});
Article.belongsToMany(User, {
  through: UserSavedArticle,
  foreignKey: 'articleId',
  otherKey: 'userId',
  as: 'usersWhoSaved'
});

// Relasi User - Beasiswa - UserSavedBeasiswa (Many-to-Many)
User.hasMany(UserSavedBeasiswa, { foreignKey: 'userId', as: 'userBeasiswaSaves' });
UserSavedBeasiswa.belongsTo(User, { foreignKey: 'userId', as: 'beasiswaSaverUser' });
Beasiswa.hasMany(UserSavedBeasiswa, { foreignKey: 'beasiswaId', as: 'beasiswaSaves' });
UserSavedBeasiswa.belongsTo(Beasiswa, { foreignKey: 'beasiswaId', as: 'savedBeasiswa' });
User.belongsToMany(Beasiswa, {
  through: UserSavedBeasiswa,
  foreignKey: 'userId',
  otherKey: 'beasiswaId',
  as: 'savedBeasiswaList'
});
Beasiswa.belongsToMany(User, {
  through: UserSavedBeasiswa,
  foreignKey: 'beasiswaId',
  otherKey: 'userId',
  as: 'usersWhoSavedBeasiswa'
});

// Relasi User - Kompetisi - UserSavedKompetisi (Many-to-Many)
User.hasMany(UserSavedKompetisi, { foreignKey: 'userId', as: 'userKompetisiSaves' });
UserSavedKompetisi.belongsTo(User, { foreignKey: 'userId', as: 'kompetisiSaverUser' });
Kompetisi.hasMany(UserSavedKompetisi, { foreignKey: 'kompetisiId', as: 'kompetisiSaves' });
UserSavedKompetisi.belongsTo(Kompetisi, { foreignKey: 'kompetisiId', as: 'savedKompetisi' });
User.belongsToMany(Kompetisi, {
  through: UserSavedKompetisi,
  foreignKey: 'userId',
  otherKey: 'kompetisiId',
  as: 'savedKompetisiList'
});
Kompetisi.belongsToMany(User, {
  through: UserSavedKompetisi,
  foreignKey: 'kompetisiId',
  otherKey: 'userId',
  as: 'usersWhoSavedKompetisi'
});

// Relasi User - KompetisiRegistrasi (Many-to-Many via junction table)
User.hasMany(KompetisiRegistrasi, { foreignKey: 'userId', as: 'kompetisiRegistrations' });
KompetisiRegistrasi.belongsTo(User, { foreignKey: 'userId', as: 'registrantUser' });
Kompetisi.hasMany(KompetisiRegistrasi, { foreignKey: 'kompetisiId', as: 'kompetisiRegistrants' });
KompetisiRegistrasi.belongsTo(Kompetisi, { foreignKey: 'kompetisiId', as: 'registeredKompetisi' });
User.belongsToMany(Kompetisi, {
  through: KompetisiRegistrasi,
  foreignKey: 'userId',
  otherKey: 'kompetisiId',
  as: 'registeredKompetisiList'
});
Kompetisi.belongsToMany(User, {
  through: KompetisiRegistrasi,
  foreignKey: 'kompetisiId',
  otherKey: 'userId',
  as: 'registeredUsersList'
});

// Relasi User (One) - Forum (Many)
User.hasMany(Forum, { foreignKey: 'userId', as: 'createdForums' });
Forum.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Relasi User - Forum - UserSavedForum (Many-to-Many)
User.hasMany(UserSavedForum, { foreignKey: 'userId', as: 'userForumSaves' });
UserSavedForum.belongsTo(User, { foreignKey: 'userId', as: 'forumSaverUser' });
Forum.hasMany(UserSavedForum, { foreignKey: 'forumId', as: 'forumSaves' });
UserSavedForum.belongsTo(Forum, { foreignKey: 'forumId', as: 'savedForum' });
User.belongsToMany(Forum, {
  through: UserSavedForum,
  foreignKey: 'userId',
  otherKey: 'forumId',
  as: 'savedForumsList'
});
Forum.belongsToMany(User, {
  through: UserSavedForum,
  foreignKey: 'forumId',
  otherKey: 'userId',
  as: 'usersWhoSavedForum'
});


// --- RELASI BARU UNTUK WEBINAR ---

// Relasi Webinar (One) - WebinarPeserta (Many)
// Satu webinar bisa memiliki banyak pendaftar
Webinar.hasMany(WebinarPeserta, { foreignKey: 'webinarId', as: 'registrations' });
WebinarPeserta.belongsTo(Webinar, { foreignKey: 'webinarId', as: 'registeredWebinar' });

// Relasi User (One) - WebinarPeserta (Many) - Opsional, jika pendaftar adalah user yang login
// Seorang User bisa mendaftar banyak webinar
User.hasMany(WebinarPeserta, { foreignKey: 'userId', as: 'webinarRegistrations' });
WebinarPeserta.belongsTo(User, { foreignKey: 'userId', as: 'registrantUser' });


// ===================================
// EXPORT SEMUA MODEL
// ===================================
export {
  User,
  OrangTua,
  Portofolio,
  Article,
  UserSavedArticle,
  Beasiswa,
  UserSavedBeasiswa,
  Kompetisi,
  UserSavedKompetisi,
  KompetisiRegistrasi,
  Forum,
  UserSavedForum,
  // EXPORT MODEL BARU
  Webinar,
  WebinarPeserta
};