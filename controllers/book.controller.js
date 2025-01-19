// const postgre = require("../database");
// const bookController = {
//   getAll: async (req, res) => {
//     try {
//       const { rows } = await postgre.query("select * from books");
//       res.json({ msg: "OK", data: rows });
//     } catch (error) {
//       res.json({ msg: error.msg });
//     }
//   },
//   getById: async (req, res) => {
//     try {
//       const { rows } = await postgre.query(
//         "select * from books where book_id = $1",
//         [req.params.id]
//       );

//       if (rows[0]) {
//         return res.json({ msg: "OK", data: rows });
//       }

//       res.status(404).json({ msg: "not found" });
//     } catch (error) {
//       res.json({ msg: error.msg });
//     }
//   },
//   create: async (req, res) => {
//     try {
//       const { name, price } = req.body;

//       const sql = "INSERT INTO books(name, price) VALUES($1, $2) RETURNING *";

//       const { rows } = await postgre.query(sql, [name, price]);

//       res.json({ msg: "OK", data: rows[0] });
//     } catch (error) {
//       res.json({ msg: error.msg });
//     }
//   },
//   updateById: async (req, res) => {
//     try {
//       const { name, price } = req.body;

//       const sql =
//         "UPDATE books set name = $1, price = $2 where book_id = $3 RETURNING *";

//       const { rows } = await postgre.query(sql, [name, price, req.params.id]);

//       res.json({ msg: "OK", data: rows[0] });
//     } catch (error) {
//       res.json({ msg: error.msg });
//     }
//   },
//   deleteById: async (req, res) => {
//     try {
//       const sql = "DELETE FROM books where book_id = $1 RETURNING *";

//       const { rows } = await postgre.query(sql, [req.params.id]);

//       if (rows[0]) {
//         return res.json({ msg: "OK", data: rows[0] });
//       }

//       return res.status(404).json({ msg: "not found" });
//     } catch (error) {
//       res.json({ msg: error.msg });
//     }
//   },
// };

// module.exports = bookController;

// controllers/book.controller.js
const postgre = require("../database");
const fs = require("fs");
const path = require("path");

const bookController = {
  getAll: async (req, res) => {
    try {
      const { rows } = await postgre.query("select * from books");
      res.json({ msg: "OK", data: rows });
    } catch (error) {
      res.json({ msg: error.msg });
    }
  },

  getById: async (req, res) => {
    try {
      const { rows } = await postgre.query(
        "select * from books where book_id = $1",
        [req.params.id]
      );

      if (rows[0]) {
        return res.json({ msg: "OK", data: rows });
      }

      res.status(404).json({ msg: "not found" });
    } catch (error) {
      res.json({ msg: error.msg });
    }
  },

  create: async (req, res) => {
    try {
      const { name, price } = req.body;
      const image = req.file ? req.file.filename : null; // 👈 Ambil nama file jika ada

      const sql =
        "INSERT INTO books(name, price, image) VALUES($1, $2, $3) RETURNING *";

      const { rows } = await postgre.query(sql, [name, price, image]);

      res.json({ msg: "OK", data: rows[0] });
    } catch (error) {
      res.json({ msg: error.msg });
    }
  },

  updateById: async (req, res) => {
    try {
      const { name, price } = req.body;
      const bookId = req.params.id;

      // Ambil data buku lama untuk cek gambar
      const oldBook = await postgre.query(
        "SELECT image FROM books WHERE book_id = $1",
        [bookId]
      );

      // Cek apakah buku ditemukan
      if (oldBook.rows.length === 0) {
        return res.status(404).json({ msg: "Not Found" });
      }

      const oldImage = oldBook.rows[0]?.image;

      // Jika ada file baru
      const image = req.file ? req.file.filename : oldImage;

      const sql =
        "UPDATE books SET name = $1, price = $2, image = $3 WHERE book_id = $4 RETURNING *";

      const { rows } = await postgre.query(sql, [name, price, image, bookId]);

      // Jika update berhasil dan ada gambar lama, hapus file lama
      if (rows[0]) {
        if (oldImage && req.file) {
          // Hanya hapus jika ada file baru dan file lama
          const oldImagePath = path.join(
            __dirname,
            "../public/images",
            oldImage
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      res.json({ msg: "OK", data: rows[0] });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      // Ambil data gambar sebelum delete
      const oldBook = await postgre.query(
        "SELECT image FROM books WHERE book_id = $1",
        [req.params.id]
      );
      const oldImage = oldBook.rows[0]?.image;

      const sql = "DELETE FROM books where book_id = $1 RETURNING *";
      const { rows } = await postgre.query(sql, [req.params.id]);

      if (rows[0]) {
        // Hapus file gambar jika ada
        if (oldImage) {
          const imagePath = path.join(__dirname, "../public/images", oldImage);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.json({ msg: "OK", data: rows[0] });
      }

      return res.status(404).json({ msg: "not found" });
    } catch (error) {
      res.json({ msg: error.msg });
    }
  },
};

module.exports = bookController;
