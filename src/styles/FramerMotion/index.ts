import { AnimationProps } from 'framer-motion'

export const TransitionDuration = 0.75

/**
 * Slide Motion
 */
const DefaultSlideMotion = {
  animate: {
    x: 0,
    opacity: 1
  },
  transition: {
    type: 'spring',
    bounce: 0,
    duration: TransitionDuration
  }
} as AnimationProps

const SlideFromLeft = {
  initial: {
    x: '-90%',
    opacity: 0.5
  }
} as AnimationProps

const SlideFromRight = {
  initial: {
    x: '90%',
    opacity: 0.5
  }
} as AnimationProps

const SlideToLeft = {
  exit: {
    x: '-100%',
    opacity: 0
  }
} as AnimationProps

const SlideToRight = {
  exit: {
    x: '100%',
    opacity: 0
  }
} as AnimationProps

/**
 * PopUpMotion
 */
const PopUpMotion = {
  initial: {
    opacity: 0.5,
    y: '100%',
    scale: 0.5
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: '100%',
    scale: 0.5
  },
  transition: {
    type: 'spring',
    bounce: 0.25,
    mass: 0.275,
    duration: TransitionDuration
  }
} as AnimationProps

export const MotionConfig = {
  DefaultSlideMotion,
  SlideFromLeft,
  SlideFromRight,
  SlideToLeft,
  SlideToRight,
  PopUpMotion
}
