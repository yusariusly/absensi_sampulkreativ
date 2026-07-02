-- Migration: Add extended_days to pkl_weekly_summaries
-- Purpose: Store the number of extended working days for student weekly targets
ALTER TABLE pkl_weekly_summaries ADD COLUMN IF NOT EXISTS extended_days INT NOT NULL DEFAULT 0;
