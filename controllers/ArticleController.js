// controllers/ArticleController.js
import Article from "../models/ArticleModel.js";

// Mendapatkan semua Artikel
export const getArticles = async (req, res) => {
    try {
        const response = await Article.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Artikel berdasarkan ID
export const getArticleById = async (req, res) => {
    try {
        const response = await Article.findByPk(req.params.id);
        if (!response) {
            return res.status(404).json({ msg: "Article Not Found" });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Membuat Artikel baru
export const createArticle = async (req, res) => {
    // Sesuaikan dengan kolom yang ada di model Article Anda
    const { judul, deskripsi, gambar, link, penulis, kategori } = req.body;
    try {
        const validCategories = ['Beasiswa & Pendidikan', 'Pengembangan Diri & Karir', 'Tips Belajar & Produktivitas'];
        if (!validCategories.includes(kategori)) {
            return res.status(400).json({ msg: "Kategori tidak valid. Pilihan: Beasiswa & Pendidikan, Pengembangan Diri & Karir, Tips Belajar & Produktivitas" });
        }

        const newArticle = await Article.create({
            judul: judul,
            deskripsi: deskripsi,
            gambar: gambar,
            link: link,
            penulis: penulis, // Simpan data penulis
            kategori: kategori // Simpan data kategori
        });
        res.status(201).json({ msg: "Article Created", data: newArticle });
    } catch (error) {
        console.log(error.message);
        // Error ER_DUP_ENTRY untuk link yang unique, atau error validasi lainnya
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Link artikel sudah ada. Mohon gunakan link yang berbeda." });
        }
        res.status(400).json({ msg: error.message });
    }
};

// Memperbarui Artikel
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: "Article Not Found" });
        }

        // Sesuaikan dengan kolom yang ada di model Article Anda
        const { judul, deskripsi, gambar, link, penulis, kategori } = req.body;

        // Validasi kategori jika disertakan dalam update
        if (kategori && !['Beasiswa & Pendidikan', 'Pengembangan Diri & Karir', 'Tips Belajar & Produktivitas'].includes(kategori)) {
            return res.status(400).json({ msg: "Kategori tidak valid. Pilihan: Beasiswa & Pendidikan, Pengembangan Diri & Karir, Tips Belajar & Produktivitas" });
        }

        await Article.update({
            judul: judul,
            deskripsi: deskripsi,
            gambar: gambar,
            link: link,
            penulis: penulis, // Update data penulis
            kategori: kategori // Update data kategori
        }, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Article Updated" });
    } catch (error) {
        console.log(error.message);
         // Error ER_DUP_ENTRY untuk link yang unique
         if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Link artikel sudah ada. Mohon gunakan link yang berbeda." });
        }
        res.status(400).json({ msg: error.message });
    }
};

// Menghapus Artikel
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: "Article Not Found" });
        }

        await Article.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Article Deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};