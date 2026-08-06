import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import WeavePattern from '../ui/WeavePattern';
import Reveal from '../ui/Reveal';

// Deliberately plain tags here rather than the shared Heading/Lede
// components: those hardcode a text-ink utility class for their light-
// background default, and a same-layer utility class passed in via
// className isn't guaranteed to win the cascade over it. On this one
// dark banner it's simpler and safer to just write the classes directly.
const CtaBannerSection = () => (
  <section className="px-4 py-16 sm:px-6 lg:px-8">
    <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary-800 px-6 py-16 text-center sm:px-12">
      <WeavePattern color="#F8F5F1" cell={20} opacity={0.05} className="absolute inset-0" />
      <div className="relative">
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-background sm:text-4xl">
          Ready to source smarter?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-background/70">
          Create a free account and get matched with verified mills for your next order — no
          commitment required to start browsing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register">
            <Button variant="accent" size="lg">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button
              variant="outline"
              size="lg"
              className="!border-background/30 !text-background hover:!bg-background/10"
            >
              Explore the marketplace
            </Button>
          </Link>
        </div>
      </div>
    </Reveal>
  </section>
);

export default CtaBannerSection;
