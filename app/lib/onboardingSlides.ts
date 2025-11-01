// src/lib/onboardingSlides.ts

import { MessageCircle, Users, Sparkles, Lock } from "lucide-react";

/**
 * Type definition for each onboarding slide.
 * This makes your carousel strongly typed.
 */
export interface SlideContent {
  title: string;
  description: string;
  image: string; // background image for this slide
  colorClass: string; // tailwind color class (for icon tint)
  icon: React.ElementType; // lucide-react icon component
}

/**
 * Example slides for the onboarding carousel.
 * You can replace image URLs with your own.
 * Recommended: 1200x800 or higher resolution for good clarity.
 */
export const onboardingSlides: SlideContent[] = [
  {
    title: "Chat That Resonates",
    description:
      "Reverb helps you build deeper conversations — where every message bounces back with meaning.",
    image: "feature-2.png", // Replace with your image path
    colorClass: "text-[#00A389]", // Reverb Teal
    icon: MessageCircle,
  },
  {
    title: "Connect Effortlessly",
    description:
      "Join communities, share moments, and stay close to what matters most — instantly and securely.",
    image: "hero-chat.png",
    colorClass: "text-[#3498DB]", // Acoustic Blue
    icon: Users,
  },
  {
    title: "Create Together",
    description:
      "From chat to collaboration — express ideas and co-create in real time with powerful tools.",
    image: "feature-1.png",
    colorClass: "text-[#00A389]", // Reverb Teal
    icon: Sparkles,
  },
  {
    title: "Your Privacy, Our Priority",
    description:
      "Built with robust security to keep your conversations private and protected.",
    image: "feature-3.png",
    colorClass: "text-[#3498DB]", // Acoustic Blue
    icon: Lock,
  }
];
