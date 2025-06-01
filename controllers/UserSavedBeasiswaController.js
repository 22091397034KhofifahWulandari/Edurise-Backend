import UserModel from "../models/UserModel.js";
import BeasiswaModel from "../models/BeasiswaModel.js";
import UserSavedBeasiswaModel from "../models/UserSavedBeasiswaModel.js"; // Model tabel perantara

// --- MENDAPATKAN SEMUA BEASISWA YANG DISIMPAN OLEH USER ---
export const getSavedBeasiswaByUser = async (req, res) => {
    // Asumsi: Anda memiliki middleware yang mengidentifikasi user yang sedang login
    // dan menyimpan ID user di req.userId (atau req.user.id)
    const userId = req.userId; // Dapatkan ID user dari middleware autentikasi/sesi

    if (!userId) {
        return res.status(401).json({ msg: "Autentikasi diperlukan." });
    }

    try {
        const user = await UserModel.findOne({
            where: { id: userId }, // Cari user berdasarkan ID primary key
            attributes: ['uuid', 'name', 'email'], // Ambil atribut user yang relevan
            include: [{
                model: BeasiswaModel,
                as: 'savedBeasiswa', // Sesuai dengan alias di UserSavedBeasiswaModel
                through: { attributes: [] }, // Jangan sertakan kolom dari tabel perantara di respons
                attributes: ['uuid', 'title', 'description', 'img', 'kategori', 'jenjang', 'lokasi', 'deadline'] // Ambil atribut beasiswa yang relevan
            }]
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        res.status(200).json(user.savedBeasiswa); // Mengirimkan array beasiswa yang disimpan
    } catch (error) {
        console.error("Error in getSavedBeasiswaByUser:", error);
        res.status(500).json({ msg: error.message });
    }
};

// --- MENYIMPAN BEASISWA KE PROFIL USER ---
export const saveBeasiswaToProfile = async (req, res) => {
    // Asumsi: req.userId tersedia dari middleware autentikasi
    const userId = req.userId;
    const { beasiswaId } = req.body; // Menerima UUID beasiswa dari frontend

    if (!userId) {
        return res.status(401).json({ msg: "Autentikasi diperlukan." });
    }
    if (!beasiswaId) {
        return res.status(400).json({ msg: "ID Beasiswa diperlukan." });
    }

    try {
        // Cari user yang sedang login (menggunakan primary key ID)
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        // Cari beasiswa yang ingin disimpan (menggunakan UUID)
        const beasiswa = await BeasiswaModel.findOne({ where: { uuid: beasiswaId } });
        if (!beasiswa) {
            return res.status(404).json({ msg: "Beasiswa tidak ditemukan." });
        }

        // Cek apakah beasiswa sudah disimpan oleh user ini
        const existingSave = await UserSavedBeasiswaModel.findOne({
            where: {
                userId: user.id,     // Menggunakan ID primary key dari user
                beasiswaId: beasiswa.id // Menggunakan ID primary key dari beasiswa
            }
        });

        if (existingSave) {
            return res.status(409).json({ msg: "Beasiswa ini sudah tersimpan di profil Anda." });
        }

        // Buat entri baru di tabel perantara
        await UserSavedBeasiswaModel.create({
            userId: user.id,
            beasiswaId: beasiswa.id
            // 'savedAt' akan otomatis terisi karena ada defaultValue: DataTypes.NOW
        });

        res.status(201).json({ msg: "Beasiswa berhasil disimpan di profil Anda." });
    } catch (error) {
        console.error("Error in saveBeasiswaToProfile:", error);
        // Error kode 23505 (PostgreSQL) atau 1062 (MySQL) menunjukkan duplikasi entry unique index
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ msg: "Beasiswa ini sudah tersimpan di profil Anda." });
        }
        res.status(500).json({ msg: error.message });
    }
};

// --- MENGHAPUS BEASISWA DARI PROFIL USER ---
export const removeSavedBeasiswaFromProfile = async (req, res) => {
    // Asumsi: req.userId tersedia dari middleware autentikasi
    const userId = req.userId;
    const { beasiswaId } = req.params; // Menerima UUID beasiswa dari URL params

    if (!userId) {
        return res.status(401).json({ msg: "Autentikasi diperlukan." });
    }
    if (!beasiswaId) {
        return res.status(400).json({ msg: "ID Beasiswa diperlukan." });
    }

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        const beasiswa = await BeasiswaModel.findOne({ where: { uuid: beasiswaId } });
        if (!beasiswa) {
            return res.status(404).json({ msg: "Beasiswa tidak ditemukan." });
        }

        // Hapus entri dari tabel perantara
        const deletedRows = await UserSavedBeasiswaModel.destroy({
            where: {
                userId: user.id,
                beasiswaId: beasiswa.id
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ msg: "Beasiswa tidak ditemukan di daftar simpanan Anda." });
        }

        res.status(200).json({ msg: "Beasiswa berhasil dihapus dari profil Anda." });
    } catch (error) {
        console.error("Error in removeSavedBeasiswaFromProfile:", error);
        res.status(500).json({ msg: error.message });
    }
};