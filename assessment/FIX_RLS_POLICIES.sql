-- Drop existing policies to rebuild them
DROP POLICY IF EXISTS "public_insert_assessments" ON discovery_assessments;
DROP POLICY IF EXISTS "service_role_read_assessments" ON discovery_assessments;

-- Allow anyone (including anon) to insert
CREATE POLICY "allow_public_insert" ON discovery_assessments
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (for verification)
CREATE POLICY "allow_public_read" ON discovery_assessments
  FOR SELECT
  USING (true);
