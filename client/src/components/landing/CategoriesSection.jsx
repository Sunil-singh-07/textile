import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionContainer from '../common/SectionContainer';
import WeavePattern from '../ui/WeavePattern';
import Reveal from '../ui/Reveal';
import { POPULAR_CATEGORIES } from '../../utils/mockLandingData';

const CategoriesSection = () => (
  <SectionContainer
    id="categories"
    eyebrow="Browse by material"
    title="Popular categories"
    description="Every category is backed by mills who specialise in it — not a generic catch-all listing."
  >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {POPULAR_CATEGORIES.map((category, i) => (
        <Reveal key={category.name} delay={i * 0.06}>
          <Link
            to={`/marketplace?category=${encodeURIComponent(category.name)}`}
            className="group relative block h-36 overflow-hidden rounded-2xl border border-border shadow-card transition-shadow hover:shadow-elevated"
            style={{ backgroundColor: category.tint }}
          >
            <WeavePattern color="#F8F5F1" cell={16} opacity={0.12} className="absolute inset-0" />
            <div className="relative flex h-full flex-col justify-between p-5">
              <ArrowUpRight className="h-5 w-5 self-end text-background/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <div>
                <h3 className="font-display text-xl font-medium text-background">
                  {category.name}
                </h3>
                <p className="font-mono text-xs text-background/70">{category.count}</p>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </SectionContainer>
);

export default CategoriesSection;
