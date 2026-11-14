import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { AboutSection } from "@/components/about-section";
import FeaturedStudios from "@/components/featured-studios";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-studios`, {
    cache: "no-cache",
  });
  const data = res.json();
  console.log(data);
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background font-sans">
      <main className="flex-1">
        <HeroSection />
        <FeaturedStudios></FeaturedStudios>
        <HowItWorksSection />
        <AboutSection />
      </main>
    </div>
  );
}
