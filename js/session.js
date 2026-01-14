import { supabase } from "./supabase.js";

export async function redirectByRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "parent") {
    window.location.href = "/parent-home.html";
  } else if (profile?.role === "child") {
    window.location.href = "/child-home.html";
  }
}
