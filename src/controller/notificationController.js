const models = require("../models");
const { Op } = require("sequelize");

const getUserNotification = async (req, res, next) => {
	try {
		const notifications = await models.Notification.findAll({
			teacherId: req.user,
		});

		res.status(200).json(notifications);
	} catch (error) {
		next(error);
	}
};

const getBuzzerNotification = async (req, res, next) => {
	try {
		const notifications = await models.Notification.findAll({
			teacherId: req.user,
		});

		res.status(200).json(notifications);
	} catch (error) {
		next(error);
	}
};

const notifyTeachers = async (req, res, next) => {
	try {
		const activities = await models.Notification.finpodAll({
			where: {
				date_created: {
					[Op.and]: {
						[Op.lte]: req.body.date_ended,
						[Op.gte]: req.body.date_started,
					},
				},
			},
		});

		let activities_array = [];
		activities.forEach((activity) => {
			activities_array.push(activity.dataValues);
		});

		console.log(activities_array);

		const createReport = await models.Report.create({
			report_title: req.body.report_title,
			report_details: req.body.report_details,
			date_started: req.body.date_started,
			date_ended: req.body.date_ended,
		});

		createReport.addActivity(activities);

		//
		if (!createReport) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res
				.status(200)
				.json({ message: "Successfully created report", report: createReport });
		}
	} catch (error) {
		next(error);
	}
};

const getSpecificReport = async (req, res, next) => {
	try {
		const report = await models.Report.findByPk(req.params.report_id, {
			include: {
				model: models.Activity,
				attributes: { exclude: ["feedback", "activityReport"] },
			},
		});

		if (!report) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json(report);
		}
	} catch (error) {
		next(error);
	}
};

const deleteSpecificReport = async (req, res, next) => {
	try {
		const deleted = await models.Report.destroy({
			where: {
				id: req.params.report_id,
			},
		});

		if (!deleted) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully deleted report." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUserNotification,
	addReport,
	getSpecificReport,
	deleteSpecificReport,
};
