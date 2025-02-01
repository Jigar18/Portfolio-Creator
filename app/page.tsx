import dotenv from "dotenv";

export default function Home() {
    dotenv.config();
    const appId = process.env.APP_ID;
    console.log(typeof(appId));
    return (
        <h1 className="text-3xl">Welcome to the Portfolio-Creator Website</h1>
        
        // Add validation and type conversion
        // if (!process.env.APP_ID) {
        //   throw new Error("APP_ID is required");
        // }
        
    )
}