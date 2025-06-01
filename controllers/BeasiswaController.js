import BeasiswaModel from "../models/BeasiswaModel.js"; // Pastikan nama import sesuai dengan model Anda

// --- MENDAPATKAN SEMUA BEASISWA (Dapat Diakses Umum/User Biasa) ---
export const getBeasiswa = async (req, res) => {
    try {
        const response = await BeasiswaModel.findAll({
            // Anda bisa menyertakan atribut tertentu jika tidak ingin semua data beasiswa ditampilkan
            // attributes: ['uuid', 'title', 'description', ...]
            // Jika Anda ingin menyertakan informasi admin yang memposting,
            // Anda bisa tambahkan 'include' di sini, setelah Anda mendefinisikan relasinya
            // Misalnya: include: [{ model: UserModel, as: 'postedBy', attributes: ['uuid', 'name'] }]
            // Ini jika Anda memutuskan untuk memiliki kolom 'adminId' di BeasiswaModel yang merujuk ke UserModel
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getBeasiswa:", error);
        res.status(500).json({ msg: error.message });
    }
};

// --- MENDAPATKAN BEASISWA BERDASARKAN ID (Dapat Diakses Umum/User Biasa) ---
export const getBeasiswaById = async (req, res) => {
    try {
        const response = await BeasiswaModel.findOne({
            where: {
                uuid: req.params.id // Mencari berdasarkan UUID beasiswa
            },
            // Anda juga bisa menyertakan informasi admin yang memposting di sini
            // include: [{ model: UserModel, as: 'postedBy', attributes: ['uuid', 'name'] }]
        });

        if (!response) {
            return res.status(404).json({ msg: "Beasiswa tidak ditemukan" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getBeasiswaById:", error);
        res.status(500).json({ msg: error.message });
    }
};

// --- MEMBUAT BEASISWA BARU (Hanya Admin) ---
export const createBeasiswa = async (req, res) => {
    // Pastikan ada middleware autentikasi/otorisasi sebelum controller ini
    // untuk memverifikasi bahwa req.user.role adalah 'admin'
    // Contoh: if (req.user.role !== 'admin') return res.status(403).json({ msg: "Akses ditolak" });

    const { img, title, description, detail, kategori, jenjang, lokasi, deadline } = req.body;

    // Validasi input dasar
    if (!title || !description || !detail || !kategori || !jenjang || !lokasi || !deadline) {
        return res.status(400).json({ msg: "Semua kolom wajib diisi" });
    }

    try {
        await BeasiswaModel.create({
            img: img, // Jika img adalah URL atau path
            title: title,
            description: description,
            detail: detail,
            kategori: kategori,
            jenjang: jenjang,
            lokasi: lokasi,
            deadline: deadline
            // Jika Anda memiliki kolom 'adminId' atau 'postedById' di BeasiswaModel,
            // tambahkan di sini: adminId: req.user.id
        });
        res.status(201).json({ msg: "Beasiswa berhasil ditambahkan" });
    } catch (error) {
        console.error("Error in createBeasiswa:", error);
        res.status(400).json({ msg: error.message });
    }
};

// --- MEMPERBARUI BEASISWA (Hanya Admin) ---
export const updateBeasiswa = async (req, res) => {
    // Pastikan ada middleware autentikasi/otorisasi untuk admin
    const beasiswa = await BeasiswaModel.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if (!beasiswa) {
        return res.status(404).json({ msg: "Beasiswa tidak ditemukan" });
    }

    const { img, title, description, detail, kategori, jenjang, lokasi, deadline } = req.body;

    // Validasi input dasar
    if (!title || !description || !detail || !kategori || !jenjang || !lokasi || !deadline) {
        return res.status(400).json({ msg: "Semua kolom wajib diisi" });
    }

    try {
        await BeasiswaModel.update({
            img: img,
            title: title,
            description: description,
            detail: detail,
            kategori: kategori,
            jenjang: jenjang,
            lokasi: lokasi,
            deadline: deadline
        }, {
            where: {
                id: beasiswa.id // Gunakan primary key 'id' untuk update
            }
        });
        res.status(200).json({ msg: "Beasiswa berhasil diperbarui" });
    } catch (error) {
        console.error("Error in updateBeasiswa:", error);
        res.status(400).json({ msg: error.message });
    }
};

// --- MENGHAPUS BEASISWA (Hanya Admin) ---
export const deleteBeasiswa = async (req, res) => {
    // Pastikan ada middleware autentikasi/otorisasi untuk admin
    const beasiswa = await BeasiswaModel.findOne({
        where: {
            uuid: req.params.id
        }
    });

    if (!beasiswa) {
        return res.status(404).json({ msg: "Beasiswa tidak ditemukan" });
    }

    try {
        await BeasiswaModel.destroy({
            where: {
                id: beasiswa.id // Gunakan primary key 'id' untuk delete
            }
        });
        res.status(200).json({ msg: "Beasiswa berhasil dihapus" });
    } catch (error) {
        console.error("Error in deleteBeasiswa:", error);
        res.status(400).json({ msg: error.message });
    }
};