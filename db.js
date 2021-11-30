const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:82f130b3a4e3422da143788de409570d@localhost:5432/WorkoutLog");

module.exports = sequelize;