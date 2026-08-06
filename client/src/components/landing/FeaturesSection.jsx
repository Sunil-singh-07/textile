import { Sparkles, ShieldCheck, Lock, Wand2 } from 'lucide-react';
import SectionContainer from '../common/SectionContainer';
import Card from '../ui/Card';
import { Subheading, Text } from '../ui/Typography';
import Reveal from '../ui/Reveal';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Product Discovery',
    description:
      'Describe a fabric in plain language — weight, weave, composition — and let the assistant surface matching SKUs across every supplier catalogue.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Suppliers',
    description:
      'Every mill on the platform is reviewed before their catalogue goes live, so you\u2019re never sourcing from an unknown quantity.',
  },
  {
    icon: Lock,
    title: 'Secure Ordering',
    description:
      'Orders are tracked through a clear, auditable status pipeline from placement to dispatch — no back-and-forth over email.',
  },
  {
    icon: Wand2,
    title: 'Smart Recommendations',
    description:
      'The more you source, the better your matches get — recommendations tuned to your past categories, budgets, and order volumes.',
  },
];

const FeaturesSection = () => (
  <SectionContainer
    id="features"
    eyebrow="Why teams switch"
    title="Sourcing built for how buyers actually work"
    description="Less time chasing suppliers, more time comparing the fabrics that actually fit your spec."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature, i) => (
        <Reveal key={feature.title} delay={i * 0.08}>
          <Card variant="elevated" className="h-full">
            <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3">
              <feature.icon className="h-5 w-5 text-primary-700" />
            </div>
            <Subheading as="h3" className="mb-2">
              {feature.title}
            </Subheading>
            <Text>{feature.description}</Text>
          </Card>
        </Reveal>
      ))}
    </div>
  </SectionContainer>
);

export default FeaturesSection;
