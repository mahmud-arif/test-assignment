-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."products" add column "stock" integer
--  not null default '0';
-- Add the 'stock' column to the 'products' table
ALTER TABLE products
ADD COLUMN stock integer;
