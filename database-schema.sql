-- =============================================
-- College Clash Hub Database Schema
-- =============================================

-- Note: This schema works with standard Supabase user permissions
-- No special database settings required

-- =============================================
-- 1. REGISTRATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    college VARCHAR(200) NOT NULL,
    captain_name VARCHAR(100) NOT NULL,
    captain_email VARCHAR(255) NOT NULL UNIQUE,
    captain_phone VARCHAR(20) NOT NULL,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_college ON registrations(college);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

-- =============================================
-- 2. NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'tournament', 'registration', 'urgent')),
    target_audience VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'registered', 'pending', 'verified')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at);

-- =============================================
-- 3. NOTIFICATION_RECIPIENTS TABLE (for tracking who received notifications)
-- =============================================

CREATE TABLE IF NOT EXISTS notification_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced'))
);

CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification_id ON notification_recipients(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_email ON notification_recipients(recipient_email);

-- =============================================
-- 4. ADMIN_USERS TABLE (for admin authentication)
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 5. TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for registrations (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on registrations" ON registrations
    FOR ALL USING (true);

-- Policies for notifications (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on notifications" ON notifications
    FOR ALL USING (true);

-- Policies for notification_recipients
CREATE POLICY "Allow all operations on notification_recipients" ON notification_recipients
    FOR ALL USING (true);

-- Policies for admin_users
CREATE POLICY "Allow all operations on admin_users" ON admin_users
    FOR ALL USING (true);

-- =============================================
-- 7. SAMPLE DATA (Optional - for testing)
-- =============================================
-- Uncomment the following lines if you want to insert sample data for testing

/*
-- Insert sample registrations
INSERT INTO registrations (team_name, college, captain_name, captain_email, captain_phone, team_members, status, notes) VALUES
('Thunder Squad', 'Delhi University', 'Rajesh Kumar', 'rajesh@du.ac.in', '+91 98765 43210', 
 '["Rajesh Kumar", "Priya Singh", "Amit Sharma", "Sneha Patel"]'::jsonb, 'pending', 'Team captain confirmed via phone'),
('Eagle Warriors', 'IIT Delhi', 'Arjun Mehta', 'arjun@iitd.ac.in', '+91 87654 32109', 
 '["Arjun Mehta", "Kavya Reddy", "Rohit Gupta", "Ananya Joshi"]'::jsonb, 'verified', ''),
('Fire Hawks', 'JNU', 'Deepika Singh', 'deepika@jnu.ac.in', '+91 76543 21098', 
 '["Deepika Singh", "Vikram Singh", "Riya Agarwal", "Karan Malhotra"]'::jsonb, 'verified', ''),
('Phoenix Rising', 'Amity University', 'Siddharth Jain', 'siddharth@amity.edu', '+91 65432 10987', 
 '["Siddharth Jain", "Neha Sharma", "Abhishek Kumar", "Pooja Verma"]'::jsonb, 'rejected', 'Incomplete team member information'),
('Storm Breakers', 'DU North Campus', 'Vikram Patel', 'vikram@du.ac.in', '+91 54321 09876', 
 '["Vikram Patel", "Sonia Gupta", "Rahul Sharma", "Priya Verma"]'::jsonb, 'pending', '');

-- Insert sample notifications
INSERT INTO notifications (title, message, type, target_audience, status, sent_count) VALUES
('Tournament Schedule Update', 'The tournament schedule has been updated. Please check the latest timings on our website.', 'tournament', 'all', 'sent', 156),
('Registration Deadline Reminder', 'Registration closes in 2 days! Make sure to complete your team registration.', 'registration', 'pending', 'sent', 23),
('Venue Change Notice', 'Due to technical issues, the venue has been changed to Main Auditorium. Please arrive 30 minutes early.', 'urgent', 'verified', 'scheduled', 0),
('Prize Distribution Info', 'Prize distribution will happen immediately after the final match. Winners please stay back.', 'tournament', 'verified', 'draft', 0);

-- Insert sample admin user
INSERT INTO admin_users (email, name, role) VALUES
('admin@collegeclashhub.com', 'Admin User', 'admin');
*/

-- =============================================
-- 8. USEFUL QUERIES FOR ADMIN PANEL
-- =============================================

-- =============================================
-- 9. SITE SETTINGS (Hero text/date managed from Admin)
-- =============================================

CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY,
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    countdown_label TEXT NOT NULL DEFAULT 'Tournament starts in:',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on site_settings" ON site_settings;
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true);

-- Seed default settings if not present
INSERT INTO site_settings (id, hero_title, hero_subtitle, event_date, countdown_label)
SELECT 'main', 'Free Fire LAN Tournament', 'Uttarakhand & Delhi Edition', '2025-03-15T10:00:00+05:30', 'Tournament starts in:'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 'main');

-- Get registration statistics
-- SELECT 
--     COUNT(*) as total_teams,
--     COUNT(*) FILTER (WHERE status = 'pending') as pending,
--     COUNT(*) FILTER (WHERE status = 'verified') as verified,
--     COUNT(*) FILTER (WHERE status = 'rejected') as rejected
-- FROM registrations;

-- Get notification statistics
-- SELECT 
--     COUNT(*) as total_notifications,
--     COUNT(*) FILTER (WHERE status = 'sent') as sent,
--     COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
--     COUNT(*) FILTER (WHERE status = 'draft') as drafts
-- FROM notifications;

-- Get recent registrations
-- SELECT * FROM registrations 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- Get recent notifications
-- SELECT * FROM notifications 
-- ORDER BY created_at DESC 
-- LIMIT 10;
