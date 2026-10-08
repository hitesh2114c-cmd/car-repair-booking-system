import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqgdkljrufxdwdbsvsev.supabase.co';
const supabaseAnonKey = 'sb_publishable_mwDNafcH8ObySdtDhUZakw_oajY-Iyc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
