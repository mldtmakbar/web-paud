const bcrypt = require('bcryptjs');

async function generateHashedPasswords() {
  const passwords = [
    { type: 'admin', password: 'admin123' },
    { type: 'default_teacher', password: 'teacher123' },
    { type: 'default_parent', password: 'parent123' }
  ];

  console.log('=== GENERATED BCRYPT HASHES ===\n');

  for (const item of passwords) {
    const hash = await bcrypt.hash(item.password, 12);
    console.log(`${item.type.toUpperCase()} (password: ${item.password})`);
    console.log(`Hash: ${hash}\n`);
  }

  console.log('=== SAMPLE SQL COMMANDS ===\n');
  
  const adminHash = await bcrypt.hash('admin123', 12);
  console.log(`-- Update admin password`);
  console.log(`UPDATE users SET password_hash = '${adminHash}' WHERE email = 'admin@tkanida.com';\n`);
  
  const teacherHash = await bcrypt.hash('teacher123', 12);
  console.log(`-- Update all teacher passwords (default)`);
  console.log(`UPDATE user_accounts SET password = '${teacherHash}' WHERE role = 'teacher';\n`);
  
  const parentHash = await bcrypt.hash('parent123', 12);
  console.log(`-- Update all parent passwords (default)`);
  console.log(`UPDATE user_accounts SET password = '${parentHash}' WHERE role = 'parent';\n`);
}

generateHashedPasswords().catch(console.error);
