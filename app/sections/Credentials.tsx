import Certifications from "./Certifications";
import Connect from "./Connect";
import Education from "../components/Education";
import Skills from "../components/Skills";

export default function Credentials() {
  return (
    <div className="m-auto p-2 flex flex-col gap-3">
      <Connect />
      <Skills />
      <Certifications />
      <Education />
    </div>
  );
}
