const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Konfigurasi Supabase - ganti dengan credentials Anda
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Service role key, bukan anon key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migratePasswords() {
  console.log('🚀 Starting password migration...\n');

  try {
    // 1. Migrate user_accounts table (teachers and parents)
    console.log('📝 Migrating user_accounts table...');
    const { data: accounts, error: accountsError } = await supabase
      .from('user_accounts')
      .select('*');

    if (accountsError) {
      console.error('Error fetching user_accounts:', accountsError);
      return;
    }

    for (const account of accounts) {
      // Skip if password already looks like a hash
      if (account.password.startsWith('$2b$') || account.password.startsWith('$2a$')) {
        console.log(`✅ ${account.email} - Already hashed`);
        continue;
      }

      try {
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(account.password, 12);
        
        // Update the record
        const { error: updateError } = await supabase
          .from('user_accounts')
          .update({ password: hashedPassword })
          .eq('id', account.id);

        if (updateError) {
          console.error(`❌ Error updating ${account.email}:`, updateError);
        } else {
          console.log(`✅ ${account.email} - Password hashed successfully`);
        }
      } catch (error) {
        console.error(`❌ Error hashing password for ${account.email}:`, error);
      }
    }

    // 2. Migrate users table (admin accounts)
    console.log('\n📝 Migrating users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    for (const user of users) {
      // Skip if password already looks like a hash
      if (user.password_hash && (user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2a$'))) {
        console.log(`✅ ${user.email} (admin) - Already hashed`);
        continue;
      }

      try {
        // Use a default password if password_hash is empty or null
        const plainPassword = user.password_hash || 'admin123';
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(plainPassword, 12);
        
        // Update the record
        const { error: updateError } = await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('id', user.id);

        if (updateError) {
          console.error(`❌ Error updating ${user.email} (admin):`, updateError);
        } else {
          console.log(`✅ ${user.email} (admin) - Password hashed successfully`);
          if (!user.password_hash) {
            console.log(`   ⚠️  Used default password 'admin123' for ${user.email}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error hashing password for ${user.email} (admin):`, error);
      }
    }

    console.log('\n🎉 Password migration completed!');
    console.log('\n📋 Default passwords:');
    console.log('   Admin: admin123');
    console.log('   Please change default passwords after first login.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Peringatan keamanan
console.log('⚠️  WARNING: This script will modify passwords in your database!');
console.log('⚠️  Make sure you have backed up your database before running this.');
console.log('⚠️  Update the Supabase credentials in this file before running.\n');

// Uncomment the line below to run the migration
// migratePasswords();

console.log('To run the migration:');
console.log('1. Update supabaseUrl and supabaseServiceKey in this file');
console.log('2. Uncomment the migratePasswords() call at the bottom');
console.log('3. Run: node migrate-passwords.js');
