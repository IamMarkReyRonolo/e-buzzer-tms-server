const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./utils/db");
const models = require("./models");
const webpush = require("web-push");
const notificationController = require("./controller/notificationController");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

// DATABASE CONNECTION
db.authenticate()
	.then(() => {
		db.sync({ alter: true }).then(() => {
			console.log("Database is sync");
			console.log("Database connected");
		});
	})
	.catch((err) => {
		console.log(err);
	});

// API ROUTES
const adminAPI = require("./api/adminAPI");
const userAPI = require("./api/userAPI");
const activityAPI = require("./api/activityAPI");
const reportAPI = require("./api/reportAPI");
const notificationAPI = require("./api/notificationAPI");

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is up!" });
});

const publicVapidKey =
	"BNZlVfipnCvx2AZD-_Nxht5xnqfzh2DUsP0Vic6hjF88i-S-CwBXWN8F9IoVEWyFHJuwOvDm0TIB4kXKzSg1RAk";
const privateVapidKey = "y8SjbVdHVr-M3OmmB2cE2jr9Kq-U-e4kjgWuUU5Xv-c";

webpush.setVapidDetails(
	"mailto:test@test.com",
	publicVapidKey,
	privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res, next) => {
	// Get pushSubscription object
	const subscription = req.body.push_subscription;

	notificationController.addNotification(req, res, next).then((result) => {
		console.log(result);
		// Send 201 - resource created
		res.status(201).json({});

		// Create payload
		const payload = JSON.stringify({ title: "Push Test" });

		// Pass object into sendNotification
		webpush
			.sendNotification(subscription, payload)
			.catch((err) => console.error(err));
	});
});
app.use("/api/admin", adminAPI);
app.use("/api/user", userAPI);
app.use("/api/activity", activityAPI);
app.use("/api/report", reportAPI);
app.use("/api/notifications", notificationAPI);

// ERROR HANDLING

app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	error.status = error.status || 500;
	res.status(error.status).json({ error_message: error.message });
});

// LISTEN
app.listen(process.env.PORT || 3000, () => {
	console.log("Server is listening");
});
