const bcrypt = require('bcryptjs');
const { User } = require('../src/models');
const { v4: uuidv4 } = require('uuid');

async function createAdminUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: 'brandonbhughes@gmail.com' }
    });

    if (existingUser) {
      console.log('User already exists. Updating to admin role...');
      await existingUser.update({ role: 'admin' });
      console.log('User role updated to admin');
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('conTida0808!', 10);
    
    const newUser = await User.create({
      id: uuidv4(),
      username: 'brandonhughes',
      email: 'brandonbhughes@gmail.com',
      password: hashedPassword,
      firstName: 'Brandon',
      lastName: 'Hughes',
      role: 'admin',
      status: 'active'
    });

    console.log('Admin user created successfully:', {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();