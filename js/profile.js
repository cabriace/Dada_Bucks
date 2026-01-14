import { supabase } from "./supabase.js";

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function setRole(role) {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase
    .from("profiles")
    .update({ role })
    .eq("id", user.id);
}
