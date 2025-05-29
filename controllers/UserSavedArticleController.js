import UserSavedArticle from "../models/UserSavedArticleModel.js";
import Article from "../models/ArticleModel.js"; // Diperlukan untuk mengambil detail artikel

// Mendapatkan semua artikel yang disimpan oleh user tertentu
export const getSavedArticlesByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Mengambil userId dari parameter URL

    // Mencari semua entri di tabel user_saved_articles berdasarkan userId
    const savedArticles = await UserSavedArticle.findAll({
      where: {
        userId: userId,
      },
      // Menggabungkan (join) dengan model Article menggunakan alias yang didefinisikan di Relasi.js
      include: [{
        model: Article,
        as: 'savedArticleDetails', // PENTING: Gunakan alias yang sama dengan di `UserSavedArticle.belongsTo(Article, { as: 'savedArticleDetails' })`
        attributes: ['id', 'judul', 'deskripsi', 'gambar', 'link'] // Pilih atribut yang ingin ditampilkan
      }]
    });

    // Mengolah respons untuk menampilkan hanya detail artikel
    // Karena kita pakai alias 'savedArticleDetails' di include, objek Article akan ada di saved.savedArticleDetails
    // Tambahkan filter null/undefined untuk robustness
    const articlesData = savedArticles
      .filter(saved => saved.savedArticleDetails !== null) // Pastikan objek Article tidak null
      .map(saved => saved.savedArticleDetails); // Ambil objek Article melalui alias

    res.status(200).json(articlesData);
  } catch (error) {
    console.log(error.message); // Log pesan error lengkap ke konsol server
    res.status(500).json({ msg: "Internal Server Error" }); // Kirim respons error ke klien
  }
};

// Menyimpan artikel untuk user
export const saveArticleForUser = async (req, res) => {
  try {
    const { userId, articleId } = req.body; // userId dan articleId dikirimkan di body request

    // Memeriksa apakah artikel sudah tersimpan untuk user ini
    const existingEntry = await UserSavedArticle.findOne({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    if (existingEntry) {
      return res.status(409).json({ msg: "Article already saved by this user" }); // 409 Conflict
    }

    await UserSavedArticle.create({
      userId: userId,
      articleId: articleId,
    });
    res.status(201).json({ msg: "Article saved successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message }); // Mengirim pesan error validasi dari Sequelize
  }
};

// Menghapus artikel yang tersimpan untuk user
export const deleteSavedArticleForUser = async (req, res) => {
  try {
    const { userId, articleId } = req.params; // userId dan articleId dari parameter URL

    const result = await UserSavedArticle.destroy({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    if (result === 0) { // Jika tidak ada baris yang terhapus, berarti tidak ditemukan
      return res.status(404).json({ msg: "Saved article not found" });
    }

    res.status(200).json({ msg: "Saved article deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};