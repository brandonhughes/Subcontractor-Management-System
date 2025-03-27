const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'internal'),
      defaultValue: 'internal'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.prototype.verifyPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Review, {
      foreignKey: 'reviewerId',
      as: 'reviews'
    });
  };

  return User;
};