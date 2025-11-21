"use client";

import { useCallback, useRef } from "react";
import CategoriesSection from "./categories-section";
import CoursesSection from "./courses-section";
import CTASection from "./cta-section";
import HeroSection from "./hero-section";
import InstructorsSection from "./instructors-section";
import StatsSection from "./stats-section";
import TestimonialsSection from "./testimonials-section";

const Home = () => {
  const coursesSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToCourses = useCallback(() => {
    coursesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onScrollToCourses={scrollToCourses} />

      <div ref={coursesSectionRef}>
        <CoursesSection />
      </div>

      <CategoriesSection />

      <StatsSection />

      <InstructorsSection />

      <TestimonialsSection />

      <CTASection />
    </div>
  );
};

export default Home;
