import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Logo from './Logo';
import Button from '../ui/Button';
import Input from '../ui/Input';
import WeavePattern from '../ui/WeavePattern';

const LINK_GROUPS = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Browse fabrics', to: '/marketplace' },
      { label: 'Popular categories', to: '/#categories' },
      { label: 'Become a supplier', to: '/register' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Trust & verification', to: '/#features' },
      { label: 'Contact us', to: '/#' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'My orders', to: '/orders' },
    ],
  },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-border bg-primary-900 text-background">
    <WeavePattern color="#F8F5F1" cell={16} opacity={0.04} className="absolute inset-0" />

    <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
            An AI-guided sourcing marketplace connecting buyers with verified textile mills —
            from first swatch to signed order.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex max-w-sm items-center gap-2"
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="you@company.com"
                aria-label="Email address"
                className="!border-background/20 !bg-primary-800 !text-background placeholder:!text-background/40"
              />
            </div>
            <Button type="submit" variant="accent" size="md" className="shrink-0">
              <Mail className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-xs text-background/50">
            Sourcing tips, new mills, and category drops — no spam.
          </p>
        </div>

        {LINK_GROUPS.map((group) => (
          <div key={group.heading}>
            <h4 className="mb-3 font-display text-sm font-medium text-background/90">
              {group.heading}
            </h4>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/65 transition-colors hover:text-accent-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-6 text-xs text-background/50 sm:flex-row">
        <p>© {new Date().getFullYear()} Textile Marketplace. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/#" className="hover:text-background/80">Privacy</Link>
          <Link to="/#" className="hover:text-background/80">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
