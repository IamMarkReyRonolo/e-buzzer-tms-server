const models = require("../models");

const getAllReports = async (req, res, next) => {
	try {
		const reports = await models.Report.findAll({
			include: {
				model: models.Event,
				attributes: ["event_name"],
				include: { model: models.User, attributes: ["fullname"] },
			},
		});

		res.status(200).json(reports);
	} catch (error) {
		next(error);
	}
};

const addReport = async (req, res, next) => {
	try {
		const createReport = await models.Report.create({
			report_content: req.body.report,
			eventId: req.params.eventId,
		});
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

module.exports = {
	getAllReports,
	addReport,
};
