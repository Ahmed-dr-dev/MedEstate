-- Simple approach: Just create the enum type for future use
-- The role will be stored in auth.users.raw_user_meta_data for now

CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'bank_agent', 'admin');

-- You can run this in your Supabase SQL editor
-- The signup will store the role in user metadata which doesn't require the enum in the database
