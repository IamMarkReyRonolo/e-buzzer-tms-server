const express = require("express");
const notificationController = require("../controller/notificationController");
const router = express.Router();
const auth = require("../controller/auth");

router.get("/", auth.authenticate, notificationController.getUserNotification);
router.post(
	"/create",
	auth.authenticate,
	notificationController.createNotification
);

router.patch(
	"/update/:notif_id",
	auth.authenticate,
	notificationController.updateNotification
);
module.exports = router;
