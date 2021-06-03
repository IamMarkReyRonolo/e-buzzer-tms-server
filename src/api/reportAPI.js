const express = require("express");
const reportController = require("../controller/reportController");
const auth = require("../controller/auth");
const router = express.Router();

router.get("/all", auth.authenticate, reportController.getAllReports);

router.post("/:eventId", reportController.addReport);

module.exports = router;
