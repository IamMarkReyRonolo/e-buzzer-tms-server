const express = require("express");
const subscriptionController = require("../controller/subscriptionController");
const router = express.Router();
const auth = require("../controller/auth");

router.get("/", auth.authenticate, subscriptionController.getAll);
router.get(
	"/:teacher_id",
	auth.authenticate,
	subscriptionController.getSpecific
);
router.post("/", auth.authenticate, subscriptionController.addSubscription);

router.patch("/", auth.authenticate, subscriptionController.updateSubscription);
module.exports = router;
