import { supabase } from "./supabase.js";

/* ------------------
   SCREEN NAVIGATION
------------------ */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

window.goToRole = () => show("screen-role");
window.goToParent = () => show("screen-parent");
window.goToChild = () => show("screen-child");

/* ------------------
   AUTH
------------------ */
window.login = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  show("screen-app");
};

window.logout = async () => {
  await supabase.auth.signOut();
  show("screen-login");
};

/* ------------------
   SIGNUP HELPERS
------------------ */
function randomFamilyKey() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* ------------------
   PARENT SIGNUP
------------------ */
window.signupParent = async () => {
  const first = p-first.value;
  const last = p-last.value;
  const email = p-email.value;
  const pass = p-pass.value;
  const confirm = p-confirm.value;

  if (pass !== confirm) return alert("Passwords do not match");

  const familyKey = randomFamilyKey();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass
  });

  if (error) return alert(error.message);

  await supabase.from("profiles").update({
    role: "parent",
    first_name: first,
    last_name: last,
    family_key: familyKey
  }).eq("id", data.user.id);

  alert("Family Key: " + familyKey);
  show("screen-app");
};

/* ------------------
   CHILD SIGNUP
------------------ */
window.signupChild = async () => {
  const first = c-first.value;
  const last = c-last.value;
  const email = c-email.value;
  const pass = c-pass.value;
  const confirm = c-confirm.value;
  const familyKey = c-family.value;

  if (pass !== confirm) return alert("Passwords do not match");

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass
  });

  if (error) return alert(error.message);

  const { data: parent } = await supabase
    .from("profiles")
    .select("family_key")
    .eq("family_key", familyKey)
    .single();

  if (!parent) return alert("Invalid family key");

  await supabase.from("profiles").update({
    role: "child",
    first_name: first,
    last_name: last,
    family_key: familyKey
  }).eq("id", data.user.id);

  show("screen-app");
};

/* ------------------
   SESSION CHECK
------------------ */
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) show("screen-app");
  else show("screen-login");
});
