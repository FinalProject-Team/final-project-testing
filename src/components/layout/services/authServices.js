import api from "../services/Api";
import { supabase } from "../../../lib/supabaseClient"; 

export async function registerUser(userData) {
  console.log(userData);
  const response = await api.post(
    "/api/auth/register",
    userData
  );
  return response.data;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
}