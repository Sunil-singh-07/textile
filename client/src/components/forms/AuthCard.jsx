import Logo from '../layout/Logo';
import WeavePattern from '../ui/WeavePattern';
import { Eyebrow, Heading, Text } from '../ui/Typography';

// One shared shell for both auth pages so they stay visually identical —
// only the heading, description, and form body differ between them.
const AuthCard = ({ eyebrow, title, description, children, footer }) => (
  <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
    <WeavePattern color="#6B4F3B" cell={18} opacity={0.05} className="absolute inset-0" />

    <div className="relative w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="mb-6" />
        {eyebrow && <Eyebrow className="mb-2 block">{eyebrow}</Eyebrow>}
        <Heading as="h1">{title}</Heading>
        {description && <Text className="mt-2 max-w-sm">{description}</Text>}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        {children}
      </div>

      {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
    </div>
  </div>
);

export default AuthCard;
