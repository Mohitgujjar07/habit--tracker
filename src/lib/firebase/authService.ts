import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  User,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

export class AuthService {
  /**
   * Initiates Google Sign-In with popup or redirect fallback
   */
  static async signInWithGoogle(): Promise<User | null> {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      return null;
    }

    try {
      // Primary: Modern popup login
      const credential = await signInWithPopup(auth, googleProvider);
      return credential.user;
    } catch (error: any) {
      console.warn("Google Sign-In Popup failed, attempting redirect fallback:", error);
      // Fallback for strict mobile webviews or popup blockers
      if (
        error.code === "auth/popup-blocked" ||
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect sign-in error:", redirectError);
        }
      }
      throw error;
    }
  }

  /**
   * Checks redirect result after page reload (for redirect sign-in flow)
   */
  static async checkRedirectResult(): Promise<User | null> {
    if (!auth) return null;
    try {
      const result = await getRedirectResult(auth);
      return result ? result.user : null;
    } catch (error) {
      console.error("Error checking redirect result:", error);
      return null;
    }
  }

  /**
   * Signs out the current user
   */
  static async signOut(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  }

  /**
   * Subscribe to auth changes
   */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Current user helper
   */
  static getCurrentUser(): User | null {
    return auth ? auth.currentUser : null;
  }
}
