const { User } = require('../src/models');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    // Find user by email
    const user = await User.findOne({
      where: { email: 'brandonbhughes@gmail.com' }
    });

    if (!user) {
      console.log('User not found with email: brandonbhughes@gmail.com');
      return;
    }

    console.log('User found:');
    console.log({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });

    // Test password verification
    const testPassword = 'password123';
    const isPasswordValid = await user.verifyPassword(testPassword);
    
    console.log(`Password verification result for "${testPassword}": ${isPasswordValid}`);
    
    // If verification fails, let's check stored password hash
    console.log('Stored password hash:', user.password);
    
    // Try manual bcrypt compare
    const manualCompare = await bcrypt.compare(testPassword, user.password);
    console.log(`Manual bcrypt compare result: ${manualCompare}`);
    
  } catch (error) {
    console.error('Error checking password:', error);
  } finally {
    process.exit();
  }
}

checkPassword();