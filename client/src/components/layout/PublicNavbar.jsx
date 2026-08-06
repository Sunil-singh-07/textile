import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_HOME_ROUTE } from '../../utils/constants';
import Button from '../ui/Button';
import Logo from './Logo';

const NAV_LINKS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#categories', label: 'Categories' },
];

const PublicNavbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" className="rounded-full p-2 text-ink/70 hover:bg-primary-50 hover:text-primary" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={ROLE_HOME_ROUTE[role] || '/'}
                className="rounded-full p-2 text-ink/70 hover:bg-primary-50 hover:text-primary"
                aria-label="Dashboard"
              >
                <User className="h-5 w-5" />
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/70 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-primary-50"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-primary-50"
              >
                Cart
              </Link>
              <div className="mt-2 flex gap-2 px-3">
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" onClick={logout} className="w-full">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button variant="primary" size="sm" className="w-full">
                        Get started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicNavbar;
