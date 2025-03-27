module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'QuestionCategories',
        key: 'id'
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
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
    helpText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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

  Question.associate = (models) => {
    Question.belongsTo(models.QuestionCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    Question.hasMany(models.ReviewResponse, {
      foreignKey: 'questionId',
      as: 'responses'
    });
  };

  return Question;
};