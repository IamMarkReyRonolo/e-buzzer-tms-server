const express = require("express");
const userController = require("../controller/userController");
const auth = require("../controller/auth");
const router = express.Router();

router.get("/all", auth.authenticate, userController.getAllUsers);
router.get("/getSpecific", auth.authenticate, userController.getUser);
router.post(
	"/getAllWithinRange",
	auth.authenticate,
	userController.getUsersWithinRange
);
router.post("/signIn", userController.signInUser);
router.post("/signUp", auth.authenticate, userController.signUpUser);

router.patch("/:userId", auth.authenticate, userController.updateUser);
router.delete("/:userId", auth.authenticate, userController.deleteUser);

router.patch(
	"/update/password",
	auth.authenticate,
	userController.updateUserPasword
);

module.exports = router;
