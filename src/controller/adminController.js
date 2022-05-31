const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const notificationController = require("./notificationController");
const subscriptionController = require("./subscriptionController");
const webpush = require("web-push");

const signInAdmin = async (req, res, next) => {
	try {
		const exist = await models.Admin.findOne({
			where: { admin_username: req.body.username },
		});

		if (!exist) {
			const error = new Error("Username does not exist");
			error.status = 400;
			next(error);
		} else {
			const pass = await bcrypt.compare(
				req.body.password,
				exist.admin_password
			);
			if (!pass) {
				const error = new Error("Password is wrong");
				error.status = 400;
				next(error);
			} else {
				const token = await jwt.sign(exist.id, process.env.TOKEN_SECRET);
				res.header("auth-token", token);

				res.status(200).json({
					success_message: "You are logged in",
					admin: {
						id: exist.id,
						token: token,
					},
				});
			}
		}
	} catch (error) {
		next(error);
	}
};

const signUpAdmin = async (req, res, next) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const admin = await models.Admin.create({
			admin_username: username,
			admin_password: hashPassword,
			buzzer_count: 0,
		});

		res.status(200).json({
			success_message: "Successfully created!",
			admin: admin,
		});
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

const updateAdminPassword = async (req, res, next) => {
	try {
		const admin = await models.Admin.findByPk(req.user);

		if (!admin) {
			const error = new Error("Admin does not exist");
			error.status = 400;
			next(error);
		} else {
			const pass = await bcrypt.compare(
				req.body.current_password,
				admin.admin_password
			);
			if (!pass) {
				const error = new Error("Current password is wrong");
				error.status = 400;
				next(error);
			} else {
				const password = req.body.new_password;
				const salt = await bcrypt.genSalt(10);
				const hashPassword = await bcrypt.hash(password, salt);

				const update = await models.Admin.update(
					{ admin_password: hashPassword },
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

const clickBuzzer = async (req, res, next) => {
	try {
		const update = await models.Admin.increment(
			{ buzzer_count: +1 },
			{
				where: {
					id: req.user,
				},
			}
		);

		if (!update) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			const result = await notificationController.addNotification(req);

			// Create payload
			const payload = "Buzzer";

			const subs = await subscriptionController.getAll();

			subs.forEach((sub) => {
				const subscription = {
					endpoint: sub.endpoint,
					expirationTime: null,
					keys: {
						p256dh: sub.hash,
						auth: sub.auth,
					},
				};

				webpush
					.sendNotification(subscription, payload)
					.then((data) => {})
					.catch((err) => console.error(err));
			});

			res.status(200).json({ message: "Successfully clicked the buzzer." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAdmin,
	signInAdmin,
	signUpAdmin,
	updateAdminPassword,
	clickBuzzer,
};
