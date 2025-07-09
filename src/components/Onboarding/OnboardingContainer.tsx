import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingScreen } from './OnboardingScreen';
import { PageIndicator } from './PageIndicator';
import { ChevronRightIcon } from 'lucide-react';
interface OnboardingContainerProps {
  onComplete: () => void;
}
export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onComplete
}) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(0);
  const screens = [{
    title: 'Welcome to BudgetFriendly',
    subtitle: 'Where your money finds peace',
    illustration: 'https://images.unsplash.com/photo-1579621970590-9d624316904b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    illustrationAlt: 'Calm wallet illustration'
  }, {
    title: 'Smart Budgeting',
    subtitle: 'Set smart budgets. Track without stress. See where your money goes.',
    illustration: 'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    illustrationAlt: 'Coins organizing themselves'
  }, {
    title: 'Set Your Goals',
    subtitle: "Let's set up your first goal together.",
    illustration: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    illustrationAlt: 'Piggy bank with plants growing'
  }];
  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setDirection(1);
      setCurrentScreen(currentScreen + 1);
    }
  };
  const prevScreen = () => {
    if (currentScreen > 0) {
      setDirection(-1);
      setCurrentScreen(currentScreen - 1);
    }
  };
  // Handle swipe gestures
  const handleDragEnd = (e, {
    offset,
    velocity
  }) => {
    const swipe = offset.x < -50 || offset.x < 0 && velocity.x < -0.3;
    if (swipe) {
      nextScreen();
    } else if (offset.x > 50 || offset.x > 0 && velocity.x > 0.3) {
      prevScreen();
    }
  };
  const variants = {
    enter: direction => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: direction => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };
  return <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-xl h-[600px]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div key={currentScreen} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }} drag="x" dragConstraints={{
          left: 0,
          right: 0
        }} dragElastic={0.1} onDragEnd={handleDragEnd} className="absolute w-full h-full">
            <OnboardingScreen title={screens[currentScreen].title} subtitle={screens[currentScreen].subtitle} illustration={screens[currentScreen].illustration} illustrationAlt={screens[currentScreen].illustrationAlt} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-6">
          <PageIndicator total={screens.length} current={currentScreen} />
          <div className="flex w-full px-8 space-x-4">
            {currentScreen === screens.length - 1 ? <>
                <button className="flex-1 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" onClick={onComplete}>
                  Skip for now
                </button>
                <button className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center" onClick={onComplete}>
                  Let's Begin
                </button>
              </> : <>
                <button className="flex-1 px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" onClick={onComplete}>
                  Skip
                </button>
                <button className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center" onClick={nextScreen}>
                  Continue
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
              </>}
          </div>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-500">Swipe left to continue</div>
    </div>;
};