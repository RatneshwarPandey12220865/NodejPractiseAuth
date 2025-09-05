const express = require("express");
const router = express.Router();
let authmiddleware = require("../middleware/auth-middleware");
let adminmiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
let { uploadImageController } = require("../controllers/image-controller");
let { fetchImageController } = require("../controllers/image-controller");

let { deleteImageController } = require("../controllers/image-controller");

router.post(
  "/upload",
  authmiddleware,
  adminmiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

router.get("/fetch", authmiddleware, fetchImageController);

router.delete(
  "/delete/:id",
  authmiddleware,
  adminmiddleware,
  deleteImageController
);

module.exports = router;
