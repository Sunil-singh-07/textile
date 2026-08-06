import { Eyebrow, Heading, Lede } from '../ui/Typography';

// Every landing-page section (Features, Categories, Featured Products, How
// It Works, Testimonials) shares this shell so vertical rhythm and heading
// treatment stay consistent without each section reinventing it.
const SectionContainer = ({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  children,
  className = '',
  contentClassName = '',
}) => (
  <section id={id} className={`px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}>
    <div className="mx-auto max-w-6xl">
      {(eyebrow || title || description) && (
        <div className={`mb-12 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
          {eyebrow && <Eyebrow className="mb-3 block">{eyebrow}</Eyebrow>}
          {title && <Heading>{title}</Heading>}
          {description && <Lede className="mt-4">{description}</Lede>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  </section>
);

export default SectionContainer;
