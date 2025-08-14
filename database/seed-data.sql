-- NSSF Pensioner Portal - Sample Data for Development
-- This file contains sample data for testing and development purposes

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('app.name', 'NSSF Pensioner Self-Service Portal', 'STRING', 'Application name', 'general'),
('app.version', '1.0.0', 'STRING', 'Application version', 'general'),
('security.session_timeout', '30', 'NUMBER', 'Session timeout in minutes', 'security'),
('security.max_login_attempts', '5', 'NUMBER', 'Maximum failed login attempts before lockout', 'security'),
('security.password_min_length', '8', 'NUMBER', 'Minimum password length', 'security'),
('security.mfa_required', 'true', 'BOOLEAN', 'Multi-factor authentication required', 'security'),
('payments.processing_day', '15', 'NUMBER', 'Day of month for payment processing', 'payments'),
('notifications.email_enabled', 'true', 'BOOLEAN', 'Enable email notifications', 'notifications'),
('notifications.sms_enabled', 'true', 'BOOLEAN', 'Enable SMS notifications', 'notifications'),
('documents.max_file_size', '10485760', 'NUMBER', 'Maximum file size in bytes (10MB)', 'documents'),
('documents.allowed_types', '["pdf","jpg","jpeg","png","doc","docx"]', 'JSON', 'Allowed document types', 'documents');

-- Insert sample pensioners
INSERT INTO pensioners (
    pensioner_id, nssf_number, national_id_number, first_name, middle_name, last_name,
    date_of_birth, gender, phone_number, email_address, postal_address, physical_address,
    district, region, bank_name, bank_account_number, bank_branch, pension_status,
    last_employer, employment_start_date, employment_end_date, total_service_years,
    is_verified, verification_date
) VALUES
-- Sample Pensioner 1
(
    '11111111-1111-1111-1111-111111111111',
    'NSSF001234567',
    'CM90123456789',
    'John',
    'Wasswa',
    'Mukasa',
    '1958-03-15',
    'M',
    '+256701234567',
    'john.mukasa@email.com',
    'P.O. Box 1234, Kampala',
    'Plot 45, Kololo, Kampala',
    'Kampala',
    'Central',
    'Stanbic Bank',
    '9030012345678',
    'Kampala Road Branch',
    'ACTIVE',
    'Uganda Revenue Authority',
    '1985-01-15',
    '2023-03-15',
    38.2,
    true,
    '2023-03-20 10:30:00'
),
-- Sample Pensioner 2
(
    '22222222-2222-2222-2222-222222222222',
    'NSSF002345678',
    'CM90234567890',
    'Mary',
    'Nakato',
    'Ssemakula',
    '1960-07-22',
    'F',
    '+256702345678',
    'mary.ssemakula@email.com',
    'P.O. Box 5678, Entebbe',
    'Plot 23, Victoria Avenue, Entebbe',
    'Wakiso',
    'Central',
    'Centenary Bank',
    '1234567890123',
    'Entebbe Branch',
    'ACTIVE',
    'Bank of Uganda',
    '1988-02-01',
    '2023-07-22',
    35.5,
    true,
    '2023-07-25 14:15:00'
),
-- Sample Pensioner 3
(
    '33333333-3333-3333-3333-333333333333',
    'NSSF003456789',
    'CM90345678901',
    'David',
    'Kato',
    'Okello',
    '1955-11-10',
    'M',
    '+256703456789',
    'david.okello@email.com',
    'P.O. Box 9876, Gulu',
    'Plot 12, Parliament Avenue, Gulu',
    'Gulu',
    'Northern',
    'DFCU Bank',
    '5678901234567',
    'Gulu Branch',
    'ACTIVE',
    'Ministry of Education',
    '1980-09-01',
    '2020-11-10',
    40.2,
    true,
    '2020-11-15 09:45:00'
);

-- Insert sample admin users
INSERT INTO users (
    user_id, pensioner_id, username, password_hash, role, is_active, mfa_enabled,
    created_at, last_login, password_last_changed
) VALUES
-- Admin user
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'admin',
    '$2b$12$LQv3c1yqBwEHyOSJZrOhRu.q8B8K9XwqNzF8Lj8qG3yKjHtF5gR2u', -- password: admin123
    'ADMIN',
    true,
    true,
    '2024-01-01 08:00:00',
    '2024-08-14 09:30:00',
    '2024-01-01 08:00:00'
),
-- Support staff user
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    NULL,
    'support1',
    '$2b$12$LQv3c1yqBwEHyOSJZrOhRu.q8B8K9XwqNzF8Lj8qG3yKjHtF5gR2u', -- password: support123
    'SUPPORT_STAFF',
    true,
    true,
    '2024-01-01 08:00:00',
    '2024-08-14 08:15:00',
    '2024-01-01 08:00:00'
),
-- Pensioner users
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'john.mukasa',
    '$2b$12$LQv3c1yqBwEHyOSJZrOhRu.q8B8K9XwqNzF8Lj8qG3yKjHtF5gR2u', -- password: pensioner123
    'PENSIONER',
    true,
    false,
    '2023-03-20 10:30:00',
    '2024-08-14 07:45:00',
    '2024-06-01 10:00:00'
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'mary.ssemakula',
    '$2b$12$LQv3c1yqBwEHyOSJZrOhRu.q8B8K9XwqNzF8Lj8qG3yKjHtF5gR2u', -- password: pensioner123
    'PENSIONER',
    true,
    true,
    '2023-07-25 14:15:00',
    '2024-08-13 16:20:00',
    '2024-05-15 11:30:00'
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '33333333-3333-3333-3333-333333333333',
    'david.okello',
    '$2b$12$LQv3c1yqBwEHyOSJZrOhRu.q8B8K9XwqNzF8Lj8qG3yKjHtF5gR2u', -- password: pensioner123
    'PENSIONER',
    true,
    false,
    '2020-11-15 09:45:00',
    '2024-08-12 15:30:00',
    '2024-04-10 09:15:00'
);

-- Insert sample benefits
INSERT INTO benefits (
    benefit_id, pensioner_id, benefit_type, monthly_benefit_amount, annual_benefit_amount,
    total_contributions, interest_earned, benefit_start_date, is_active,
    approved_by, approval_date, next_review_date
) VALUES
-- John Mukasa's Age Benefit
(
    uuid_generate_v4(),
    '11111111-1111-1111-1111-111111111111',
    'AGE',
    1500000.00,
    18000000.00,
    45000000.00,
    12000000.00,
    '2023-03-15',
    true,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2023-03-20 10:30:00',
    '2024-03-15'
),
-- Mary Ssemakula's Age Benefit
(
    uuid_generate_v4(),
    '22222222-2222-2222-2222-222222222222',
    'AGE',
    1200000.00,
    14400000.00,
    38000000.00,
    9500000.00,
    '2023-07-22',
    true,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2023-07-25 14:15:00',
    '2024-07-22'
),
-- David Okello's Age Benefit
(
    uuid_generate_v4(),
    '33333333-3333-3333-3333-333333333333',
    'AGE',
    1800000.00,
    21600000.00,
    52000000.00,
    15500000.00,
    '2020-11-10',
    true,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '2020-11-15 09:45:00',
    '2025-11-10'
);

-- Insert sample payments (last 12 months for each pensioner)
INSERT INTO payments (
    payment_id, benefit_id, payment_amount, payment_date, payment_period_start,
    payment_period_end, payment_status, bank_reference_number, transaction_reference,
    processed_date, processed_by, batch_id
) 
SELECT 
    uuid_generate_v4(),
    b.benefit_id,
    b.monthly_benefit_amount,
    DATE '2024-01-15' + (generate_series(0, 7) * INTERVAL '1 month'),
    DATE '2024-01-01' + (generate_series(0, 7) * INTERVAL '1 month'),
    DATE '2024-01-31' + (generate_series(0, 7) * INTERVAL '1 month'),
    'PROCESSED',
    'BNK' || TO_CHAR(generate_series(100001, 100008), 'FM000000'),
    'TXN' || TO_CHAR(generate_series(200001, 200008), 'FM000000'),
    DATE '2024-01-15' + (generate_series(0, 7) * INTERVAL '1 month') + INTERVAL '2 hours',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'BATCH_' || TO_CHAR(DATE '2024-01-15' + (generate_series(0, 7) * INTERVAL '1 month'), 'YYYY_MM')
FROM benefits b
WHERE b.is_active = true;

-- Insert sample documents
INSERT INTO documents (
    document_id, pensioner_id, document_name, document_type, document_category,
    document_date, uploaded_by, file_path, file_size, mime_type
) VALUES
-- John Mukasa's documents
(
    uuid_generate_v4(),
    '11111111-1111-1111-1111-111111111111',
    'Pension Certificate 2023',
    'CERTIFICATE',
    'OFFICIAL',
    '2023-03-20',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '/documents/certificates/john_mukasa_pension_cert_2023.pdf',
    1024576,
    'application/pdf'
),
(
    uuid_generate_v4(),
    '11111111-1111-1111-1111-111111111111',
    'Annual Pension Statement 2023',
    'PENSION_STATEMENT',
    'STATEMENT',
    '2023-12-31',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '/documents/statements/john_mukasa_statement_2023.pdf',
    2048576,
    'application/pdf'
),
-- Mary Ssemakula's documents
(
    uuid_generate_v4(),
    '22222222-2222-2222-2222-222222222222',
    'Pension Certificate 2023',
    'CERTIFICATE',
    'OFFICIAL',
    '2023-07-25',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '/documents/certificates/mary_ssemakula_pension_cert_2023.pdf',
    1024576,
    'application/pdf'
),
-- David Okello's documents
(
    uuid_generate_v4(),
    '33333333-3333-3333-3333-333333333333',
    'Pension Certificate 2020',
    'CERTIFICATE',
    'OFFICIAL',
    '2020-11-15',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '/documents/certificates/david_okello_pension_cert_2020.pdf',
    1024576,
    'application/pdf'
);

-- Insert sample messages
INSERT INTO messages (
    message_id, sender_id, recipient_id, pensioner_id, subject, message_body,
    sent_at, message_status, thread_id
) VALUES
-- Welcome message from support to John
(
    uuid_generate_v4(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'Welcome to NSSF Self-Service Portal',
    'Dear Mr. Mukasa, Welcome to the NSSF Pensioner Self-Service Portal. Your account has been successfully set up. You can now access your pension information, download statements, and communicate with our support team through this portal.',
    '2023-03-20 11:00:00',
    'READ',
    uuid_generate_v4()
),
-- Query from Mary about payment
(
    uuid_generate_v4(),
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Query about August 2024 Payment',
    'Dear NSSF Support Team, I have not received my pension payment for August 2024. Could you please help me check the status? My bank account details are up to date.',
    '2024-08-05 14:30:00',
    'READ',
    uuid_generate_v4()
),
-- Response from support to Mary
(
    uuid_generate_v4(),
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'Re: Query about August 2024 Payment',
    'Dear Ms. Ssemakula, Thank you for your inquiry. I have checked your account and your August 2024 payment was processed on August 15th. The payment should reflect in your account within 2-3 working days. If you don''t receive it by August 18th, please contact us again.',
    '2024-08-05 16:45:00',
    'READ',
    uuid_generate_v4()
);

-- Insert sample notifications
INSERT INTO notifications (
    notification_id, user_id, title, message, notification_type, is_read,
    created_at, delivery_method
) VALUES
-- System maintenance notification
(
    uuid_generate_v4(),
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Scheduled System Maintenance',
    'The NSSF portal will undergo scheduled maintenance on Saturday, August 17th from 2:00 AM to 6:00 AM. The system will be temporarily unavailable during this time.',
    'INFO',
    false,
    '2024-08-14 10:00:00',
    'SYSTEM'
),
-- Payment processed notification
(
    uuid_generate_v4(),
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Payment Processed Successfully',
    'Your pension payment for August 2024 has been processed and transferred to your bank account ending in 0123.',
    'SUCCESS',
    true,
    '2024-08-15 10:30:00',
    'SYSTEM'
),
-- Profile update reminder
(
    uuid_generate_v4(),
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Profile Update Reminder',
    'Please review and update your contact information and banking details to ensure uninterrupted service.',
    'WARNING',
    false,
    '2024-08-10 09:00:00',
    'SYSTEM'
);

-- Insert sample verification requests
INSERT INTO verification_requests (
    request_id, pensioner_id, requested_by, request_type, request_data, current_data,
    verification_status, created_at
) VALUES
-- Bank account change request
(
    uuid_generate_v4(),
    '22222222-2222-2222-2222-222222222222',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'BANK_CHANGE',
    '{"bank_name": "ABSA Bank", "bank_account_number": "9876543210987", "bank_branch": "Garden City Branch"}',
    '{"bank_name": "Centenary Bank", "bank_account_number": "1234567890123", "bank_branch": "Entebbe Branch"}',
    'PENDING',
    '2024-08-12 11:30:00'
),
-- Address update request
(
    uuid_generate_v4(),
    '33333333-3333-3333-3333-333333333333',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'ADDRESS_CHANGE',
    '{"physical_address": "Plot 25, New Parliament Avenue, Gulu", "postal_address": "P.O. Box 1111, Gulu"}',
    '{"physical_address": "Plot 12, Parliament Avenue, Gulu", "postal_address": "P.O. Box 9876, Gulu"}',
    'VERIFIED',
    '2024-08-01 14:20:00'
);

-- Insert sample audit logs
INSERT INTO audit_logs (
    log_id, user_id, pensioner_id, action, table_name, record_id,
    old_values, new_values, ip_address, user_agent, request_path, request_method,
    timestamp, description
) VALUES
-- User login
(
    uuid_generate_v4(),
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'LOGIN',
    'users',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    NULL,
    '{"last_login": "2024-08-14T07:45:00Z"}',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    '/auth/login',
    'POST',
    '2024-08-14 07:45:00',
    'User login successful'
),
-- Profile update
(
    uuid_generate_v4(),
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'UPDATE',
    'pensioners',
    '22222222-2222-2222-2222-222222222222',
    '{"phone_number": "+256702345678"}',
    '{"phone_number": "+256702345679"}',
    '192.168.1.101',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
    '/api/profile/update',
    'PUT',
    '2024-08-13 16:20:00',
    'Phone number updated'
),
-- Payment processing
(
    uuid_generate_v4(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'CREATE',
    'payments',
    NULL,
    NULL,
    '{"payment_amount": 1500000.00, "payment_status": "PROCESSED"}',
    '10.0.0.50',
    'NSSF-PaymentSystem/1.0',
    '/api/payments/process',
    'POST',
    '2024-08-15 10:30:00',
    'Monthly pension payment processed'
);

-- Create views for commonly used queries
CREATE OR REPLACE VIEW active_pensioners_summary AS
SELECT 
    p.pensioner_id,
    p.nssf_number,
    p.first_name || ' ' || p.last_name AS full_name,
    p.phone_number,
    p.email_address,
    p.pension_status,
    b.benefit_type,
    b.monthly_benefit_amount,
    b.benefit_start_date,
    COALESCE(last_payment.payment_date, 'No payments yet') AS last_payment_date
FROM pensioners p
LEFT JOIN benefits b ON p.pensioner_id = b.pensioner_id AND b.is_active = true
LEFT JOIN (
    SELECT DISTINCT ON (benefit_id) 
        benefit_id, payment_date
    FROM payments 
    WHERE payment_status = 'PROCESSED'
    ORDER BY benefit_id, payment_date DESC
) last_payment ON b.benefit_id = last_payment.benefit_id
WHERE p.pension_status = 'ACTIVE' 
    AND p.is_deleted = false;

CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    p.pensioner_id,
    pen.nssf_number,
    pen.first_name || ' ' || pen.last_name AS pensioner_name,
    b.benefit_type,
    COUNT(pay.payment_id) as total_payments,
    SUM(pay.payment_amount) as total_amount_paid,
    MAX(pay.payment_date) as last_payment_date,
    MIN(pay.payment_date) as first_payment_date
FROM pensioners pen
JOIN benefits b ON pen.pensioner_id = b.pensioner_id
LEFT JOIN payments pay ON b.benefit_id = pay.benefit_id AND pay.payment_status = 'PROCESSED'
WHERE pen.pension_status = 'ACTIVE' AND b.is_active = true
GROUP BY p.pensioner_id, pen.nssf_number, pensioner_name, b.benefit_type;

-- Insert helpful comments
COMMENT ON VIEW active_pensioners_summary IS 'Summary view of all active pensioners with their latest benefit and payment information';
COMMENT ON VIEW payment_summary IS 'Aggregated payment statistics for each pensioner and benefit type';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'NSSF Pensioner Portal sample data inserted successfully!';
    RAISE NOTICE 'Sample users created:';
    RAISE NOTICE '  Admin: username=admin, password=admin123';
    RAISE NOTICE '  Support: username=support1, password=support123';
    RAISE NOTICE '  Pensioner 1: username=john.mukasa, password=pensioner123';
    RAISE NOTICE '  Pensioner 2: username=mary.ssemakula, password=pensioner123';
    RAISE NOTICE '  Pensioner 3: username=david.okello, password=pensioner123';
    RAISE NOTICE 'Note: Change all default passwords in production!';
END $$;
