import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://chxoxplmhyjoyzrbacik.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoeG94cGxtaHlqb3l6cmJhY2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDg2ODgsImV4cCI6MjA5MDM4NDY4OH0._UYxvr3S7h94vh3OrBeOfoAVV3KJksxpBTwdQITfJEc';

// Only initialize if we have the required keys to avoid top-level crashes
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
