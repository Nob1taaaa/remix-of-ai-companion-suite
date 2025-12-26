-- Add DELETE policies for history tables to support GDPR compliance

-- Allow users to delete their own resume scans
CREATE POLICY "Users can delete own resume scans"
ON public.resume_scan_history
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own classifications
CREATE POLICY "Users can delete own classifications"
ON public.text_classification_history
FOR DELETE
USING (auth.uid() = user_id);