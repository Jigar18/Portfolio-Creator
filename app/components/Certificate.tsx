"use client";

import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/use-outside-click";
import { AnimatePresence, motion } from "framer-motion";

interface Card {
  title: string;
  pdf: string;
  description: string;
}

interface CertificateProps {
  cards: Card[];
}

export default function Certificate({ cards }: CertificateProps) {
    const [active, setActive] = useState<Card | boolean | null>(
        null
      );
      const ref = useRef<HTMLDivElement>(null);
      const id = useId();
    
      useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
          if (event.key === "Escape") {
            setActive(false);
          }
        }
    
        if (active && typeof active === "object") {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
    
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
      }, [active]);
    
      useOutsideClick(ref, () => setActive(null));
    return (
        <>
        <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-8">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-[70vw] h-[80vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden"
            >
              <motion.div 
                layoutId={`image-${active.title}-${id}`}
                className="h-[80%] relative flex items-center justify-center p-4"
              >
                <embed
                  src={`/uploads/${active.pdf}#toolbar=0`}
                  height="100%"
                  width="100%"
                  className="object-contain"
                />
              </motion.div>

              <div className="flex-1 overflow-auto p-8">
                <motion.h3
                  layoutId={`title-${active.title}-${id}`}
                  className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-4"
                >
                  {active.title}
                </motion.h3>
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 dark:text-neutral-400 text-base overflow-auto"
                >
                  <p>
                    {active.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="flex flex-col md:flex-row justify-between items-center hover:bg-neutral-400 dark:hover:bg-neutral-800 rounded-xl cursor-pointer m-auto"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={"/icons8-certificate-64.png"}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex items-center">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
      </>
    )
}


export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};