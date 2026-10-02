import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RazaConversation, RazaMessage } from '../types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const STORAGE_KEY = 'samyoj_raza_conversations_v2';

// Local storage fallback handlers
export function getLocalConversations(): RazaConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse local conversations:', err);
    return [];
  }
}

export function saveLocalConversations(convos: RazaConversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
  } catch (err) {
    console.warn('Failed to save local conversations:', err);
  }
}

// Unified conversation loader
export async function loadUserConversations(): Promise<RazaConversation[]> {
  if (supabase) {
    try {
      const { data: convData, error: convError } = await supabase
        .from('raza_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!convError && convData && convData.length > 0) {
        // Fetch messages for each conversation
        const fullConvos: RazaConversation[] = [];
        for (const c of convData) {
          const { data: msgData } = await supabase
            .from('raza_messages')
            .select('*')
            .eq('conversation_id', c.id)
            .order('created_at', { ascending: true });

          fullConvos.push({
            id: c.id,
            title: c.title || 'Civic Consultation',
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            messages: (msgData || []).map((m) => ({
              id: m.id,
              sender: m.sender,
              text: m.text,
              structuredPlan: m.structured_plan,
              imageUrl: m.image_url,
              timestamp: m.created_at,
            })),
          });
        }
        return fullConvos;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  return getLocalConversations();
}

// Unified conversation saver
export async function persistConversation(convo: RazaConversation): Promise<void> {
  // Always update local storage first for instant responsiveness
  const localList = getLocalConversations();
  const existingIdx = localList.findIndex((c) => c.id === convo.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = convo;
  } else {
    localList.unshift(convo);
  }
  saveLocalConversations(localList);

  // If Supabase is configured, sync to database
  if (supabase) {
    try {
      await supabase.from('raza_conversations').upsert({
        id: convo.id,
        title: convo.title,
        updated_at: new Date().toISOString(),
      });

      // Upsert latest message
      const lastMsg = convo.messages[convo.messages.length - 1];
      if (lastMsg) {
        await supabase.from('raza_messages').upsert({
          id: lastMsg.id,
          conversation_id: convo.id,
          sender: lastMsg.sender,
          text: lastMsg.text,
          structured_plan: lastMsg.structuredPlan || null,
          image_url: lastMsg.imageUrl || null,
          created_at: lastMsg.timestamp,
        });
      }
    } catch (err) {
      console.warn('Failed to sync to Supabase (graceful fallback):', err);
    }
  }
}

// Delete conversation
export async function removeConversation(conversationId: string): Promise<void> {
  const localList = getLocalConversations().filter((c) => c.id !== conversationId);
  saveLocalConversations(localList);

  if (supabase) {
    try {
      await supabase.from('raza_conversations').delete().eq('id', conversationId);
    } catch (err) {
      console.warn('Failed to delete from Supabase:', err);
    }
  }
}
