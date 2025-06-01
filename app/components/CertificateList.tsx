"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, X } from "lucide-react";

interface Card {
  title: string;
  pdf: string;
  description: string;
}

interface CertificateListProps {
  cards: Card[];
  onOpenCertificate: (certificate: Card) => void;
  onDeleteCard: (certificate: Card) => void;
}

export default function CertificateList({
  cards,
  onOpenCertificate,
  onDeleteCard,
}: CertificateListProps) {
  return (
    <div className="space-y-4 mt-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          {...{className:"relative group bg-slate-700/30 rounded-lg p-4 border border-slate-700/50 hover:border-blue-500/30 transition-colors cursor-pointer",
          onClick:() => onOpenCertificate(card)}}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.2 }}
          whileHover={{ y: -2, backgroundColor: "rgba(30, 41, 59, 0.7)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card);
            }}
            className="absolute top-2 right-2 p-1 bg-red-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 z-10"
            title="Delete certificate"
          >
            <X className="h-2 w-2" />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-slate-700 p-2 rounded-md text-blue-400 flex-shrink-0 mt-1">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-100 font-medium pr-8">{card.title}</h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                {card.description}
              </p>
              <div className="mt-3 flex gap-4">
                <a
                  href={`/api/download?file=${card.pdf}`}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  download
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <button
                  className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCertificate(card);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
