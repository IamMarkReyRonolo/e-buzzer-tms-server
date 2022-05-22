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
		buzzer_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ tableName: "admin" }
);

const Teacher = db.define(
	"teacher",
	{
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		gender: {
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
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "teacher" }
);

const Activity = db.define(
	"activity",
	{
		categories: DataTypes.ARRAY(DataTypes.STRING),
		status: DataTypes.STRING,
		feedback: DataTypes.ARRAY(DataTypes.STRING),
		date_created: DataTypes.STRING,
		time_created: DataTypes.STRING,
	},
	{ tableName: "activity" }
);

const Report = db.define(
	"report",
	{
		report_title: DataTypes.STRING,
		report_details: DataTypes.STRING,
		date_started: DataTypes.STRING,
		date_ended: DataTypes.STRING,
	},
	{ tableName: "report" }
);

const ActivityReport = db.define(
	"activityReport",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
	},
	{ timestamps: true }
);

const Notification = db.define(
	"notification",
	{
		type: DataTypes.STRING,
		message: DataTypes.STRING,
	},
	{ timestamps: true }
);

const NotificationList = db.define(
	"notificationList",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
	},
	{ timestamps: true }
);

Admin.hasMany(Teacher, { onDelete: "CASCADE" });
Teacher.belongsTo(Admin, { onDelete: "CASCADE" });

Teacher.hasMany(Activity, { onDelete: "CASCADE" });
Activity.belongsTo(Teacher, { onDelete: "CASCADE" });

Teacher.belongsToMany(
	Notification,
	{ through: NotificationList },
	{ onDelete: "CASCADE" }
);
Notification.belongsToMany(
	Teacher,
	{ through: NotificationList },
	{ onDelete: "CASCADE" }
);

Report.belongsToMany(
	Activity,
	{ through: ActivityReport },
	{ onDelete: "CASCADE" }
);
Activity.belongsToMany(
	Report,
	{ through: ActivityReport },
	{ onDelete: "CASCADE" }
);

module.exports = {
	Admin,
	Teacher,
	Activity,
	Report,
	ActivityReport,
	Notification,
	NotificationList,
};
