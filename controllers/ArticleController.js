// controllers/ArticleController.js
import Article from "../models/ArticleModel.js";
import { Op } from "sequelize"; // Impor Op untuk operasi pencarian

// Mendapatkan semua artikel (akses publik)
export const getArticles = async (req, res) => {
    try {
        const response = await Article.findAll({
            attributes: ['uuid', 'judul', 'deskripsi', 'gambar', 'link', 'penulis', 'kategori']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan artikel berdasarkan UUID (akses publik)
export const getArticleById = async (req, res) => {
    try {
        const response = await Article.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['uuid', 'judul', 'deskripsi', 'gambar', 'link', 'penulis', 'kategori']
        });
        if (!response) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan." });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Membuat artikel baru (khusus admin)
export const createArticle = async (req, res) => {
    const { judul, deskripsi, gambar, link, penulis, kategori } = req.body;
    try {
        await Article.create({
            judul: judul,
            deskripsi: deskripsi,
            gambar: gambar,
            link: link,
            penulis: penulis,
            kategori: kategori
        });
        res.status(201).json({ msg: "Artikel berhasil ditambahkan." });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Link artikel sudah ada." });
        }
        res.status(500).json({ msg: error.message });
    }
};

// Memperbarui artikel (khusus admin)
export const updateArticle = async (req, res) => {
    const article = await Article.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!article) {
        return res.status(404).json({ msg: "Artikel tidak ditemukan." });
    }

    const { judul, deskripsi, gambar, link, penulis, kategori } = req.body;
    try {
        await Article.update({
            judul: judul,
            deskripsi: deskripsi,
            gambar: gambar,
            link: link,
            penulis: penulis,
            kategori: kategori
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Artikel berhasil diperbarui." });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ msg: "Link artikel sudah ada." });
        }
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus artikel (khusus admin)
export const deleteArticle = async (req, res) => {
    const article = await Article.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!article) {
        return res.status(404).json({ msg: "Artikel tidak ditemukan." });
    }

    try {
        await Article.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Artikel berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};