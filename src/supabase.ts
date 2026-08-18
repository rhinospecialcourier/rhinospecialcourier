import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://huscyiqarpiswnmfyoda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c2N5aXFhcnBpc3dubWZ5b2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyOTE0NjYsImV4cCI6MjEwMTg2NzQ2Nn0.utPBFKy6K6qVins8zDsr4tyq-DbPpmomoNqufoay4NA'

export const supabase = createClient(supabaseUrl, supabaseKey)