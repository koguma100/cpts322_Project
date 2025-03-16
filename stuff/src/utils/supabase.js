// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient("https://mickvlmfxtescdcsltme.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY2t2bG1meHRlc2NkY3NsdG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNjY4NzMsImV4cCI6MjA1NjY0Mjg3M30.PP0n8fM9cpQdXr1avFUM1FpMmoynLJ0KUyUv_cS7M-0");