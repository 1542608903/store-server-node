const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Province = seq.define("Province", {
  code: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: "province",
  timestamps: false,
});

module.exports = Province;
