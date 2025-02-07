
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthButtonsProps {
  session: boolean;
}

export const AuthButtons = ({ session }: AuthButtonsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthPage = location.pathname.startsWith('/auth/');

  if (isAuthPage) return null;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If there's an error but it's a session not found error, 
        // we still want to clear the UI state and redirect
        if (error.message.includes('session_not_found')) {
          navigate('/auth/signin');
          toast({
            description: t("auth.sessionExpired"),
          });
          return;
        }
        // For other errors, show the error message
        throw error;
      }
      
      // Successful logout
      navigate('/');
      toast({
        description: t("auth.signOutSuccess"),
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      // For any other errors, show error message and redirect to sign in
      toast({
        description: error.message,
        variant: "destructive",
      });
      navigate('/auth/signin');
    }
  };

  return session ? (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary"
    >
      <LogOut className="h-4 w-4" />
      <span>{t("auth.signOut")}</span>
    </button>
  ) : (
    <div className="flex items-center space-x-4">
      <Link 
        to="/auth/signin" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary"
      >
        <LogIn className="h-4 w-4" />
        <span>{t("auth.signIn")}</span>
      </Link>
      <Link 
        to="/auth/signup" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary"
      >
        <UserPlus className="h-4 w-4" />
        <span>{t("auth.signUp")}</span>
      </Link>
    </div>
  );
};
