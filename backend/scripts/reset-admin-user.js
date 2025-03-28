const bcrypt = require('bcryptjs');
const { User } = require('../src/models');
const { v4: uuidv4 } = require('uuid');

async function resetAdminUser() {
  try {
    // Find user by email
    const existingUser = await User.findOne({
      where: { email: 'brandonbhughes@gmail.com' }
    });

    if (existingUser) {
      console.log('User exists. Updating password...');
      
      // Create new password with direct database update to bypass hooks
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      // Force update to bypass hooks completely
      await User.update(
        { password: hashedPassword },
        { 
          where: { id: existingUser.id },
          individualHooks: false  // Explicitly disable hooks
        }
      );
      console.log('Password updated to "password123" successfully');
      
      // Verify password works
      const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log(`Verification test result: ${isPasswordValid}`);
      
      return;
    }

    // Create new admin user
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
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
    
    // Verify password works
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`Verification test result: ${isPasswordValid}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

resetAdminUser();