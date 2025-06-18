
-- Insert some placeholder candidates
INSERT INTO candidates (id, name, email, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0123'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'michael.chen@email.com', '+1-555-0124'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Emma Rodriguez', 'emma.rodriguez@email.com', '+1-555-0125'),
  ('550e8400-e29b-41d4-a716-446655440004', 'David Thompson', 'david.thompson@email.com', '+1-555-0126');

-- Insert a placeholder job role if one doesn't exist
INSERT INTO job_roles (id, name, description, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'Customer Service Representative', 'Handle customer inquiries and provide excellent service', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert placeholder applications with scheduled interviews
INSERT INTO applications (
  id, 
  candidate_id, 
  job_role_id, 
  status, 
  applied_date, 
  interview_date,
  form_data,
  has_voice_recording,
  has_resume
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440010',
    'interview_scheduled',
    '2024-12-15 10:00:00'::timestamp,
    '2024-12-20 14:00:00'::timestamp,
    '{"basicInfo": {"name": "Sarah Johnson", "email": "sarah.johnson@email.com"}, "availability": {"timezone": "EST"}, "voiceRecordings": {"hasIntroduction": true}, "uploads": {"hasResume": true}}'::jsonb,
    true,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440010',
    'interview_scheduled',
    '2024-12-14 09:30:00'::timestamp,
    '2024-12-21 10:30:00'::timestamp,
    '{"basicInfo": {"name": "Michael Chen", "email": "michael.chen@email.com"}, "availability": {"timezone": "PST"}, "voiceRecordings": {"hasIntroduction": true, "hasScript": true}, "uploads": {"hasResume": true}}'::jsonb,
    true,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440010',
    'interview_completed',
    '2024-12-13 15:45:00'::timestamp,
    '2024-12-19 16:00:00'::timestamp,
    '{"basicInfo": {"name": "Emma Rodriguez", "email": "emma.rodriguez@email.com"}, "availability": {"timezone": "CST"}, "voiceRecordings": {"hasIntroduction": true}, "uploads": {"hasResume": true, "hasCoverLetter": true}}'::jsonb,
    true,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440010',
    'interview_scheduled',
    '2024-12-12 11:20:00'::timestamp,
    '2024-12-22 13:15:00'::timestamp,
    '{"basicInfo": {"name": "David Thompson", "email": "david.thompson@email.com"}, "availability": {"timezone": "MST"}, "voiceRecordings": {"hasIntroduction": true}, "uploads": {"hasResume": true}}'::jsonb,
    true,
    true
  );
