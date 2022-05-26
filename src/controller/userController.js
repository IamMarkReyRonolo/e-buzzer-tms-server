const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const getUser = async (req, res, next) => {
	try {
		const user = await models.Teacher.findByPk(req.user, {
			include: models.Activity,
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
		const exist = await models.Teacher.findOne({
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

		const exist = await models.Teacher.findOne({
			where: { username: req.body.username },
		});

		if (exist) {
			const error = new Error("Username already exists");
			error.status = 401;
			next(error);
		} else {
			const user = await models.Teacher.create({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				gender: req.body.gender,
				username: req.body.username,
				password: req.body.password,
				code: req.body.code,
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
		const users = await models.Teacher.findAll({
			where: { adminId: req.user },
			include: [models.Activity],
		});
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const getUsersWithinRange = async (req, res, next) => {
	try {
		console.log(req.body.date_started);
		console.log(req.body.date_ended);
		const users = await models.Teacher.findAll({
			where: { adminId: req.user },
			include: [
				{
					model: models.Activity,
					required: true,
					as: "activities",
					where: {
						date_created: {
							[Op.and]: {
								[Op.lte]: req.body.date_ended,
								[Op.gte]: req.body.date_started,
							},
						},
					},
				},
			],
		});
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const data = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			gender: req.body.gender,
			username: req.body.username,
			password: req.body.password,
			code: req.body.code,
		};

		const update = await models.Teacher.update(data, {
			where: {
				id: req.params.userId,
			},
		});

		console.log(update);

		if (update[0] == 0) {
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
		const deleted = await models.Teacher.destroy({
			where: {
				id: req.params.userId,
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

const updateUserPasword = async (req, res, next) => {
	try {
		const admin = await models.Teacher.findByPk(req.user);

		if (!admin) {
			const error = new Error("User does not exist");
			error.status = 400;
			next(error);
		} else {
			const pass = await bcrypt.compare(
				req.body.current_password,
				admin.password
			);
			if (!pass) {
				const error = new Error("Current password is wrong");
				error.status = 400;
				next(error);
			} else {
				const password = req.body.new_password;
				const salt = await bcrypt.genSalt(10);
				const hashPassword = await bcrypt.hash(password, salt);

				const update = await models.Teacher.update(
					{ password: hashPassword },
					{
						where: {
							id: req.user,
						},
					}
				);

				if (update[0] == 0) {
					const error = new Error("Not found");
					error.status = 404;
					next(error);
				} else {
					res.status(200).json({ message: "Successfully updated password." });
				}
			}
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
	getUsersWithinRange,
	updateUserPasword,
};
