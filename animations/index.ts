export const transitionFast = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1] as const
};

export const transitionBase = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1] as const
};

export const transitionSlow = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const
};

export const transitionEaseInOut = {
  duration: 0.2,
  ease: [0.65, 0, 0.35, 1] as const
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};
