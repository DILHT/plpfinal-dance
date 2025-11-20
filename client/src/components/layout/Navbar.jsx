import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Dance For Change
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/about" className="hover:text-primary transition">About</Link>
            <Link to="/room" className="hover:text-primary transition">MindTalk</Link>
            <Link to="/dancers" className="hover:text-primary transition">Dancers</Link>
            <Link to="/videos" className="hover:text-primary transition">Videos</Link>
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-primary transition">Admin</Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-primary transition">Profile</Link>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Link to="/join">
                  <Button variant="outline">Join D4C</Button>
                </Link>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link to="/" className="block py-2">Home</Link>
            <Link to="/about" className="block py-2">About</Link>
            <Link to="/room" className="block py-2">MindTalk</Link>
            <Link to="/dancers" className="block py-2">Dancers</Link>
            <Link to="/videos" className="block py-2">Videos</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2">Profile</Link>
                {user?.role === 'admin' && <Link to="/admin" className="block py-2">Admin</Link>}
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/join">
                  <Button variant="outline" className="w-full">Join D4C</Button>
                </Link>
                <Link to="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

