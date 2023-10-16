const express = require("express");
const path = require("path");
const router = express.Router();

function sendHomepage(req, res) {
  res.sendFile(path.resolve(__dirname, "../../public/index.html"));
}

router.get("/login", sendHomepage);
router.get("/signup", sendHomepage);
router.get("/teacher-homepage", sendHomepage);
router.get("/seek-teachers", sendHomepage);
router.get("/admin/panel", sendHomepage);

module.exports = router;
