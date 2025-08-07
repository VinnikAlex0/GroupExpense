import { createClient } from '@supabase/supabase-js';

// Backend Supabase client for authentication verification
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// For JWT verification, we'll use the anon key client
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// User type for TypeScript
export type AuthenticatedUser = {
  id: string;
  email: string;
  role?: string;
};
