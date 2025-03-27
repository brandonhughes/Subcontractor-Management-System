module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    uploaderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('certification', 'license', 'insurance', 'other'),
      defaultValue: 'other'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true // Soft delete
  });

  Document.associate = (models) => {
    Document.belongsTo(models.Subcontractor, {
      foreignKey: 'subcontractorId',
      as: 'subcontractor'
    });

    Document.belongsTo(models.User, {
      foreignKey: 'uploaderId',
      as: 'uploader'
    });
  };

  return Document;
};