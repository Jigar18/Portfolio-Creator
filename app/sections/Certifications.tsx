"use client";

import Certificate from "../components/Certificate";
import EditCertifications from "../components/EditCertifications";
import { useState } from "react";

interface Card {
  title: string;
  pdf: string;
  description: string;
}

const initialCards: Card[] = [
  {
    title: "Summertime Sadness",
    pdf: "Fee Reciept.pdf",
    description: "Lana Del Rey, an iconic American singer-songwriter...",
  },
  {
    title: "checking...",
    description: "pLEAS work",
    pdf: "Jigar Resume MIP.pdf",
  },
];

export default function Certifications() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleAddCard = (newCard: Card) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <div className="bg-sky-500 rounded-3xl space-y-4 p-4">
      <h1 className="text-pretty text-2xl font-bold">Certifications</h1>
      <Certificate cards={cards} />
      <EditCertifications onAddCard={handleAddCard} />
    </div>
  );
}
