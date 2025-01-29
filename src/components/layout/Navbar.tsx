import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogIn, LogOut, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAuthPage = location.pathname.startsWith('/auth/');

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
      navigate('/catalog');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-primary">Library</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/catalog" active={isActive("/catalog")}>Catalog</NavLink>
            <NavLink to="/latest" active={isActive("/latest")}>Latest</NavLink>
            <NavLink to="/how-it-works" active={isActive("/how-it-works")}>How It Works</NavLink>
            
            {!isAuthPage && (
              session ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link to="/auth/signin">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link to="/auth/signup">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )
            )}
          </div>

          <button 
            className="sm:hidden p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 animate-fade-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink 
              to="/catalog" 
              active={isActive("/catalog")}
              onClick={() => setIsMenuOpen(false)}
            >
              Catalog
            </MobileNavLink>
            <MobileNavLink 
              to="/latest" 
              active={isActive("/latest")}
              onClick={() => setIsMenuOpen(false)}
            >
              Latest
            </MobileNavLink>
            <MobileNavLink 
              to="/how-it-works" 
              active={isActive("/how-it-works")}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </MobileNavLink>
            
            {!isAuthPage && (
              session ? (
                <MobileNavLink 
                  to="#"
                  active={false}
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </MobileNavLink>
              ) : (
                <>
                  <MobileNavLink 
                    to="/auth/signin"
                    active={isActive("/auth/signin")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </MobileNavLink>
                  <MobileNavLink 
                    to="/auth/signup"
                    active={isActive("/auth/signup")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </MobileNavLink>
                </>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "text-accent"
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ 
  to, 
  children, 
  active, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode; 
  active: boolean;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      active
        ? "bg-accent/10 text-accent"
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
