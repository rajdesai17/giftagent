/*
  # Create contacts and transactions tables

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `birthday` (text, MM-DD format)
      - `address` (text)
      - `gift_id` (text)
      - `gift_name` (text)
      - `gift_price` (numeric)
      - `gift_image` (text)
      - `gift_category` (text)
      - `created_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `recipient_name` (text)
      - `gift_id` (text)
      - `gift_name` (text)
      - `gift_price` (numeric)
      - `gift_image` (text)
      - `gift_category` (text)
      - `status` (text)
      - `transaction_date` (timestamp)
      - `payman_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  birthday text NOT NULL,
  address text NOT NULL,
  gift_id text NOT NULL,
  gift_name text NOT NULL,
  gift_price numeric NOT NULL,
  gift_image text NOT NULL,
  gift_category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_name text NOT NULL,
  gift_id text NOT NULL,
  gift_name text NOT NULL,
  gift_price numeric NOT NULL,
  gift_image text NOT NULL,
  gift_category text NOT NULL,
  status text NOT NULL DEFAULT 'paid',
  transaction_date timestamptz DEFAULT now(),
  payman_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);