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
