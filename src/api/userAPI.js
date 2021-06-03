const express = require("express");
const userController = require("../controller/userController");
const auth = require("../controller/auth");
const router = express.Router();

router.get("/all", auth.authenticate, userController.getAllUsers);
router.get("/specific", auth.authenticate, userController.getUser);
router.post("/signIn", userController.signInUser);
router.post("/signUp", auth.authenticate, userController.signUpUser);

router.patch("/:userId", auth.authenticate, userController.updateUser);
router.delete("/:userId", auth.authenticate, userController.deleteUser);

module.exports = router;
