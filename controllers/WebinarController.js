// controllers/WebinarController.js
import Webinar from "../models/WebinarModel.js";
import WebinarPeserta from "../models/WebinarPesertaModel.js";
import { Op } from "sequelize";

// Membuat Webinar Baru (mendukung single atau bulk)
export const createWebinar = async (req, res) => {
    try {
        let newWebinars;
        const isBulk = Array.isArray(req.body);
        const webinarDataArray = isBulk ? req.body : [req.body];

        const processedWebinars = webinarDataArray.map(data => {
            const { judul, deskripsi, tanggal, jam_pelaksanaan, narasumber, penyedia_acara, poster, link_zoom } = data;
            if (!judul || !deskripsi || !tanggal || !jam_pelaksanaan || !narasumber || !penyedia_acara) {
                throw new Error("Missing required fields for one or more webinar entries (judul, deskripsi, tanggal, jam_pelaksanaan, narasumber, penyedia_acara).");
            }
            return {
                ...data,
                status: data.status || 'upcoming' // Set default status 'upcoming' jika tidak disediakan
            };
        });

        if (isBulk) {
            newWebinars = await Webinar.bulkCreate(processedWebinars, { validate: true });
            res.status(201).json({ msg: `${newWebinars.length} Webinars created successfully`, webinars: newWebinars });
        } else {
            newWebinars = await Webinar.create(processedWebinars[0]);
            res.status(201).json({ msg: "Webinar created successfully", webinar: newWebinars });
        }
    } catch (error) {
        console.error("Error creating webinar:", error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(400).json({ msg: error.message });
    }
};

// Mendapatkan Semua Webinar
export const getAllWebinars = async (req, res) => {
    try {
        const webinars = await Webinar.findAll({
            order: [['tanggal', 'ASC'], ['jam_pelaksanaan', 'ASC']]
        });
        res.status(200).json(webinars);
    } catch (error) {
        console.error("Error fetching all webinars:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mendapatkan Webinar Berdasarkan ID
export const getWebinarById = async (req, res) => {
    try {
        const webinar = await Webinar.findByPk(req.params.id);
        if (!webinar) {
            return res.status(404).json({ msg: "Webinar not found" });
        }
        res.status(200).json(webinar);
    } catch (error) {
        console.error("Error fetching webinar by ID:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Mengupdate Webinar
export const updateWebinar = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            judul, deskripsi, tanggal, jam_pelaksanaan, narasumber,
            link_zoom, rekaman_url, sertifikat_url, penyedia_acara,
            poster, status // Tambahkan status agar bisa diupdate
        } = req.body;

        const webinar = await Webinar.findByPk(id);
        if (!webinar) {
            return res.status(404).json({ msg: "Webinar not found" });
        }

        const updateData = {};
        if (judul !== undefined) updateData.judul = judul;
        if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
        if (tanggal !== undefined) updateData.tanggal = tanggal;
        if (jam_pelaksanaan !== undefined) updateData.jam_pelaksanaan = jam_pelaksanaan;
        if (narasumber !== undefined) updateData.narasumber = narasumber;
        if (link_zoom !== undefined) updateData.link_zoom = link_zoom;
        if (rekaman_url !== undefined) updateData.rekaman_url = rekaman_url;
        if (sertifikat_url !== undefined) updateData.sertifikat_url = sertifikat_url;
        if (penyedia_acara !== undefined) updateData.penyedia_acara = penyedia_acara;
        if (poster !== undefined) updateData.poster = poster;
        if (status !== undefined) updateData.status = status; // Izinkan update status

        await webinar.update(updateData);
        res.status(200).json({ msg: "Webinar updated successfully", webinar: webinar });
    } catch (error) {
        console.error("Error updating webinar:", error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ msg: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Menghapus Webinar
export const deleteWebinar = async (req, res) => {
    try {
        const { id } = req.params;
        const webinar = await Webinar.findByPk(id);
        if (!webinar) {
            return res.status(404).json({ msg: "Webinar not found" });
        }

        // Hapus juga semua pendaftar terkait webinar ini (opsional, tergantung logic Anda)
        // Disarankan untuk menghapus pendaftar terlebih dahulu jika ada foreign key constraint
        await WebinarPeserta.destroy({ where: { webinarId: id } });

        await webinar.destroy();
        res.status(200).json({ msg: "Webinar deleted successfully" });
    } catch (error) {
        console.error("Error deleting webinar:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};