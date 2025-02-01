import About from "../../sections/AboutSection";
import Credentials from "../../sections/Credentials";
import Experiance from "../../sections/Experiance";
import InfoCard from "../../sections/InfoCard";
import Projects from "../../sections/Projects";

export default function Home() {
  return (
    <div className="container relative mx-auto overflow-auto flex items-center justify-center h-full w-full">
      {/* <main className="bg-orange-700  h-auto text-slate-950 mt-6 mb-6 rounded-3xl p-14"> */}
      <main className="bg-orange-700 mx-auto w-full max-w-[80rem] space-y-8 text-slate-950 mt-6 mb-6 rounded-3xl p-14">
        <span className="flex flex-col items-center justify-center">
          <InfoCard />
        </span>
        <div className="grid grid-cols-11 gap-x-8">
          <div className="col-span-7">
            <About />
            <Projects />
          </div>
          <div className="w-full rounded-3xl mt-10 col-span-4">
            <Credentials />
          </div>
        </div>
        <div className="flex justify-center">
          <Experiance />
        </div>
      </main>
    </div>
  );
}
