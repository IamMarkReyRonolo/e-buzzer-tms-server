const express = require("express");
const adminController = require("../controller/adminController");
const router = express.Router();
const auth = require("../controller/auth");

router.get("/", auth.authenticate, adminController.getAdmin);

router.post("/signIn", adminController.signInAdmin);

router.post("/signUp", adminController.signUpAdmin);

router.patch("/update", auth.authenticate, adminController.updateAdminPassword);

router.patch("/reset", auth.authenticate, adminController.reset);

router.patch("/buzzer/", auth.authenticate, adminController.clickBuzzer);

module.exports = router;
