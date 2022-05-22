const express = require("express");
const auth = require("../controller/auth");
const eventController = require("../controller/activityController");
const router = express.Router();

router.get("/admin/all", auth.authenticate, eventController.getAllEventsAdmin);

router.get("/:activity_id", eventController.getSpecificEvent);

router.post(
	"/create/:teacher_id",
	auth.authenticate,
	eventController.createEvent
);

router.patch("/:activity_id", eventController.updateEvent);

router.delete("/:activity_id", eventController.deleteEvent);

module.exports = router;
