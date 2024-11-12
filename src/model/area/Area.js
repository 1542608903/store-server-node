const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const City = require("./City"); // 导入 City 模型
const Province = require("./Province"); // 导入 Province 模型

const Area = seq.define("Area", {
  code: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cityCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: City,
      key: 'code',
    },
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
  tableName: "area",
  timestamps: false,
});

// 建立关联
Area.belongsTo(City, { foreignKey: 'cityCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Area.belongsTo(Province, { foreignKey: 'provinceCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = Area;
