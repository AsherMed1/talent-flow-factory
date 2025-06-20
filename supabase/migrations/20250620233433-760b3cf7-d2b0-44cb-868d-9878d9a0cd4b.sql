
-- Add indexes to improve query performance on frequently used columns
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_role_id ON applications(job_role_id);
CREATE INDEX IF NOT EXISTS idx_applications_form_data_exists ON applications((form_data IS NOT NULL AND form_data != '{}'::jsonb));

-- Add composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_applications_status_date ON applications(status, applied_date DESC);

-- Optimize the application stats function to use indexes
CREATE OR REPLACE FUNCTION public.get_application_stats()
RETURNS json
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_applications', COUNT(*),
        'active_applications', COUNT(*) FILTER (WHERE status NOT IN ('hired', 'rejected')),
        'interviews_this_week', COUNT(*) FILTER (WHERE 
            interview_date >= CURRENT_DATE - INTERVAL '7 days' 
            AND interview_date <= CURRENT_DATE + INTERVAL '7 days'
        ),
        'hired_this_month', COUNT(*) FILTER (WHERE 
            status = 'hired' 
            AND applied_date >= DATE_TRUNC('month', CURRENT_DATE)
        ),
        'conversion_rate', ROUND(
            (COUNT(*) FILTER (WHERE status = 'hired')::numeric / 
             NULLIF(COUNT(*), 0) * 100), 1
        ),
        'avg_voice_score', ROUND(AVG(voice_analysis_score) FILTER (WHERE voice_analysis_score IS NOT NULL), 2),
        'applications_by_status', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM applications 
                WHERE form_data IS NOT NULL AND form_data != '{}'::jsonb
                GROUP BY status
            ) status_counts
        )
    )
    INTO result
    FROM applications
    WHERE form_data IS NOT NULL 
      AND form_data != '{}'::jsonb
      AND candidate_id IS NOT NULL;
    
    RETURN result;
END;
$$;

-- Create a more efficient paginated function that uses the indexes
CREATE OR REPLACE FUNCTION public.get_applications_paginated_v2(
    p_offset integer DEFAULT 0, 
    p_limit integer DEFAULT 20, 
    p_status text DEFAULT NULL, 
    p_job_role_id uuid DEFAULT NULL,
    p_search_term text DEFAULT NULL
)
RETURNS TABLE(
    id uuid, 
    candidate_id uuid, 
    job_role_id uuid, 
    status application_status, 
    rating integer, 
    applied_date timestamp with time zone,
    candidate_name text,
    candidate_email text,
    job_role_name text,
    voice_analysis_score integer,
    total_count bigint
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.candidate_id,
        a.job_role_id,
        a.status,
        a.rating,
        a.applied_date,
        c.name as candidate_name,
        c.email as candidate_email,
        jr.name as job_role_name,
        a.voice_analysis_score,
        COUNT(*) OVER() as total_count
    FROM applications a
    LEFT JOIN candidates c ON a.candidate_id = c.id
    LEFT JOIN job_roles jr ON a.job_role_id = jr.id
    WHERE 
        (p_status IS NULL OR a.status::TEXT = p_status)
        AND (p_job_role_id IS NULL OR a.job_role_id = p_job_role_id)
        AND (p_search_term IS NULL OR 
             c.name ILIKE '%' || p_search_term || '%' OR 
             c.email ILIKE '%' || p_search_term || '%')
        AND a.form_data IS NOT NULL 
        AND a.form_data != '{}'::jsonb
        AND a.candidate_id IS NOT NULL
    ORDER BY a.applied_date DESC
    OFFSET p_offset
    LIMIT p_limit;
END;
$$;
