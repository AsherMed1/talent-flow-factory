
-- Add the missing ghl_appointment_data column to the applications table
ALTER TABLE public.applications 
ADD COLUMN ghl_appointment_data jsonb;
