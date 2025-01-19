import Certifications from "./Certifications";
import Connect from "./Connect";
import Education from "./Education";
import Skills from "./Skills";

export default function Credentials() {
    return (
        <div className="m-auto p-2 flex flex-col gap-6">
            <Connect />
            <Skills />
            <Certifications />
            <Education />
        </div>
    )
}