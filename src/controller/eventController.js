const models = require("../models");

const getAllEventsAdmin = async (req, res, next) => {
	try {
		const events = await models.Event.findAll({
			where: { adminId: req.user },
			include: { model: models.User, attributes: ["fullname", "username"] },
		});
		res.status(200).json(events);
	} catch (error) {
		next(error);
	}
};

const getAllEventsUser = async (req, res, next) => {
	try {
		const events = await models.Event.findAll({
			where: { userId: req.user },
			include: [models.Report],
		});

		res.status(200).json({ events });
	} catch (error) {
		next(error);
	}
};

const getSpecificEvent = async (req, res, next) => {
	try {
		const event = await models.Event.findByPk(req.params.eventId);

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
		const adminId = await models.User.findOne({
			where: { id: parseInt(req.user) },
			attributes: ["adminId"],
		});
		if (!adminId) {
			const error = new Error("Not Found");
			error.status = 404;
			next(error);
		}
		const data = {
			event_name: req.body.event_name,
			event_date: req.body.event_date,
			event_location: req.body.event_location,
			event_budget: parseInt(req.body.event_budget),
			event_description: req.body.event_description,
			event_status: req.body.event_status,
			userId: req.user,
			adminId: adminId.adminId,
		};

		const event = await models.Event.create(data);
		res.status(200).json(event);
	} catch (error) {
		next(error);
	}
};

const updateEvent = async (req, res, next) => {
	try {
		const data = {
			event_name: req.body.event_name,
			event_date: req.body.event_date,
			event_location: req.body.event_location,
			event_budget: parseInt(req.body.event_budget),
			event_description: req.body.event_description,
			event_status: req.body.event_status,
		};

		const update = await models.Event.update(data, {
			where: {
				id: req.params.eventId,
			},
		});

		if (!update) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully updated event." });
		}
	} catch (error) {
		next(error);
	}
};

const deleteEvent = async (req, res, next) => {
	try {
		const deleted = await models.Event.destroy({
			where: {
				id: req.params.eventId,
			},
		});

		if (!deleted) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully deleted event." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllEventsAdmin,
	getAllEventsUser,
	getSpecificEvent,
	createEvent,
	deleteEvent,
	updateEvent,
};
