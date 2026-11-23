import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext();

// Cambiá este correo por el usuario Admin que vayas a informar en la entrega
const ADMIN_EMAIL = "admin@tienda.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password, nombre = "") => {
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (nombre.trim()) {
        await updateProfile(cred.user, { displayName: nombre.trim() });
        setUser({ ...cred.user, displayName: nombre.trim() });
      }
      return { ok: true };
    } catch (error) {
      setAuthError(error.message);
      return { ok: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (error) {
      setAuthError(error.message);
      return { ok: false, error: error.message };
    }
  };

  const logout = async () => {
    setAuthError("");
    await signOut(auth);
  };

  const isAdmin = Boolean(
    user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loadingAuth,
        authError,
        setAuthError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}