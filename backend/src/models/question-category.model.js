module.exports = (sequelize, DataTypes) => {
  const QuestionCategory = sequelize.define('QuestionCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0.1,
        max: 10.0
      }
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    timestamps: true,
    paranoid: true // Soft delete
  });

  QuestionCategory.associate = (models) => {
    QuestionCategory.hasMany(models.Question, {
      foreignKey: 'categoryId',
      as: 'questions',
      onDelete: 'CASCADE'
    });
  };

  return QuestionCategory;
};