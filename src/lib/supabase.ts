import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Raffle {
  id: string;
  name: string;
  total_winners: number;
  current_winner: number;
  status: 'setup' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface RaffleParticipant {
  id: string;
  raffle_id: string;
  participant_name: string;
  ticket_number: number;
  is_winner: boolean;
  winner_position: number | null;
  created_at: string;
}
