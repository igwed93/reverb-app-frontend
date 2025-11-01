'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingSlides, SlideContent } from '@/app/lib/onboardingSlides';
import Link from 'next/link';

/**
 * OnboardingCarousel Component
 * -------------------------------------------------------------
 * Displays a set of slides with background images, text, and icons.
 * Slides automatically transition every 8 seconds but also respond
 * to user navigation (Next button or dots). The slide direction
 * animates left or right depending on user input.
 */
const OnboardingCarousel: React.FC = () => {
  // Current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation direction: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);

  // Interval for automatic slide transitions
  const SLIDE_INTERVAL = 8000; // 8 seconds

  const slides = onboardingSlides;
  const totalSlides = slides.length;

  /**
   * Move to the next slide (manual or auto)
   */
  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  /**
   * Move to the previous slide (if user clicks a dot behind)
   */
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  /**
   * Jump directly to a slide when a dot is clicked
   */
  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  /**
   * Automatically advance slides every 8 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  // Current slide content
  const currentContent: SlideContent = slides[currentSlide];
  const IconComponent = currentContent.icon;

  return (
    <div className="relative w-full flex justify-center items-center  max-w-xl h-[500px] overflow-hidden rounded-xl shadow-2xl bg-[#FFFFFF]/10 dark:bg-[#1C1C1C]/20 backdrop-blur-md">
      {/* AnimatePresence ensures smooth enter/exit transitions */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 flex flex-col justify-between text-center text-[#1C1C1C] dark:text-[#F9F9F9]"
        >
          {/* Background Image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentContent.image})`,
            }}
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(0,0,0,0.6)]" />

          {/* Slide Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-10">
            <IconComponent
              className={`${currentContent.colorClass} transition-colors duration-500 mb-6`}
              size={72}
            />
            <h1 className="text-3xl text-deep-slate font-extrabold mb-3">{currentContent.title}</h1>
            <p className="text-lg text-[#F9F9F9] dark:text-[#EAEAEA]/90 max-w-md mx-auto">
              {currentContent.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`block w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide ? 'bg-[#00A389] w-6' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Buttons (optional if you want manual next/back) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
        <button
          aria-label="Previous Slide"
          onClick={goToPrevious}
          className="text-white/80 hover:text-white text-3xl"
        >
          ‹
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
        <button
          aria-label="Next Slide"
          onClick={goToNext}
          className="text-white/80 hover:text-white text-3xl"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
