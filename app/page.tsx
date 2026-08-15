import { HomepageExperience } from "@/components/homepage-experience";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HomepageExperience />
      </main>
    </div>
  );
}
