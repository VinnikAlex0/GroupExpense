import { createClient } from "@supabase/supabase-js";

// Backend Supabase client for authentication verification
const supabaseUrl =
  process.env.SUPABASE_URL || "https://kgozphgdkdtncmgmrvnz.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key-here";

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// For JWT verification, we'll use the anon key client
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3pwaGdka2R0bmNtZ21ydm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODY1NDMsImV4cCI6MjA2ODU2MjU0M30.DYzj-DJc0bBDV832GEWc8Ergk-7wcr6Gr7afuG0jpV4";

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// User type for TypeScript
export type AuthenticatedUser = {
  id: string;
  email: string;
  role?: string;
};
