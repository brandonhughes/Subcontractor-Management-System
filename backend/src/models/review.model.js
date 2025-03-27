module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    subcontractorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Subcontractors',
        key: 'id'
      }
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    overallRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasAttachments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projectDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['subcontractorId']
      },
      {
        fields: ['reviewerId']
      }
    ]
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Subcontractor, {
      foreignKey: 'subcontractorId',
      as: 'subcontractor'
    });

    Review.belongsTo(models.User, {
      foreignKey: 'reviewerId',
      as: 'reviewer'
    });

    Review.hasMany(models.ReviewAttachment, {
      foreignKey: 'reviewId',
      as: 'attachments',
      onDelete: 'CASCADE'
    });

    Review.hasMany(models.ReviewResponse, {
      foreignKey: 'reviewId',
      as: 'responses',
      onDelete: 'CASCADE'
    });
  };

  return Review;
};