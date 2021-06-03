const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./utils/db");
const models = require("./models");

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
const eventAPI = require("./api/eventAPI");
const reportAPI = require("./api/reportAPI");

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is up!" });
});
app.use("/api/admin", adminAPI);
app.use("/api/user", userAPI);
app.use("/api/event", eventAPI);
app.use("/api/report", reportAPI);

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
