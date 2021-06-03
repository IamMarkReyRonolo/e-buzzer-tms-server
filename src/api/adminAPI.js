const express = require("express");
const adminController = require("../controller/adminController");
const router = express.Router();
const auth = require("../controller/auth");

router.get("/", auth.authenticate, adminController.getAdmin);

router.post("/signIn", adminController.signInAdmin);

router.post("/signUp", adminController.signUpAdmin);

module.exports = router;
