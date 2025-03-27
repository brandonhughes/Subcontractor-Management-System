module.exports = (sequelize, DataTypes) => {
  const ReviewAttachment = sequelize.define('ReviewAttachment', {
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
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  ReviewAttachment.associate = (models) => {
    ReviewAttachment.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'review'
    });
  };

  return ReviewAttachment;
};