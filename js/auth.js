import { supabase } from "./supabase.js";

/* ---------- LOGIN ---------- */
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
}

/* ---------- LOGOUT ---------- */
export async function logout() {
  await supabase.auth.signOut();
}

/* ---------- SIGNUP ---------- */
export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) throw error;
  return data.user;
}
