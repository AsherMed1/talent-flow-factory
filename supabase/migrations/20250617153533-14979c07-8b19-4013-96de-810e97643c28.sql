
-- Remove all fake/demo data from the database
-- First, remove all candidate tags associated with demo candidates
DELETE FROM candidate_tags 
WHERE candidate_id IN (
    SELECT id FROM candidates 
    WHERE email IN (
        'justinlesh1@gmail.com', 'wtzloney@gmail.com', 'alimpg08@gmail.com', 
        'setlhomara@gmail.com', 'maria.santos@email.com', 'david.kim@outlook.com',
        'sarah.j@gmail.com', 'carlos.mendez@hotmail.com', 'priya.patel@yahoo.com', 
        'j.wilson@email.com'
    )
);

-- Remove all applications associated with demo candidates
DELETE FROM applications 
WHERE candidate_id IN (
    SELECT id FROM candidates 
    WHERE email IN (
        'justinlesh1@gmail.com', 'wtzloney@gmail.com', 'alimpg08@gmail.com', 
        'setlhomara@gmail.com', 'maria.santos@email.com', 'david.kim@outlook.com',
        'sarah.j@gmail.com', 'carlos.mendez@hotmail.com', 'priya.patel@yahoo.com', 
        'j.wilson@email.com'
    )
);

-- Remove all demo candidates
DELETE FROM candidates 
WHERE email IN (
    'justinlesh1@gmail.com', 'wtzloney@gmail.com', 'alimpg08@gmail.com', 
    'setlhomara@gmail.com', 'maria.santos@email.com', 'david.kim@outlook.com',
    'sarah.j@gmail.com', 'carlos.mendez@hotmail.com', 'priya.patel@yahoo.com', 
    'j.wilson@email.com'
);

-- Optionally, remove the demo job role if no real applications exist for it
-- (You can uncomment this if you want to remove the Appointment Setter role entirely)
-- DELETE FROM job_roles WHERE name = 'Appointment Setter';
