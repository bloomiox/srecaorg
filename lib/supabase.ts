import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykauavefrgiwmiojwepi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYXVhdmVmcmdpd21pb2p3ZXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDIzOTUsImV4cCI6MjA3NDI3ODM5NX0.TjzGc62_qumGkYgE72R3ejQhljzzUeS4tiEtVAKNhgw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)