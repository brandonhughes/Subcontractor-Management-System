module.exports = (sequelize, DataTypes) => {
  const Subcontractor = sequelize.define('Subcontractor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    letterGrade: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D', 'F'),
      defaultValue: 'C'
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    paranoid: true // Soft delete
  });

  Subcontractor.associate = (models) => {
    Subcontractor.hasMany(models.Review, {
      foreignKey: 'subcontractorId',
      as: 'reviews',
      onDelete: 'CASCADE'
    });

    Subcontractor.hasMany(models.Document, {
      foreignKey: 'subcontractorId',
      as: 'documents',
      onDelete: 'CASCADE'
    });
  };

  return Subcontractor;
};