const models = require("../models");
const { Op } = require("sequelize");

const getAll = async () => {
	const subscriptions = await models.Subscription.findAll();
	return subscriptions;
};
const getSpecific = async (teacher_id) => {
	const subscription = await models.Subscription.findOne({
		where: {
			teacherId: teacher_id,
		},
	});

	return subscription;
};

const addSubscription = async (req, res, next) => {
	try {
		const data = {
			endpoint: req.body.subscription.endpoint,
			hash: req.body.subscription.keys.p256dh,
			auth: req.body.subscription.keys.auth,
			teacherId: req.user,
		};

		const subscription = await models.Subscription.findOne({
			where: { teacherId: req.user },
		});

		if (subscription) {
			const subscribe = await subscription.update(data);

			res.status(200).json({ message: "success", subscribe: subscribe });
		} else {
			const subscribe = await models.Subscription.create(data);

			res.status(200).json({ message: "success", subscribe: subscribe });
		}
	} catch (error) {
		next(error);
	}
};

const updateSubscription = async (req, res, next) => {
	try {
		const update = await models.Subscription.update(
			{
				endpoint: req.body.subscription.endpoint,
				hash: req.body.subscription.keys.p256dh,
				auth: req.body.subscription.keys.auth,
			},
			{
				where: {
					teacherId: parseInt(req.user),
				},
			}
		);

		if (update[0] == 0) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		} else {
			res.status(200).json({ message: "Successfully updated subscription." });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAll,
	getSpecific,
	addSubscription,
	updateSubscription,
};
