import { authSubscribe, signIn, signOut } from "@junobuild/core";

export const initAuth = async () => {
  // Auth is initialized by the JunoProvider
  // This function is kept for compatibility
};

export const login = async () => {
  try {
    await signIn();
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const subscribeToAuth = (callback: (user: any) => void) => {
  return authSubscribe(callback);
};
