"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import CertificateList from "../components/CertificateList";
import EditCertifications from "../components/EditCertifications";
import CertificateModal from "../components/CertificateModal";
import DeleteCertificateModal from "../components/DeleteCertificateModal";

interface Card {
  id: string;
  title: string;
  pdfUrl: string;
  description: string;
}

interface CertificationsProps {
  onOpenCertificate?: (certificate: Card, certificates: Card[]) => void;
}

export default function Certifications({
  onOpenCertificate,
}: CertificationsProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Card | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Card | null>(
    null
  );

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getCertificates");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCards(data.certificates || []);
        }
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = (newCard: Omit<Card, "id">) => {
    fetchCertificates();
  };

  const handleDeleteCard = (cardToDelete: Card) => {
    setCertificateToDelete(cardToDelete);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;

    try {
      const response = await fetch(
        `/api/deleteCertificate?id=${certificateToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCards((prevCards) =>
          prevCards.filter((card) => card.id !== certificateToDelete.id)
        );
        setDeleteModalOpen(false);
        setCertificateToDelete(null);
      } else {
        console.error("Failed to delete certificate");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
    }
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

  if (loading) {
    return (
      <motion.div
        {...{
          className:
            "bg-slate-800/50 rounded-xl border border-slate-700 p-4 shadow-md backdrop-blur-sm",
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2 flex items-center gap-3">
          <span className="inline-flex p-2 rounded-lg bg-orange-900/20 text-orange-400 shadow-lg shadow-orange-500/20 border border-orange-800/30">
            <Award className="h-5 w-5" />
          </span>
          Certifications
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-700/30 rounded-lg"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...{
        className:
          "bg-slate-800/50 rounded-xl border border-slate-700 p-4 shadow-md backdrop-blur-sm",
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2 flex items-center gap-3">
        <span className="inline-flex p-2 rounded-lg bg-orange-900/20 text-orange-400 shadow-lg shadow-orange-500/20 border border-orange-800/30">
          <Award className="h-5 w-5" />
        </span>
        Certifications
      </h2>

      {cards.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">No certificates added yet.</p>
          {canAddMore && <EditCertifications onAddCard={handleAddCard} />}
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* Delete confirmation modal */}
      <DeleteCertificateModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCertificateToDelete(null);
        }}
        onConfirm={confirmDelete}
        certificate={certificateToDelete}
      />

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
