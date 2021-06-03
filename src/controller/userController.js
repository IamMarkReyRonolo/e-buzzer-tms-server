const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
	try {
		const user = await models.User.findByPk(req.user, {
			attributes: ["fullname"],
		});
		if (!user) {
			const error = new Error("Not Found");
			error.status = 404;
			next(error);
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const signInUser = async (req, res, next) => {
	try {
		const exist = await models.User.findOne({
			where: { username: req.body.username },
		});

		if (!exist) {
			const error = new Error("Username does not exist");
			error.status = 400;
			next(error);
		}

		if (req.body.password != exist.password) {
			const error = new Error("Password is wrong");
			error.status = 400;
			next(error);
		}

		const token = await jwt.sign(exist.id, process.env.TOKEN_SECRET);
		res.header("auth-token", token);

		res.status(200).json({
			success_message: "You are logged in",
			user: {
				id: exist.id,
				name: exist.fullname,
				username: exist.username,
				token: token,
			},
		});
	} catch (error) {
		next(error);
	}
};

const signUpUser = async (req, res, next) => {
	try {
		const adminExist = await models.Admin.findByPk(req.user);
		if (!adminExist) {
			const error = new Error("Admin not found");
			error.status = 404;
			next(error);
		}

		const exist = await models.User.findOne({
			where: { username: req.body.username },
		});

		if (exist) {
			const error = new Error("Username already exists");
			error.status = 401;
			next(error);
		} else {
			const user = await models.User.create({
				fullname: req.body.fullname,
				username: req.body.username,
				password: req.body.password,
				adminId: req.user,
			});

			res.status(200).json({
				success_message: "Successfully created!",
				user,
			});
		}
	} catch (error) {
		next(error);
	}
};

const getAllUsers = async (req, res, next) => {
	try {
		const users = await models.User.findAll({ where: { adminId: req.user } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const data = {
			fullname: req.body.fullname,
			username: req.body.username,
			password: req.body.password,
		};

		const update = await models.User.update(data, {
			where: {
				id: req.params.userId,
				adminId: req.user,
			},
		});

		if (!update) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully updated user." });
		}
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const data = {
			fullname: req.body.fullname,
			username: req.body.username,
			password: req.body.password,
		};
		const deleted = await models.User.destroy({
			where: {
				id: req.params.userId,
				adminId: req.user,
			},
		});

		if (!deleted) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully deleted user." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	signInUser,
	signUpUser,
};
