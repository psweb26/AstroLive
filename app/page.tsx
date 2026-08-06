import { FeaturedAstrologers } from "@/components/FeaturedAstrologers";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedAstrologers />
        <HowItWorks />
      </main>
    </div>
  );
}
