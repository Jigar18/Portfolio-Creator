import About from "./components/AboutSection";
import InfoCard from "./components/InfoCard";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <main className="bg-orange-700 w-[85rem] h-screen text-slate-950 mt-6 mb-6 rounded-3xl">
        <InfoCard />
        <About />
      </main>
    </div>
  );
}
