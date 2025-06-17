-- Create contacts table with all required fields
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    birthday TEXT NOT NULL,
    address TEXT NOT NULL,
    gift_id TEXT,
    gift_name TEXT,
    gift_price NUMERIC,
    gift_image TEXT,
    gift_category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT contacts_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    recipient_name TEXT NOT NULL,
    gift_id TEXT,
    gift_name TEXT,
    gift_price NUMERIC,
    gift_image TEXT,
    gift_category TEXT,
    status TEXT DEFAULT 'pending',
    transaction_date TIMESTAMPTZ,
    payman_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
CREATE POLICY "Users can view their own contacts"
    ON contacts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
    ON contacts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
    ON contacts FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX contacts_user_id_idx ON contacts(user_id);
CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX contacts_email_idx ON contacts(email);
CREATE INDEX contacts_phone_idx ON contacts(phone); 