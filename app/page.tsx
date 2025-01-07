import InfoCard from "./components/InfoCard";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <main className="bg-slate-400 w-[85rem] h-screen text-slate-950 mt-6 mb-6 rounded-3xl flex justify-center">
        <InfoCard />
      </main>
    </div>
  );
}
