
-- Add indexes for frequently queried fields to improve performance

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_role_id ON applications(job_role_id);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_interview_date ON applications(interview_date);
CREATE INDEX IF NOT EXISTS idx_applications_voice_analysis_score ON applications(voice_analysis_score);
CREATE INDEX IF NOT EXISTS idx_applications_form_data_gin ON applications USING gin(form_data);

-- Candidates table indexes
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(name);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Pre-screening responses indexes
CREATE INDEX IF NOT EXISTS idx_pre_screening_application_id ON pre_screening_responses(application_id);
CREATE INDEX IF NOT EXISTS idx_pre_screening_overall_score ON pre_screening_responses(overall_prescreening_score);

-- Job roles indexes
CREATE INDEX IF NOT EXISTS idx_job_roles_status ON job_roles(status);
CREATE INDEX IF NOT EXISTS idx_job_roles_created_by ON job_roles(created_by);

-- Candidate tags indexes
CREATE INDEX IF NOT EXISTS idx_candidate_tags_candidate_id ON candidate_tags(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_tags_tag ON candidate_tags(tag);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_applications_status_date ON applications(status, applied_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_status ON applications(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_role_status ON applications(job_role_id, status);

-- Function for optimized application retrieval with pagination
CREATE OR REPLACE FUNCTION get_applications_paginated(
    p_offset INTEGER DEFAULT 0,
    p_limit INTEGER DEFAULT 20,
    p_status TEXT DEFAULT NULL,
    p_job_role_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    candidate_id UUID,
    job_role_id UUID,
    status application_status,
    rating INTEGER,
    applied_date TIMESTAMPTZ,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.candidate_id,
        a.job_role_id,
        a.status,
        a.rating,
        a.applied_date,
        COUNT(*) OVER() as total_count
    FROM applications a
    WHERE 
        (p_status IS NULL OR a.status::TEXT = p_status)
        AND (p_job_role_id IS NULL OR a.job_role_id = p_job_role_id)
        AND a.form_data IS NOT NULL 
        AND a.form_data != '{}'::jsonb
        AND a.candidate_id IS NOT NULL
    ORDER BY a.applied_date DESC
    OFFSET p_offset
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function for application statistics with caching
CREATE OR REPLACE FUNCTION get_application_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_applications', COUNT(*),
        'active_applications', COUNT(*) FILTER (WHERE status NOT IN ('hired', 'rejected')),
        'interviews_this_week', COUNT(*) FILTER (WHERE 
            interview_date >= CURRENT_DATE - INTERVAL '7 days' 
            AND interview_date <= CURRENT_DATE
        ),
        'hired_this_month', COUNT(*) FILTER (WHERE 
            status = 'hired' 
            AND applied_date >= DATE_TRUNC('month', CURRENT_DATE)
        ),
        'avg_voice_score', ROUND(AVG(voice_analysis_score), 2),
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
$$ LANGUAGE plpgsql STABLE;

-- Optimize complex joins with materialized view for frequently accessed data
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_application_summary AS
SELECT 
    a.id as application_id,
    a.status,
    a.rating,
    a.applied_date,
    a.interview_date,
    a.voice_analysis_score,
    c.name as candidate_name,
    c.email as candidate_email,
    jr.name as job_role_name,
    psr.overall_prescreening_score,
    CASE 
        WHEN a.has_voice_recording THEN 'Yes'
        ELSE 'No'
    END as has_voice,
    CASE 
        WHEN a.has_video THEN 'Yes'
        ELSE 'No'
    END as has_video
FROM applications a
LEFT JOIN candidates c ON a.candidate_id = c.id
LEFT JOIN job_roles jr ON a.job_role_id = jr.id
LEFT JOIN pre_screening_responses psr ON a.id = psr.application_id
WHERE a.form_data IS NOT NULL 
  AND a.form_data != '{}'::jsonb
  AND a.candidate_id IS NOT NULL;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_application_summary_status ON mv_application_summary(status);
CREATE INDEX IF NOT EXISTS idx_mv_application_summary_date ON mv_application_summary(applied_date DESC);

-- Function to refresh materialized view (call this periodically)
CREATE OR REPLACE FUNCTION refresh_application_summary()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_application_summary;
END;
$$ LANGUAGE plpgsql;
