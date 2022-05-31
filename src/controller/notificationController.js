const models = require("../models");
const { Op } = require("sequelize");

const getUserNotification = async (req, res, next) => {
	try {
		const notifications = await models.Notification.findAll({
			where: {
				[Op.or]: [{ teacher_id: req.user }, { teacher_id: "all" }],
			},
		});

		res.status(200).json(notifications);
	} catch (error) {
		next(error);
	}
};

const addNotification = async (req) => {
	const notif = {
		notification_type: req.body.notif.notification_type,
		message: req.body.notif.message,
		date_created: req.body.notif.date_created,
		teacher_id: req.body.notif.teacher_id,
		status: "new",
	};

	const notifications = await models.Notification.create(notif);
	return notifications;
};

const createNotification = async (req, res, next) => {
	try {
		const notif = {
			notification_type: req.body.notif.notification_type,
			message: req.body.notif.message,
			date_created: req.body.notif.date_created,
			teacher_id: req.body.notif.teacher_id,
			status: "new",
		};

		const notifications = await models.Notification.create(notif);
		res.status(201).json(notifications);
	} catch (error) {
		next(error);
	}
};

const updateNotification = async (req, res, next) => {
	try {
		const update = await models.Notification.update(
			{ status: "old" },
			{
				where: {
					id: req.params.notif_id,
				},
			}
		);

		if (update[0] == 0) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully updated notification." });
		}
	} catch (error) {
		next(error);
	}
};

const deleteNotification = async (req, res, next) => {
	try {
		const deleted = await models.Notification.destroy({
			where: {
				id: req.params.notif_id,
			},
		});

		if (!deleted) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully deleted notification." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUserNotification,
	addNotification,
	createNotification,
	updateNotification,
	deleteNotification,
};
