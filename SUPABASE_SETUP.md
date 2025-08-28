# Supabase Database Setup

## Required Table Creation

To resolve the `PGRST205` error and enable account management functionality, you need to create the `user_accounts` table in your Supabase database.

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query

### Step 2: Execute the SQL Script
Copy and paste the following SQL script into the SQL Editor and execute it:

```sql
-- Create user_accounts table for managing parent and teacher login accounts
CREATE TABLE IF NOT EXISTS public.user_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('parent', 'teacher')),
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON public.user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON public.user_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_accounts_role ON public.user_accounts(role);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on user_accounts" ON public.user_accounts
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_accounts_updated_at 
    BEFORE UPDATE ON public.user_accounts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Verify Table Creation
After executing the script, you should see:
- A new `user_accounts` table in your database
- No more `PGRST205` errors in the console
- Account management functionality working properly

### Features Enabled
Once the table is created, the following features will be available:

1. **Key Icon in Student Management**: Click the key icon next to any student to create a parent account
2. **Key Icon in Teacher Management**: Click the key icon next to any teacher to create a teacher account
3. **Account Creation**: Create email/password accounts for parents and teachers
4. **Database Integration**: All account data is stored in Supabase

### Security Notes
- The current setup allows all operations on the `user_accounts` table
- In production, you should implement proper Row Level Security policies
- Consider encrypting passwords before storing them
- Implement proper authentication and authorization mechanisms

### Troubleshooting
If you still see errors after creating the table:
1. Check that the table was created successfully in the Supabase dashboard
2. Verify that your Supabase connection is working
3. Restart your development server
4. Clear your browser cache
