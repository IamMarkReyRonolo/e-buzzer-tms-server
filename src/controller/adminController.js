const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signInAdmin = async (req, res, next) => {
	try {
		const exist = await models.Admin.findOne({
			where: { admin_username: req.body.username },
		});

		if (!exist) {
			const error = new Error("Username does not exist");
			error.status = 400;
			next(error);
		}

		const pass = await bcrypt.compare(req.body.password, exist.admin_password);
		if (!pass) {
			const error = new Error("Password is wrong");
			error.status = 400;
			next(error);
		}

		const token = await jwt.sign(exist.id, process.env.TOKEN_SECRET);
		res.header("auth-token", token);

		res.status(200).json({
			success_message: "You are logged in",
			admin: {
				id: exist.id,
				token: token,
			},
		});
	} catch (error) {
		next(error);
	}
};

const signUpAdmin = async (req, res, next) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const exist = await models.Admin.findOne({
			where: { admin_username: req.body.username },
		});

		if (exist) {
			const error = new Error("Username already exists");
			error.status = 401;
			next(error);
		} else {
			const admin = await models.Admin.create({
				admin_username: req.body.username,
				admin_password: hashPassword,
			});

			res.status(200).json({
				success_message: "Successfully created!",
				admin: admin,
			});
		}
	} catch (error) {
		next(error);
	}
};

const getAdmin = async (req, res, next) => {
	try {
		const admin = await models.Admin.findByPk(req.user);
		if (admin) {
			res.status(200).json(admin);
		} else {
			const error = new Error("Admin not found");
			error.status = 404;
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { getAdmin, signInAdmin, signUpAdmin };
