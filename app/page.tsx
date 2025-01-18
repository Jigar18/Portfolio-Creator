import About from "./components/AboutSection";
import InfoCard from "./components/InfoCard";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full flex-wrap">
      <main className="bg-orange-700 w-[65%] max-w-[96rem] h-auto text-slate-950 mt-6 mb-6 rounded-3xl p-14">
        <span className="flex flex-col items-center justify-center">
          <InfoCard />
        </span>
        <div className="grid grid-cols-3 gap-x-10">
          <div className="col-span-2">
            <About />
            <Projects />
          </div>
          <div className="bg-purple-600 w-full">
            {/* <Connect /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
