const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const bookController = require("../controllers/book.controller");

// router.get("/", bookController.getAll);
// router.get("/:id", bookController.getById);
// router.post("/", bookController.create);
// router.put("/:id", bookController.updateById);
// router.delete("/:id", bookController.deleteById);

router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/", upload.single("image"), bookController.create);
router.put("/:id", upload.single("image"), bookController.updateById);
router.delete("/:id", bookController.deleteById);

module.exports = router;
