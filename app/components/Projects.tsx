export default function Projects() {
    return (
        <div className="flex flex-col w-full items-center justify-center mt-10">
            <div className="w-[88%]">
                <span className="bg-neutral-300 w-52 h-12 rounded-t-3xl flex items-center justify-center pt-2 border-b-[1px] border-neutral-900">
                    <h1 className="text-4xl font-bold">Projects</h1>
                </span>
                <div className="bg-neutral-300 rounded-3xl rounded-tl-none mb-6 flex justify-center">
                    <p className="text-lg text-justify p-5">
                        Here are some of the projects I have worked on:
                            <li>Project 1</li>
                            <li>Project 2</li>
                            <li>Project 3</li>
                        
                    </p>
                </div>
            </div>
        </div>
    )
}