-- Make user_id NOT NULL in orders table to prevent anonymous orders
-- First, ensure all existing orders have a user_id (update orphaned records if any exist)
-- Then make the column NOT NULL

ALTER TABLE orders 
ALTER COLUMN user_id SET NOT NULL;