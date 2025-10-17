import mysql from "mysql2/promise";

// Buat koneksi pool (lebih efisien untuk banyak request)
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "data" // pastikan database 'data' SUDAH ADA di MySQL
});

// Fungsi pembantu
export const dbService = {
  // ================= USERS =================
  async readUsers() {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  },

  async writeUsers(data) {
    // Biasanya tidak direkomendasikan di SQL, tapi kalau ingin replace semua data:
    await db.query("DELETE FROM users");
    for (const user of data) {
      await db.query(
        "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
        [user.id, user.username, user.password]
      );
    }
  },

  // ================= ITEMS =================
  async readItems() {
    const [rows] = await db.query("SELECT * FROM items");
    return rows;
  },

  async writeItems(data) {
    await db.query("DELETE FROM items");
    for (const item of data) {
      await db.query(
        "INSERT INTO items (id, namaItem, quantity, keterangan, hargaSatuan, stok) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.id,
          item.namaItem,
          item.quantity,
          item.keterangan,
          item.hargaSatuan,
          item.stok
        ]
      );
    }
  },

  // Jika masih butuh auto-ID
  async nextId(table, idColumn = "id") {
    const [rows] = await db.query(`SELECT MAX(${idColumn}) AS maxId FROM ${table}`);
    return (rows[0].maxId || 0) + 1;
  }
};