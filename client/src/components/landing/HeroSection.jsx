import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import WeaveHeroGraphic from '../ui/WeaveHeroGraphic';
import WeavePattern from '../ui/WeavePattern';
import { Display, Lede } from '../ui/Typography';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleSearch = (value) => {
    const params = value ? `?search=${encodeURIComponent(value)}` : '';
    navigate(`/marketplace${params}`);
  };

  return (
    <section className="relative overflow-hidden">
      <WeavePattern
        color="#6B4F3B"
        cell={22}
        opacity={0.05}
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-300 bg-accent-100 px-3.5 py-1.5 text-xs font-medium text-accent-600"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-guided sourcing, built for textile buyers
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Display>
              Source the right fabric,
              <br />
              <span className="text-primary-700">without the guesswork.</span>
            </Display>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Lede className="mt-5 max-w-lg">
              Describe what you need in plain language and let our sourcing AI match you with
              verified mills — by GSM, composition, MOQ, and price — then order and track it all
              in one place.
            </Lede>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              className="max-w-md"
            />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center gap-3"
          >
            <Link to="/register">
              <Button variant="primary" size="lg">
                Start sourcing free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg">
                Browse the marketplace
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-sm text-muted"
          >
            500+ verified mills · 9,000+ fabric SKUs · Sourcing in 15+ categories
          </motion.p>
        </div>

        <div className="relative">
          <WeaveHeroGraphic />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
