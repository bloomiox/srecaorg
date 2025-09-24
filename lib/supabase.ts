import { createClient } from '@supabase/supabase-js'

// Temporarily using hardcoded values for testing - will switch back to env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ykauavefrgiwmiojwepi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYXVhdmVmcmdpd21pb2p3ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDIzOTUsImV4cCI6MjA3NDI3ODM5NX0.TjzGc62_qumGkYgE72R3ejQhljzzUeS4tiEtVAKNhgw'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

console.log('Supabase URL:', supabaseUrl); // Debug log
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...'); // Debug log

export const supabase = createClient(supabaseUrl, supabaseAnonKey)