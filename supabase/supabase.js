import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ggrulcmqustwegovbrfy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncnVsY21xdXN0d2Vnb3ZicmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjAyMDcsImV4cCI6MjA2MzMzNjIwN30.tclBHF-KFb81jjTKI_NSpQgcnsL0YvhhWpeVCb2O42o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
