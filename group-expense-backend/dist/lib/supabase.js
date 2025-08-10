"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAuth = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Backend Supabase client for authentication verification
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase environment variables');
}
// Create Supabase client with service role key for backend operations
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
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
exports.supabaseAuth = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
