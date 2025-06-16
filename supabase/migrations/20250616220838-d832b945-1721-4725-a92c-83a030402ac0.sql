
-- First, let's ensure we have a default job role for Appointment Setter
INSERT INTO job_roles (name, description, status) 
SELECT 'Appointment Setter', 'Remote appointment setting position for healthcare providers', 'active'
WHERE NOT EXISTS (SELECT 1 FROM job_roles WHERE name = 'Appointment Setter');

-- Insert candidates based on the Google Sheets data
INSERT INTO candidates (name, email, phone, created_at) 
SELECT * FROM (
    VALUES 
    ('Justin Lesh', 'justinlesh1@gmail.com', NULL, '2025-01-15 14:30:00'::timestamp),
    ('Wendy Tzloney', 'wtzloney@gmail.com', '+27-11-123-4567', '2025-01-16 15:51:00'::timestamp),
    ('Alina Rodriguez', 'alimpg08@gmail.com', '+1-809-555-0123', '2025-01-16 16:12:00'::timestamp),
    ('Setlhomara Molefe', 'setlhomara@gmail.com', '+27-11-987-6543', '2025-01-16 16:21:00'::timestamp),
    ('Maria Santos', 'maria.santos@email.com', '+55-11-98765-4321', '2025-01-14 10:15:00'::timestamp),
    ('David Kim', 'david.kim@outlook.com', '+1-555-234-5678', '2025-01-14 11:30:00'::timestamp),
    ('Sarah Johnson', 'sarah.j@gmail.com', '+1-404-555-7890', '2025-01-13 09:45:00'::timestamp),
    ('Carlos Mendez', 'carlos.mendez@hotmail.com', '+52-55-1234-5678', '2025-01-13 14:20:00'::timestamp),
    ('Priya Patel', 'priya.patel@yahoo.com', '+91-98765-43210', '2025-01-12 16:30:00'::timestamp),
    ('James Wilson', 'j.wilson@email.com', '+44-20-7946-0958', '2025-01-12 13:15:00'::timestamp)
) AS new_candidates(name, email, phone, created_at)
WHERE NOT EXISTS (
    SELECT 1 FROM candidates WHERE email = new_candidates.email
);

-- Now insert applications for these candidates
DO $$
DECLARE
    appointment_setter_role_id UUID;
    candidate_rec RECORD;
BEGIN
    SELECT id INTO appointment_setter_role_id FROM job_roles WHERE name = 'Appointment Setter' LIMIT 1;
    
    -- Insert applications for each candidate
    FOR candidate_rec IN 
        SELECT id, email FROM candidates 
        WHERE email IN (
            'justinlesh1@gmail.com', 'wtzloney@gmail.com', 'alimpg08@gmail.com', 
            'setlhomara@gmail.com', 'maria.santos@email.com', 'david.kim@outlook.com',
            'sarah.j@gmail.com', 'carlos.mendez@hotmail.com', 'priya.patel@yahoo.com', 
            'j.wilson@email.com'
        )
    LOOP
        -- Check if application already exists
        IF NOT EXISTS (SELECT 1 FROM applications WHERE candidate_id = candidate_rec.id AND job_role_id = appointment_setter_role_id) THEN
            INSERT INTO applications (
                candidate_id, 
                job_role_id, 
                status, 
                applied_date, 
                has_voice_recording, 
                has_resume,
                rating,
                notes,
                form_data
            ) VALUES (
                candidate_rec.id,
                appointment_setter_role_id,
                CASE 
                    WHEN candidate_rec.email = 'justinlesh1@gmail.com' THEN 'applied'::application_status
                    WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 'reviewed'::application_status
                    WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 'interview_scheduled'::application_status
                    WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 'reviewed'::application_status
                    WHEN candidate_rec.email = 'maria.santos@email.com' THEN 'interview_completed'::application_status
                    WHEN candidate_rec.email = 'david.kim@outlook.com' THEN 'offer_sent'::application_status
                    WHEN candidate_rec.email = 'sarah.j@gmail.com' THEN 'hired'::application_status
                    WHEN candidate_rec.email = 'carlos.mendez@hotmail.com' THEN 'rejected'::application_status
                    WHEN candidate_rec.email = 'priya.patel@yahoo.com' THEN 'interview_scheduled'::application_status
                    ELSE 'applied'::application_status
                END,
                CASE 
                    WHEN candidate_rec.email = 'justinlesh1@gmail.com' THEN '2025-01-15 14:30:00'::timestamp
                    WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN '2025-01-16 15:51:00'::timestamp
                    WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN '2025-01-16 16:12:00'::timestamp
                    WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN '2025-01-16 16:21:00'::timestamp
                    WHEN candidate_rec.email = 'maria.santos@email.com' THEN '2025-01-14 10:15:00'::timestamp
                    WHEN candidate_rec.email = 'david.kim@outlook.com' THEN '2025-01-14 11:30:00'::timestamp
                    WHEN candidate_rec.email = 'sarah.j@gmail.com' THEN '2025-01-13 09:45:00'::timestamp
                    WHEN candidate_rec.email = 'carlos.mendez@hotmail.com' THEN '2025-01-13 14:20:00'::timestamp
                    WHEN candidate_rec.email = 'priya.patel@yahoo.com' THEN '2025-01-12 16:30:00'::timestamp
                    ELSE '2025-01-12 13:15:00'::timestamp
                END,
                CASE 
                    WHEN candidate_rec.email IN ('wtzloney@gmail.com', 'alimpg08@gmail.com', 'setlhomara@gmail.com') THEN true
                    ELSE false
                END,
                true,
                CASE 
                    WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 3
                    WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 4
                    WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 2
                    WHEN candidate_rec.email = 'maria.santos@email.com' THEN 5
                    WHEN candidate_rec.email = 'david.kim@outlook.com' THEN 4
                    WHEN candidate_rec.email = 'sarah.j@gmail.com' THEN 5
                    WHEN candidate_rec.email = 'priya.patel@yahoo.com' THEN 4
                    ELSE NULL
                END,
                CASE 
                    WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 'Based in Johannesburg. Available Mon-Fri 8am-5pm. Some pronunciation challenges but understandable.'
                    WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 'From Santo Domingo. Available M-F 8am-2pm CST. May be difficult for older listeners to understand.'
                    WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 'Johannesburg, South Africa. Flexible schedule. Working hard on English pronunciation.'
                    WHEN candidate_rec.email = 'maria.santos@email.com' THEN 'Excellent communication skills. Very professional during interview.'
                    WHEN candidate_rec.email = 'david.kim@outlook.com' THEN 'Strong technical background. Great fit for the role.'
                    WHEN candidate_rec.email = 'sarah.j@gmail.com' THEN 'Hired! Excellent performance in all areas.'
                    WHEN candidate_rec.email = 'carlos.mendez@hotmail.com' THEN 'Did not meet minimum requirements.'
                    WHEN candidate_rec.email = 'priya.patel@yahoo.com' THEN 'Good candidate, scheduling follow-up interview.'
                    ELSE 'Initial application received.'
                END,
                jsonb_build_object(
                    'availability', CASE 
                        WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 'Mon-Fri 8am-5pm'
                        WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 'M-F 8am-2pm CST'
                        WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 'Flexible'
                        ELSE 'Full-time availability'
                    END,
                    'location', CASE 
                        WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 'Johannesburg, South Africa'
                        WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 'Santo Domingo, Dominican Republic'
                        WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 'Johannesburg, South Africa'
                        WHEN candidate_rec.email = 'maria.santos@email.com' THEN 'São Paulo, Brazil'
                        WHEN candidate_rec.email = 'david.kim@outlook.com' THEN 'Seoul, South Korea'
                        WHEN candidate_rec.email = 'sarah.j@gmail.com' THEN 'Atlanta, GA, USA'
                        WHEN candidate_rec.email = 'carlos.mendez@hotmail.com' THEN 'Mexico City, Mexico'
                        WHEN candidate_rec.email = 'priya.patel@yahoo.com' THEN 'Mumbai, India'
                        ELSE 'Remote'
                    END,
                    'voice_recording_url', CASE 
                        WHEN candidate_rec.email = 'wtzloney@gmail.com' THEN 'https://voca.ro/1mq31IjOtuzt'
                        WHEN candidate_rec.email = 'alimpg08@gmail.com' THEN 'https://voca.ro/1nXy88PWQJJq'
                        WHEN candidate_rec.email = 'setlhomara@gmail.com' THEN 'https://voca.ro/102kh3z3oCDe'
                        ELSE NULL
                    END
                )
            );
        END IF;
    END LOOP;
    
    -- Add tags for candidates
    INSERT INTO candidate_tags (candidate_id, tag)
    SELECT c.id, 'International'
    FROM candidates c
    WHERE c.email IN ('wtzloney@gmail.com', 'alimpg08@gmail.com', 'setlhomara@gmail.com')
    AND NOT EXISTS (SELECT 1 FROM candidate_tags WHERE candidate_id = c.id AND tag = 'International');
    
    INSERT INTO candidate_tags (candidate_id, tag)
    SELECT c.id, 'Voice Submitted'
    FROM candidates c
    WHERE c.email IN ('wtzloney@gmail.com', 'alimpg08@gmail.com', 'setlhomara@gmail.com')
    AND NOT EXISTS (SELECT 1 FROM candidate_tags WHERE candidate_id = c.id AND tag = 'Voice Submitted');
    
    INSERT INTO candidate_tags (candidate_id, tag)
    SELECT c.id, 'Top Performer'
    FROM candidates c
    WHERE c.email IN ('sarah.j@gmail.com', 'maria.santos@email.com', 'david.kim@outlook.com')
    AND NOT EXISTS (SELECT 1 FROM candidate_tags WHERE candidate_id = c.id AND tag = 'Top Performer');
    
    INSERT INTO candidate_tags (candidate_id, tag)
    SELECT c.id, 'Available Immediately'
    FROM candidates c
    WHERE c.email IN ('justinlesh1@gmail.com', 'j.wilson@email.com')
    AND NOT EXISTS (SELECT 1 FROM candidate_tags WHERE candidate_id = c.id AND tag = 'Available Immediately');
    
    -- Set interview dates for appropriate candidates
    UPDATE applications 
    SET interview_date = '2025-01-17 14:00:00'
    WHERE candidate_id IN (
        SELECT id FROM candidates WHERE email = 'alimpg08@gmail.com'
    );
    
    UPDATE applications 
    SET interview_date = '2025-01-18 10:00:00'
    WHERE candidate_id IN (
        SELECT id FROM candidates WHERE email = 'priya.patel@yahoo.com'
    );
    
    -- Set offer sent date
    UPDATE applications 
    SET offer_sent_date = '2025-01-16 12:00:00'
    WHERE candidate_id IN (
        SELECT id FROM candidates WHERE email = 'david.kim@outlook.com'
    );
    
END $$;
