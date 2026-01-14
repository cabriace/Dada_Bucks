import { supabase } from "./supabase.js";
import { render } from "./ui.js";
import { checkDailyReset } from "./dailyReset.js";

window.login = async () => {
  const email = email.value;
  const password = password.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
};

window.signup = async () => {
  const email = email.value;
  const password = password.value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
};

window.logout = async () => {
  await supabase.auth.signOut();
};

supabase.auth.onAuthStateChange(async (_, session) => {
  if (session) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";

    await checkDailyReset();
    render();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});
