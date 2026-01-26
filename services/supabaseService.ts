
import { createClient } from '@supabase/supabase-js';

// Credentials provided by the user for worldwide sync.
const supabaseUrl = 'https://pkjjominwolsjgoozeab.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrampvbWlud29sc2pnb296ZWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTU3ODIsImV4cCI6MjA4NDk3MTc4Mn0.4cuW25I2TI-557dAxv8WO8t6MLUAf0wX8cM46acBk08';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isCloudEnabled = !!supabase;

/**
 * NOTICE TO DEVELOPER:
 * If you see "Could not find the table in schema cache", you must create the tables in Supabase.
 * Run the following SQL in your Supabase Dashboard SQL Editor:
 * 
 * CREATE TABLE profiles (id uuid PRIMARY KEY, username text, display_name text, email text, metadata jsonb, updated_at timestamp);
 * CREATE TABLE posts (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, author_username text, content text, likes text[], visibility text, created_at timestamp DEFAULT now());
 * CREATE TABLE messages (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, sender text, recipient text, text text, is_group boolean, created_at timestamp DEFAULT now());
 * ALTER PUBLICATION supabase_realtime ADD TABLE profiles, posts, messages;
 */

const handleTableError = (error: any, context: string) => {
  if (error.message?.includes('schema cache') || error.code === '42P01') {
    // Suppress noisy logs for missing tables, as it's a known setup requirement
    return true;
  }
  console.warn(`METROPOLIS ${context} STATUS:`, error.message);
  return false;
};

/**
 * Synchronizes the user's profile and entire local metadata (pet, history, etc) to Supabase.
 */
export const syncProfile = async (user: any) => {
  if (!supabase) return;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const id = session?.user?.id || user.id;

    if (!id) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: id,
        username: user.username,
        display_name: user.displayName,
        email: user.email,
        metadata: user,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) handleTableError(error, 'SYNC');
  } catch (e) {
    // Silent catch
  }
};

/**
 * Fetches all real citizen profiles registered in the metropolis.
 */
export const fetchProfiles = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      handleTableError(error, 'DIRECTORY');
      return [];
    }
    
    return data?.map(p => ({ 
      ...p.metadata, 
      id: p.id, 
      username: p.username, 
      displayName: p.display_name 
    })) || [];
  } catch (e) {
    return [];
  }
};

/**
 * Fetches the most recent global transmissions.
 */
export const fetchGlobalFeed = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      handleTableError(error, 'FEED');
      return [];
    }
    
    return data?.map(p => ({
      id: p.id,
      author: p.author_username,
      content: p.content,
      likes: p.likes || [],
      comments: [], 
      timestamp: new Date(p.created_at).getTime(),
      visibility: p.visibility
    })) || [];
  } catch (e) {
    return [];
  }
};

export const publishPost = async (post: any) => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('posts').insert(post);
    if (error) handleTableError(error, 'PUBLISH');
    return { data, error };
  } catch (e) {
    return { error: e };
  }
};

export const sendMessageCloud = async (message: any) => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('messages').insert(message);
    if (error) handleTableError(error, 'MESSAGE');
    return { data, error };
  } catch (e) {
    return { error: e };
  }
}
