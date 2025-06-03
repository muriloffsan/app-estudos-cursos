import { supabase } from './supabase';

const initialProgress = {
  curso1: { licao1: false, licao2: false, licao3: false, licao4: false },
  curso2: { licao5: false, licao6: false, licao7: false, licao8: false },
  curso3: { licao9: false, licao10: false, licao11: false, licao12: false }
};

export const signUpAndCreateProfile = async ({ email, password, name }) => {
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) throw signUpError;

  const user = data.user;
  if (!user) throw new Error('Usuário não retornado');

  const { error: insertError } = await supabase.from('users').insert([
    {
      uid: user.id,
      email: user.email,
      name,
      progresso: initialProgress
    }
  ]);
  if (insertError) throw insertError;

  return user;
};

export const loginWithEmail = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
