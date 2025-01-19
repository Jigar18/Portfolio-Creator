import About from "./components/AboutSection";
import Credentials from "./components/Credentials";
import InfoCard from "./components/InfoCard";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <div className="container relative mx-auto overflow-auto flex items-center justify-center h-full w-full">
      {/* <main className="bg-orange-700  h-auto text-slate-950 mt-6 mb-6 rounded-3xl p-14"> */}
      <main className="bg-orange-700 mx-auto w-full max-w-[80rem] space-y-8 text-slate-950 mt-6 mb-6 rounded-3xl p-14"> 
        <span className="flex flex-col items-center justify-center">
          <InfoCard />
        </span>
        <div className="grid grid-cols-3 gap-x-10">
          <div className="col-span-2">
            <About />
            <Projects />
          </div>
          <div className="bg-slate-600 w-full rounded-3xl">
            <Credentials />
          </div>
        </div>
      </main>
    </div>
  );
}
