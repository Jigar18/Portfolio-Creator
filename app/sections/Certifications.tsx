"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import CertificateList from "../components/CertificateList";
import EditCertifications from "../components/EditCertifications";
import CertificateModal from "../components/CertificateModal";

interface Card {
  title: string;
  pdfUrl: string;
  description: string;
}

interface CertificationsProps {
  onOpenCertificate?: (certificate: Card, certificates: Card[]) => void;
}

const initialCards: Card[] = [
  {
    title: "Advanced Web Development",
    pdfUrl: "web-development-cert.pdf",
    description:
      "This certificate validates the completion of an advanced course in full-stack web development, covering modern JavaScript frameworks, server-side programming, and database management. The program included hands-on projects and real-world applications, demonstrating proficiency in building scalable web applications.",
  },
  {
    title: "UI/UX Design Fundamentals",
    description:
      "Comprehensive training in user interface and experience design principles, including wireframing, prototyping, and user research methodologies. This certification demonstrates expertise in creating intuitive and accessible user interfaces that enhance the overall user experience.",
    pdfUrl: "uiux-design-cert.pdf",
  },
  {
    title: "Cloud Computing Certification",
    description:
      "Professional certification in cloud architecture and deployment, covering major cloud platforms and services. This certification validates expertise in designing, implementing, and managing cloud-based solutions for enterprise applications.",
    pdfUrl: "cloud-computing-cert.pdf",
  },
];

export default function Certifications({
  onOpenCertificate
}: CertificationsProps) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedCertificate, setSelectedCertificate] = useState<Card | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCard = (newCard: Card) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const handleDeleteCard = (cardToDelete: Card) => {
    setCards((prevCards) =>
      prevCards.filter((card) => card.title !== cardToDelete.title)
    );
  };

  const handleOpenCertificate = (certificate: Card) => {
    if (typeof onOpenCertificate === "function") {
      onOpenCertificate(certificate, cards);
    } else {
      setSelectedCertificate(certificate);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const canAddMore = cards.length < 3;

  return (
    <motion.div
      {...{className:"bg-slate-800/50 rounded-xl border border-slate-700 p-4 shadow-md backdrop-blur-sm"}}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2 flex items-center gap-3">
        <span className="inline-flex p-2 rounded-lg bg-orange-900/20 text-orange-400 shadow-lg shadow-orange-500/20 border border-orange-800/30">
          <Award className="h-5 w-5" />
        </span>
        Certifications
      </h2>
      <CertificateList
        cards={cards}
        onOpenCertificate={handleOpenCertificate}
        onDeleteCard={handleDeleteCard}
      />

      {canAddMore ? (
        <EditCertifications onAddCard={handleAddCard} />
      ) : (
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm italic">
            You can add maximum three certificates.
          </p>
        </div>
      )}

      {/* Local modal if no parent handler is provided */}
      {!onOpenCertificate && (
        <CertificateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          certificate={selectedCertificate}
          certificates={cards}
        />
      )}
    </motion.div>
  );
}
