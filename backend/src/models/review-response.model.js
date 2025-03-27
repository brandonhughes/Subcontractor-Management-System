module.exports = (sequelize, DataTypes) => {
  const ReviewResponse = sequelize.define('ReviewResponse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Reviews',
        key: 'id'
      }
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Questions',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['reviewId', 'questionId']
      }
    ]
  });

  ReviewResponse.associate = (models) => {
    ReviewResponse.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'review'
    });

    ReviewResponse.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    });
  };

  return ReviewResponse;
};