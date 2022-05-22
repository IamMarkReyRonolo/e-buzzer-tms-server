const models = require("../models");

const getAllEventsAdmin = async (req, res, next) => {
	try {
		const events = await models.Activity.findAll();
		res.status(200).json(events);
	} catch (error) {
		next(error);
	}
};

const getSpecificEvent = async (req, res, next) => {
	try {
		const event = await models.Activity.findByPk(req.params.activity_id);

		if (!event) {
			const error = new Error("Not Found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json(event);
		}
	} catch (error) {
		next(error);
	}
};

const createEvent = async (req, res, next) => {
	try {
		const data = {
			categories: req.body.categories,
			status: req.body.status,
			feedback: req.body.feedback,
			date_created: req.body.date_created,
			time_created: req.body.time_created,
			teacherId: parseInt(req.params.teacher_id),
		};

		const teacher = await models.Teacher.findOne({
			where: {
				id: data.teacherId,
				code: req.body.code,
			},
		});

		if (!teacher) {
			const error = new Error("Incorrect Code");
			error.status = 404;
			next(error);
		} else {
			console.log(data);

			const event = await models.Activity.create(data);
			res.status(200).json(event);
		}
	} catch (error) {
		next(error);
	}
};

const updateEvent = async (req, res, next) => {
	try {
		const data = {
			categories: req.body.categories,
			status: req.body.status,
			feedback: req.body.feedback,
			teacherId: parseInt(req.body.teacherId),
		};

		const update = await models.Activity.update(data, {
			where: {
				id: req.params.activity_id,
			},
		});
		console.log(update[0]);

		if (update[0] == 0) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully updated activity." });
		}
	} catch (error) {
		next(error);
	}
};

const deleteEvent = async (req, res, next) => {
	try {
		const deleted = await models.Activity.destroy({
			where: {
				id: req.params.activity_id,
			},
		});

		if (!deleted) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully deleted activity." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllEventsAdmin,
	getSpecificEvent,
	createEvent,
	deleteEvent,
	updateEvent,
};
