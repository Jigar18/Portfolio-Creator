export default function Skill({ skill }: { skill: string }) {
    return (
        <div className="bg-sky-400 p-3 rounded-2xl">
            <p className="uppercase font-semibold">{skill}</p>
        </div>
    )
}