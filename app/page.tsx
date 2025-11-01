'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OnboardingCarousel from '@/components/OnboardingCarousel';

/**
 * Reverb Landing Page
 * --------------------------------------------------------------
 * Clean white layout with teal and blue accent bubbles.
 * Includes navbar, onboarding carousel, and clear CTAs.
 */
export default function HomePage() {
  return (
    <main
      className="
        relative min-h-screen w-full overflow-hidden
        bg-echo-white text-deep-slate
        dark:bg-[#0B0B0B] dark:text-echo-white
      "
    >
      {/* ---------------------- Animated Background Bubbles ---------------------- */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large soft teal bubble (bottom-left) */}
        <motion.div
          className="absolute bottom-[-6rem] left-[-6rem] w-72 h-72 bg-reverb-teal/30 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Medium blue bubble (top-right) */}
        <motion.div
          className="absolute top-[-5rem] right-[-5rem] w-64 h-64 bg-acoustic-blue/25 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Small accent bubble (center drifting) */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-reverb-teal/20 rounded-full blur-2xl"
          animate={{ y: [0, -50, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---------------------- Navigation Bar ---------------------- */}
      <nav
        className="
          fixed top-0 left-0 right-0 z-30
          flex items-center justify-between
          px-8 py-4
          bg-off-white-surface/60 dark:bg-[#1A1A1A]/40
          backdrop-blur-lg border-b border-white/10
        "
      >
        {/* Logo and Name */}
        <div className="flex items-center space-x-2">
          <Image
            src="/reverb-logo-small.png"
            alt="Reverb Logo"
            width={36}
            height={36}
            className="rounded-full"
            priority
          />
          <span className="text-2xl font-bold text-reverb-teal tracking-tight">
            Reverb
          </span>
        </div>

        {/* Nav CTAs */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-reverb-teal font-semibold hover:text-acoustic-blue transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-md bg-reverb-teal text-white font-semibold hover:bg-acoustic-blue transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ---------------------- Hero Section ---------------------- */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12 z-10">
        {/* Translucent card with the carousel */}
        <div
          className="
            relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden
            bg-white/40 dark:bg-[#1A1A1A]/40 backdrop-blur-lg
            border border-white/20 dark:border-white/10
            p-6 sm:p-8
          "
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-reverb-teal mb-1 tracking-tight">
              Reverb
            </h1>
            <p className="text-soft-grey text-lg">
              Connect. Communicate. Create.
            </p>
          </div>

          {/* Onboarding Carousel */}
          <div className="flex justify-center items-center w-full">
            <OnboardingCarousel />
          </div>
        </div>

        {/* ---------------------- Large Call-to-Action Buttons ---------------------- */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="
              px-8 py-4 text-lg font-semibold rounded-lg
              bg-reverb-teal text-white
              hover:bg-acoustic-blue transition shadow-md
              text-center
            "
          >
            Get Started for Free
          </Link>
          <Link
            href="/login"
            className="
              px-8 py-4 text-lg font-semibold rounded-lg border-2
              border-reverb-teal text-reverb-teal
              hover:bg-reverb-teal hover:text-white transition shadow-md
              text-center
            "
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ---------------------- Footer ---------------------- */}
      <footer className="relative z-10 text-center py-6 text-soft-grey text-sm">
        &copy; {new Date().getFullYear()} Reverb. All rights reserved.
      </footer>
    </main>
  );
}
