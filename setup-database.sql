-- NSSF Pensioner Database Setup Script
-- Run this script as postgres superuser to create the database and user

-- Create the user first
CREATE USER nssf_user WITH PASSWORD 'secure_password';

-- Create the database
CREATE DATABASE nssf_pensioner_db WITH OWNER nssf_user;

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE nssf_pensioner_db TO nssf_user;

-- Connect to the new database
\c nssf_pensioner_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO nssf_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nssf_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nssf_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO nssf_user;

-- Display success message
SELECT 'Database setup completed successfully!' as status;
