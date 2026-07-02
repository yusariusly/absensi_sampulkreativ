-- Migration: Add progress_percent to pkl_program_weeks
-- Purpose: Store progress percentage (0-100) for weekly milestones
ALTER TABLE pkl_program_weeks ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0;
