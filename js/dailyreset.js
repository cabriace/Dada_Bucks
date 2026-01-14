import { supabase } from "./supabase.js";

export async function checkDailyReset() {
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem("lastReset");

  if (last === today) return;

  const { data: { user } } = await supabase.auth.getUser();

  await supabase
    .from("profiles")
    .update({ strikes: 0 })
    .eq("id", user.id);

  localStorage.setItem("lastReset", today);
}
