"use client";

import Certificate from "./Certificate";
import EditCertifications, { cards } from "./EditCertifications";

export default function Certifications() {

  return (
    <div className="bg-sky-500 rounded-3xl space-y-4 p-4">
      <h1 className="text-pretty text-2xl font-bold">Certfications</h1>
      <Certificate cards={cards}/>
      <EditCertifications />
    </div>
  );
}