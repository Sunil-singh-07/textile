import { MessageSquare, GitCompareArrows, PackageCheck, Truck } from 'lucide-react';
import SectionContainer from '../common/SectionContainer';
import { Subheading, Text } from '../ui/Typography';
import Reveal from '../ui/Reveal';
import StitchDivider from '../ui/StitchDivider';

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Tell the assistant what you need',
    description: 'Weight, weave, composition, budget, quantity — described however you\u2019d say it out loud.',
  },
  {
    icon: GitCompareArrows,
    title: 'Compare matched suppliers',
    description: 'See matching SKUs side by side, with GSM, composition, MOQ and price laid out plainly.',
  },
  {
    icon: PackageCheck,
    title: 'Place a secure order',
    description: 'Checkout splits automatically by supplier, so a multi-mill order is still one simple flow.',
  },
  {
    icon: Truck,
    title: 'Track it to dispatch',
    description: 'Follow the order through a clear pending → accepted → preparing → dispatched pipeline.',
  },
];

const HowItWorksSection = () => (
  <SectionContainer
    id="how-it-works"
    eyebrow="From spec to shipment"
    title="How it works"
    description="Four steps, in order — because that's genuinely how a sourcing conversation unfolds."
  >
    <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <Reveal key={step.title} delay={i * 0.1} className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-accent-300">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="rounded-lg bg-primary-50 p-2">
              <step.icon className="h-4 w-4 text-primary-700" />
            </div>
          </div>
          <Subheading as="h3" className="mb-2">
            {step.title}
          </Subheading>
          <Text>{step.description}</Text>
        </Reveal>
      ))}
    </div>
    <StitchDivider className="mt-14" />
  </SectionContainer>
);

export default HowItWorksSection;
