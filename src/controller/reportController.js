const models = require("../models");
const { Op } = require("sequelize");

const getAllReports = async (req, res, next) => {
	try {
		const reports = await models.Report.findAll();

		res.status(200).json(reports);
	} catch (error) {
		next(error);
	}
};

const addReport = async (req, res, next) => {
	try {
		const activities = await models.Activity.findAll({
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
				include: {
					model: models.Teacher,
					attributes: ["first_name", "last_name"],
				},
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
	getAllReports,
	addReport,
	getSpecificReport,
	deleteSpecificReport,
};
