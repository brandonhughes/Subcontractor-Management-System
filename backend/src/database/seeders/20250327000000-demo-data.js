'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin and demo user
    const usersData = [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'admin',
        status: 'active',
        firstName: 'Admin',
        lastName: 'User',
        department: 'Administration',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'internal',
        status: 'active',
        firstName: 'John',
        lastName: 'Doe',
        department: 'Project Management',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create demo subcontractors
    const subcontractorsData = [
      {
        id: uuidv4(),
        name: 'ABC Electrical Contractors',
        contactName: 'Robert Smith',
        email: 'robert@abcelectrical.com',
        phone: '555-123-4567',
        address: '123 Main St, Anytown, USA',
        specialties: ['Electrical', 'Lighting', 'Power Systems'],
        description: 'Experienced electrical contractor specializing in commercial and industrial projects.',
        status: 'active',
        website: 'https://www.abcelectrical.com',
        averageRating: 4.2,
        letterGrade: 'B',
        reviewCount: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'XYZ Plumbing Solutions',
        contactName: 'Jane Williams',
        email: 'jane@xyzplumbing.com',
        phone: '555-987-6543',
        address: '456 Oak St, Somewhere, USA',
        specialties: ['Plumbing', 'HVAC', 'Water Systems'],
        description: 'Full-service plumbing contractor with 20+ years of experience.',
        status: 'active',
        website: 'https://www.xyzplumbing.com',
        averageRating: 4.7,
        letterGrade: 'A',
        reviewCount: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Acme Construction',
        contactName: 'Michael Johnson',
        email: 'michael@acme.com',
        phone: '555-567-8901',
        address: '789 Pine St, Elsewhere, USA',
        specialties: ['General Contracting', 'Carpentry', 'Concrete'],
        description: 'Full-service construction company specializing in commercial building projects.',
        status: 'active',
        website: 'https://www.acmeconstruction.com',
        averageRating: 3.5,
        letterGrade: 'C',
        reviewCount: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create question categories
    const categoriesData = [
      {
        id: uuidv4(),
        name: 'Quality of Work',
        description: 'Assessment of the quality and craftsmanship of work performed',
        weight: 2.0,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Timeliness',
        description: 'Evaluation of meeting deadlines and schedule adherence',
        weight: 1.5,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Communication',
        description: 'Assessment of communication effectiveness and responsiveness',
        weight: 1.0,
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cost Management',
        description: 'Evaluation of budget adherence and cost transparency',
        weight: 1.5,
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Seed the data
    await queryInterface.bulkInsert('Users', usersData);
    await queryInterface.bulkInsert('Subcontractors', subcontractorsData);
    await queryInterface.bulkInsert('QuestionCategories', categoriesData);

    // Get the IDs for relation creation
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM "QuestionCategories"`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create questions for each category
    let questionsData = [];
    
    // Quality questions
    questionsData = questionsData.concat([
      {
        id: uuidv4(),
        categoryId: categories[0].id,
        text: 'How would you rate the overall quality of work performed?',
        weight: 1.0,
        helpText: 'Consider the final result and attention to detail',
        isRequired: true,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        categoryId: categories[0].id,
        text: 'Did the work meet industry standards and code requirements?',
        weight: 1.2,
        helpText: 'Consider compliance with relevant regulations and standards',
        isRequired: true,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Timeliness questions
    questionsData = questionsData.concat([
      {
        id: uuidv4(),
        categoryId: categories[1].id,
        text: 'Did the subcontractor complete work within the agreed timeframe?',
        weight: 1.0,
        helpText: 'Consider both final completion and milestone deadlines',
        isRequired: true,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        categoryId: categories[1].id,
        text: 'How was their attendance and punctuality?',
        weight: 0.8,
        helpText: 'Consider whether they showed up when expected',
        isRequired: true,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Communication questions
    questionsData = questionsData.concat([
      {
        id: uuidv4(),
        categoryId: categories[2].id,
        text: 'How responsive was the subcontractor to inquiries and concerns?',
        weight: 1.0,
        helpText: 'Consider timeliness and thoroughness of responses',
        isRequired: true,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        categoryId: categories[2].id,
        text: 'How effective was the subcontractor in providing updates and progress reports?',
        weight: 0.9,
        helpText: 'Consider frequency and clarity of communications',
        isRequired: true,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Cost Management questions
    questionsData = questionsData.concat([
      {
        id: uuidv4(),
        categoryId: categories[3].id,
        text: 'Did the subcontractor adhere to the agreed budget?',
        weight: 1.2,
        helpText: 'Consider whether the final cost matched the estimated/contracted amount',
        isRequired: true,
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        categoryId: categories[3].id,
        text: 'How transparent was the subcontractor about costs and changes?',
        weight: 0.8,
        helpText: 'Consider communication about any cost variances or change orders',
        isRequired: true,
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('Questions', questionsData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Questions', null, {});
    await queryInterface.bulkDelete('QuestionCategories', null, {});
    await queryInterface.bulkDelete('Subcontractors', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};