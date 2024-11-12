const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const Area = require("./Area"); // 导入 Area 模型
const City = require("./City"); // 导入 City 模型
const Province = require("./Province"); // 导入 Province 模型

const Street = seq.define("Street", {
  code: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  areaCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: Area,
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
  cityCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: City,
      key: 'code',
    },
  },
}, {
  tableName: "street",
  timestamps: false,
});

// 建立关联
Street.belongsTo(Area, { foreignKey: 'areaCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Street.belongsTo(Province, { foreignKey: 'provinceCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Street.belongsTo(City, { foreignKey: 'cityCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = Street;
