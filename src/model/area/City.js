const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const Province = require("./Province"); // 导入 Province 模型

const City = seq.define("City", {
  code: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  provinceCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: Province,
      key: 'code',
    },
  },
}, {
  tableName: "city",
  timestamps: false,
});

// 建立关联
City.belongsTo(Province, { foreignKey: 'provinceCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = City;
