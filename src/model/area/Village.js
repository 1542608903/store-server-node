const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const Street = require("./Street"); // 导入 Street 模型
const Area = require("./Area"); // 导入 Area 模型
const City = require("./City"); // 导入 City 模型
const Province = require("./Province"); // 导入 Province 模型

const Village = seq.define("Village", {
  code: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  streetCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: Street,
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
  areaCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    references: {
      model: Area,
      key: 'code',
    },
  },
}, {
  tableName: "village",
  timestamps: false,
});

// 建立关联
Village.belongsTo(Street, { foreignKey: 'streetCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Village.belongsTo(Area, { foreignKey: 'areaCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Village.belongsTo(City, { foreignKey: 'cityCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Village.belongsTo(Province, { foreignKey: 'provinceCode', targetKey: 'code', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = Village;
