
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Provide session refresh
  useEffect(() => {
    const refreshSession = async () => {
      if (session) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          // If there's an error with refresh token, sign out the user
          if (error) {
            if (error.message.includes('refresh_token_not_found')) {
              await supabase.auth.signOut();
              setSession(null);
            }
            return;
          }
          
          if (data.session) {
            setSession(data.session);
          }
        } catch (error) {
          // If there's any other error, sign out the user
          await supabase.auth.signOut();
          setSession(null);
        }
      }
    };

    // Refresh session every 4 minutes
    const interval = setInterval(refreshSession, 1000 * 60 * 4);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
