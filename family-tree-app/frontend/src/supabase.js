import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://jlbbjwwtysflxjijnhxa.supabase.co";

const supabaseAnonKey =
  "sb_publishable_ESbdtJ8i0z2GcA-YpRJw-Q_21ajk5LD";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);