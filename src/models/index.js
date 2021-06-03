const { DataTypes } = require("sequelize");
const db = require("../utils/db");

const Admin = db.define(
	"admin",
	{
		admin_username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		admin_password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "admin" }
);

const Event = db.define(
	"event",
	{
		event_name: DataTypes.STRING,
		event_date: DataTypes.STRING,
		event_location: DataTypes.STRING,
		event_budget: DataTypes.INTEGER,
		event_description: DataTypes.STRING,
		event_status: DataTypes.STRING,
	},
	{ tableName: "event" }
);

const Report = db.define(
	"report",
	{
		report_content: DataTypes.STRING,
	},
	{ tableName: "report" }
);

const User = db.define(
	"user",
	{
		fullname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "user" }
);

Admin.hasMany(User, { onDelete: "CASCADE" });
User.belongsTo(Admin, { onDelete: "CASCADE" });

User.hasMany(Event, { onDelete: "CASCADE" });
Event.belongsTo(User);

Admin.hasMany(Event, { onDelete: "CASCADE" });
Event.belongsTo(Admin, { onDelete: "CASCADE" });

Event.hasOne(Report, { onDelete: "CASCADE" });
Report.belongsTo(Event);

module.exports = { Admin, User, Event, Report };
