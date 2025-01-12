import About from "./components/AboutSection";
import InfoCard from "./components/InfoCard";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <main className="bg-orange-700 w-[65%] h-screen text-slate-950 mt-6 mb-6 rounded-3xl p-14">
        <span className="flex flex-col items-center justify-center">
          <InfoCard />
        </span>
          <About />
          <Projects />
      </main>
    </div>
  );
}
