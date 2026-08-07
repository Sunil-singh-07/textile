import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionContainer from '../common/SectionContainer';
import ProductCard from '../ui/ProductCard';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { FEATURED_PRODUCTS } from '../../utils/mockLandingData';

const FeaturedProductsSection = () => (
  <SectionContainer
    eyebrow="Fresh off the loom"
    title="Featured fabrics this week"
    description="Explore premium fabrics sourced from verified textile suppliers across India."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURED_PRODUCTS.map((product, i) => (
        <Reveal key={product._id} delay={(i % 3) * 0.08}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>

    <div className="mt-10 flex justify-center">
      <Link to="/marketplace">
        <Button variant="outline" size="lg">
          Browse the full marketplace
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  </SectionContainer>
);

export default FeaturedProductsSection;
