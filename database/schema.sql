-- NSSF Pensioner Self-Service Portal Database Schema
-- PostgreSQL Database Schema for comprehensive pension management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('PENSIONER', 'ADMIN', 'SUPPORT_STAFF', 'FINANCE_OFFICER');
CREATE TYPE pension_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DECEASED', 'TRANSFERRED', 'PENDING');
CREATE TYPE benefit_type AS ENUM ('AGE', 'SURVIVORS', 'INVALIDITY', 'WITHDRAWAL', 'MIDTERM', 'EMIGRATION', 'EXEMPTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSED', 'FAILED', 'CANCELLED', 'REVERSED');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');
CREATE TYPE message_status AS ENUM ('UNREAD', 'READ', 'ARCHIVED');
CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PROFILE_UPDATE');

-- Pensioners table - Core pensioner information
CREATE TABLE pensioners (
    pensioner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nssf_number VARCHAR(20) UNIQUE NOT NULL,
    national_id_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    nationality VARCHAR(50) DEFAULT 'Ugandan',
    
    -- Contact Information
    phone_number VARCHAR(20),
    email_address VARCHAR(255),
    postal_address TEXT,
    physical_address TEXT,
    district VARCHAR(100),
    region VARCHAR(100),
    
    -- Employment Information
    last_employer VARCHAR(255),
    employment_start_date DATE,
    employment_end_date DATE,
    total_service_years DECIMAL(5,2),
    
    -- Banking Information (encrypted)
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_branch VARCHAR(100),
    
    -- Status and Metadata
    pension_status pension_status DEFAULT 'PENDING',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_photo_url VARCHAR(500),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    verified_by UUID,
    
    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_birth_date CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years'),
    CONSTRAINT valid_phone CHECK (phone_number ~ '^[+]?[0-9\s\-\(\)]{7,20}$'),
    CONSTRAINT valid_email CHECK (email_address ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Users table - Authentication and system access
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pensioner_id UUID REFERENCES pensioners(pensioner_id),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'PENSIONER',
    
    -- Security settings
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    password_last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    must_change_password BOOLEAN DEFAULT FALSE,
    
    -- Multi-factor authentication
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(32),
    backup_codes TEXT[], -- Array of backup codes
    
    -- Session management
    current_session_token VARCHAR(255),
    session_expires_at TIMESTAMP,
    refresh_token VARCHAR(255),
    refresh_token_expires_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_password_reset TIMESTAMP,
    
    CONSTRAINT username_length CHECK (length(username) >= 3),
    CONSTRAINT password_changed_recently CHECK (password_last_changed >= created_at)
);

-- Benefits table - Pension benefit information
CREATE TABLE benefits (
    benefit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pensioner_id UUID NOT NULL REFERENCES pensioners(pensioner_id),
    benefit_type benefit_type NOT NULL,
    
    -- Benefit calculation details
    monthly_benefit_amount DECIMAL(15,2) NOT NULL,
    annual_benefit_amount DECIMAL(15,2) NOT NULL,
    commutation_amount DECIMAL(15,2),
    total_contributions DECIMAL(15,2),
    interest_earned DECIMAL(15,2),
    
    -- Benefit period
    benefit_start_date DATE NOT NULL,
    benefit_end_date DATE,
    next_review_date DATE,
    
    -- Status and approval
    is_active BOOLEAN DEFAULT TRUE,
    approved_by UUID,
    approval_date TIMESTAMP,
    approval_comments TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_amounts CHECK (
        monthly_benefit_amount > 0 AND 
        annual_benefit_amount > 0
    ),
    CONSTRAINT valid_benefit_period CHECK (benefit_start_date <= COALESCE(benefit_end_date, CURRENT_DATE))
);

-- Payments table - Payment history and transactions
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    benefit_id UUID NOT NULL REFERENCES benefits(benefit_id),
    
    -- Payment details
    payment_amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
    
    -- Bank transfer details
    bank_reference_number VARCHAR(100),
    transaction_reference VARCHAR(100),
    
    -- Status tracking
    payment_status payment_status DEFAULT 'PENDING',
    initiated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP,
    failed_reason TEXT,
    
    -- Processing information
    processed_by UUID,
    batch_id VARCHAR(50),
    
    -- Accounting
    debit_account VARCHAR(20),
    credit_account VARCHAR(20),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_payment_amount CHECK (payment_amount > 0),
    CONSTRAINT valid_payment_period CHECK (payment_period_start <= payment_period_end)
);

-- Documents table - Store pensioner documents and statements
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pensioner_id UUID NOT NULL REFERENCES pensioners(pensioner_id),
    
    -- Document details
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'PENSION_STATEMENT', 'CERTIFICATE', 'FORM', etc.
    document_category VARCHAR(50),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Document metadata
    document_date DATE,
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    
    -- Security
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key VARCHAR(255),
    
    -- Metadata
    uploaded_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- Messages table - Communication between pensioners and NSSF staff
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    sender_id UUID NOT NULL REFERENCES users(user_id),
    recipient_id UUID NOT NULL REFERENCES users(user_id),
    pensioner_id UUID NOT NULL REFERENCES pensioners(pensioner_id),
    
    -- Message content
    subject VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    attachment_ids UUID[],
    
    -- Threading
    parent_message_id UUID REFERENCES messages(message_id),
    thread_id UUID,
    
    -- Status tracking
    message_status message_status DEFAULT 'UNREAD',
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    archived_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT different_users CHECK (sender_id != recipient_id),
    CONSTRAINT non_empty_subject CHECK (length(trim(subject)) > 0),
    CONSTRAINT non_empty_body CHECK (length(trim(message_body)) > 0)
);

-- Verification Requests table - Handle profile update verifications
CREATE TABLE verification_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pensioner_id UUID NOT NULL REFERENCES pensioners(pensioner_id),
    requested_by UUID NOT NULL REFERENCES users(user_id),
    
    -- Request details
    request_type VARCHAR(50) NOT NULL, -- 'PROFILE_UPDATE', 'BANK_CHANGE', 'ADDRESS_CHANGE'
    request_data JSONB NOT NULL, -- Store the changes being requested
    current_data JSONB, -- Store current values for comparison
    
    -- Supporting documents
    supporting_documents UUID[],
    
    -- Status and processing
    verification_status verification_status DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES users(user_id),
    review_date TIMESTAMP,
    review_comments TEXT,
    rejection_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Notifications table - System notifications for users
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
    
    -- Targeting
    is_global BOOLEAN DEFAULT FALSE,
    target_roles user_role[],
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Delivery
    delivery_method VARCHAR(50) DEFAULT 'SYSTEM', -- 'SYSTEM', 'EMAIL', 'SMS'
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '90 days'),
    
    CONSTRAINT valid_notification_expiry CHECK (expires_at > created_at)
);

-- Audit Log table - Track all system activities
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Actor information
    user_id UUID REFERENCES users(user_id),
    pensioner_id UUID REFERENCES pensioners(pensioner_id),
    session_id VARCHAR(255),
    
    -- Action details
    action audit_action NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    
    -- Change tracking
    old_values JSONB,
    new_values JSONB,
    
    -- Request information
    ip_address INET,
    user_agent TEXT,
    request_path VARCHAR(500),
    request_method VARCHAR(10),
    
    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    
    -- Indexing fields
    created_date DATE GENERATED ALWAYS AS (timestamp::DATE) STORED
);

-- System Settings table - Application configuration
CREATE TABLE system_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'STRING', -- 'STRING', 'NUMBER', 'BOOLEAN', 'JSON'
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    category VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_pensioners_nssf_number ON pensioners(nssf_number);
CREATE INDEX idx_pensioners_national_id ON pensioners(national_id_number);
CREATE INDEX idx_pensioners_status ON pensioners(pension_status);
CREATE INDEX idx_pensioners_last_updated ON pensioners(last_updated);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_pensioner_id ON users(pensioner_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_last_login ON users(last_login);

CREATE INDEX idx_benefits_pensioner_id ON benefits(pensioner_id);
CREATE INDEX idx_benefits_type ON benefits(benefit_type);
CREATE INDEX idx_benefits_active ON benefits(is_active);
CREATE INDEX idx_benefits_start_date ON benefits(benefit_start_date);

CREATE INDEX idx_payments_benefit_id ON payments(benefit_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_period ON payments(payment_period_start, payment_period_end);

CREATE INDEX idx_documents_pensioner_id ON documents(pensioner_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_date ON documents(document_date);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_pensioner ON messages(pensioner_id);
CREATE INDEX idx_messages_status ON messages(message_status);
CREATE INDEX idx_messages_thread ON messages(thread_id);

CREATE INDEX idx_verification_requests_pensioner ON verification_requests(pensioner_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(verification_status);
CREATE INDEX idx_verification_requests_type ON verification_requests(request_type);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_date);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers to relevant tables
CREATE TRIGGER update_pensioners_updated_at BEFORE UPDATE ON pensioners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_benefits_updated_at BEFORE UPDATE ON benefits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable for sensitive tables
ALTER TABLE pensioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Pensioners can only see their own data
CREATE POLICY pensioner_own_data ON pensioners FOR ALL TO pensioner_role USING (pensioner_id = current_setting('app.current_pensioner_id')::UUID);

-- Admins can see all data
CREATE POLICY admin_all_data ON pensioners FOR ALL TO admin_role USING (true);

-- Comments for documentation
COMMENT ON TABLE pensioners IS 'Core pensioner information including personal details and contact information';
COMMENT ON TABLE users IS 'System users with authentication credentials and security settings';
COMMENT ON TABLE benefits IS 'Pension benefit details and calculations';
COMMENT ON TABLE payments IS 'Payment transactions and history';
COMMENT ON TABLE documents IS 'Document storage and management';
COMMENT ON TABLE messages IS 'Communication system between pensioners and NSSF staff';
COMMENT ON TABLE verification_requests IS 'Handle verification of profile updates and changes';
COMMENT ON TABLE notifications IS 'System notifications and alerts';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all system activities';
COMMENT ON TABLE system_settings IS 'Application configuration and settings';
