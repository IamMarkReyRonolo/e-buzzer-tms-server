const express = require("express");
const reportController = require("../controller/reportController");
const auth = require("../controller/auth");
const router = express.Router();

router.get("/all", auth.authenticate, reportController.getAllReports);

router.get(
	"/:report_id",
	auth.authenticate,
	reportController.getSpecificReport
);

router.post("/create", auth.authenticate, reportController.addReport);

router.delete(
	"/delete/:report_id",
	auth.authenticate,
	reportController.deleteSpecificReport
);

module.exports = router;
