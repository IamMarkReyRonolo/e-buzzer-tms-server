const express = require("express");
const auth = require("../controller/auth");
const eventController = require("../controller/eventController");
const router = express.Router();

router.get("/admin/all", auth.authenticate, eventController.getAllEventsAdmin);

router.get("/user/all", auth.authenticate, eventController.getAllEventsUser);

router.get("/:eventId", eventController.getSpecificEvent);

router.post("/create", auth.authenticate, eventController.createEvent);

router.patch("/:eventId", eventController.updateEvent);

router.delete("/:eventId", eventController.deleteEvent);

module.exports = router;
