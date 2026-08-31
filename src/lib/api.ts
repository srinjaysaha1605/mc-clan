import { supabase } from "./supabase";
import { Player } from "../types";
import { User } from "@supabase/supabase-js";

export const api = {
  // Auth
  login: async (email?: string, password?: string): Promise<User | null> => {
    if (!supabase) return null;
    try {
      if (email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },
  logout: async (): Promise<void> => {
    if (supabase) await supabase.auth.signOut();
  },
  onAuthChange: (callback: (user: User | null) => void) => {
    if (!supabase) {
      callback(null);
      return () => {};
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  },

  // Players
  getPlayers: async (): Promise<Player[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Player[];
    } catch (error) {
      console.error("Supabase Error (getPlayers):", error);
      return [];
    }
  },
  subscribeToPlayers: (callback: (players: Player[]) => void) => {
    if (!supabase) {
      callback([]);
      return () => {};
    }
    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        async () => {
          const players = await api.getPlayers();
          callback(players);
        }
      )
      .subscribe();

    // Initial fetch
    api.getPlayers().then(callback);

    return () => {
      supabase.removeChannel(channel);
    };
  },
  createPlayer: async (player: Omit<Player, "id">): Promise<string> => {
    if (!supabase) return "";
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('players')
        .insert([{
          ...player,
          author_uid: user?.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Supabase Error (createPlayer):", error);
      return "";
    }
  },
  updatePlayer: async (id: string, player: Partial<Player>): Promise<void> => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('players')
        .update({
          ...player,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Supabase Error (updatePlayer):", error);
    }
  },
  deletePlayer: async (id: string): Promise<void> => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Supabase Error (deletePlayer):", error);
    }
  },

  // User Profile
  getUserProfile: async (uid: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
      return data;
    } catch (error) {
      console.error("Supabase Error (getUserProfile):", error);
      return null;
    }
  },
  createUserProfile: async (uid: string, email: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: uid,
          email,
          role: 'user', // Default role
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Supabase Error (createUserProfile):", error);
    }
  },

  // Storage
  uploadImage: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName; // Upload directly to the bucket root

      const { error: uploadError } = await supabase.storage
        .from('players')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('players')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Supabase Storage Error:", error);
      return null;
    }
  }
};
