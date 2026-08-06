import { Quote } from 'lucide-react';
import SectionContainer from '../common/SectionContainer';
import Card from '../ui/Card';
import Reveal from '../ui/Reveal';
import { TESTIMONIALS } from '../../utils/mockLandingData';

const TestimonialsSection = () => (
  <SectionContainer
    eyebrow="From the floor"
    title="Trusted by buyers and mills alike"
    description="Illustrative feedback from the kind of teams this marketplace is built for."
  >
    <div className="grid gap-5 lg:grid-cols-3">
      {TESTIMONIALS.map((testimonial, i) => (
        <Reveal key={testimonial.name} delay={i * 0.1}>
          <Card variant="elevated" className="flex h-full flex-col">
            <Quote className="mb-4 h-6 w-6 text-accent-300" />
            <p className="mb-6 flex-1 font-display text-lg leading-snug text-ink">
              “{testimonial.quote}”
            </p>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-ink">{testimonial.name}</p>
              <p className="text-xs text-muted">{testimonial.role}</p>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  </SectionContainer>
);

export default TestimonialsSection;
