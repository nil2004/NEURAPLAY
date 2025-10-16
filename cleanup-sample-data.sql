-- =============================================
-- Clean Up Sample Data
-- =============================================
-- Run this script in your Supabase SQL Editor to remove sample data

-- Delete sample registrations
DELETE FROM registrations WHERE team_name IN (
    'Thunder Squad',
    'Eagle Warriors', 
    'Fire Hawks',
    'Phoenix Rising',
    'Storm Breakers'
);

-- Delete sample notifications
DELETE FROM notifications WHERE title IN (
    'Tournament Schedule Update',
    'Registration Deadline Reminder',
    'Venue Change Notice',
    'Prize Distribution Info'
);

-- Delete sample admin user (optional - keep if you want to use it)
-- DELETE FROM admin_users WHERE email = 'admin@collegeclashhub.com';

-- Verify cleanup
SELECT 'Registrations remaining:' as info, COUNT(*) as count FROM registrations;
SELECT 'Notifications remaining:' as info, COUNT(*) as count FROM notifications;
SELECT 'Admin users remaining:' as info, COUNT(*) as count FROM admin_users;
