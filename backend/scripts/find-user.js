const { User } = require('../src/models');

async function findUserByEmail() {
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
  } catch (error) {
    console.error('Error finding user:', error);
  } finally {
    process.exit();
  }
}

findUserByEmail();