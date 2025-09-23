-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'bank_agent', 'admin');

-- If you need to add this to an existing users table, uncomment the following:
-- ALTER TABLE auth.users ADD COLUMN user_role user_role DEFAULT 'buyer';
-- 
-- Or if using a custom users/profiles table:
-- ALTER TABLE public.profiles ADD COLUMN user_role user_role DEFAULT 'buyer';

