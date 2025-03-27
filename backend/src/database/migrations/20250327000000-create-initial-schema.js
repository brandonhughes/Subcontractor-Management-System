'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'internal'),
        defaultValue: 'internal'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create Subcontractors table
    await queryInterface.createTable('Subcontractors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      specialties: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      logoUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      averageRating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      letterGrade: {
        type: Sequelize.ENUM('A', 'B', 'C', 'D', 'F'),
        defaultValue: 'C'
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create Documents table
    await queryInterface.createTable('Documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      subcontractorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Subcontractors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uploadDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      uploaderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('certification', 'license', 'insurance', 'other'),
        defaultValue: 'other'
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create QuestionCategories table
    await queryInterface.createTable('QuestionCategories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create Questions table
    await queryInterface.createTable('Questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'QuestionCategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1.0
      },
      helpText: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create Reviews table
    await queryInterface.createTable('Reviews', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      subcontractorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Subcontractors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reviewerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      overallRating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hasAttachments: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      projectName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      projectDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create ReviewAttachments table
    await queryInterface.createTable('ReviewAttachments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      reviewId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Reviews',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create ReviewResponses table
    await queryInterface.createTable('ReviewResponses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      reviewId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Reviews',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Questions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint to review responses
    await queryInterface.addIndex('ReviewResponses', ['reviewId', 'questionId'], {
      unique: true
    });

    // Add indexes for common queries
    await queryInterface.addIndex('Reviews', ['subcontractorId']);
    await queryInterface.addIndex('Reviews', ['reviewerId']);
    await queryInterface.addIndex('Documents', ['subcontractorId']);
    await queryInterface.addIndex('Questions', ['categoryId']);
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('ReviewResponses');
    await queryInterface.dropTable('ReviewAttachments');
    await queryInterface.dropTable('Reviews');
    await queryInterface.dropTable('Questions');
    await queryInterface.dropTable('QuestionCategories');
    await queryInterface.dropTable('Documents');
    await queryInterface.dropTable('Subcontractors');
    await queryInterface.dropTable('Users');
  }
};