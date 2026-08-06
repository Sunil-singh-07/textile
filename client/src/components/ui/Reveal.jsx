import { motion, useReducedMotion } from 'framer-motion';

// One consistent scroll-reveal treatment reused across every landing
// section, instead of each section inventing its own animation — keeps
// motion feeling orchestrated rather than scattered.
const Reveal = ({ children, delay = 0, className = '', as = 'div' }) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
