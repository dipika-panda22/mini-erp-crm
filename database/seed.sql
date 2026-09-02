-- Optional seed. Generate a bcrypt hash for your own admin password and replace HASH_HERE.
-- Example (Node.js): require('bcryptjs').hashSync('Admin@123', 12)
INSERT INTO users(name,email,password_hash,role)
VALUES ('System Admin','admin@example.com','HASH_HERE','ADMIN')
ON CONFLICT (email) DO NOTHING;
