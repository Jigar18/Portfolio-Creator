"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface EducationItem {
  id?: string;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrently: boolean;
  description?: string;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: EducationItem[];
  onSave: (education: EducationItem[]) => void;
}

export default function EducationModal({
  isOpen,
  onClose,
  education,
  onSave,
}: EducationModalProps) {
  const [editingEducation, setEditingEducation] = useState<EducationItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditingEducation([...education]);
      setIsEditing(false);
    }
  }, [isOpen, education]);

  const addNewEducation = () => {
    const newEducation: EducationItem = {
      school: "",
      degree: "",
      field: "",
      startYear: new Date().getFullYear(),
      isCurrently: false,
    };
    setEditingEducation([...editingEducation, newEducation]);
    setIsEditing(true);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...editingEducation];
    updated[index] = { ...updated[index], [field]: value };
    setEditingEducation(updated);
  };

  const removeEducation = (index: number) => {
    const updated = editingEducation.filter((_, i) => i !== index);
    setEditingEducation(updated);
  };

  const handleSave = () => {
    onSave(editingEducation);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        {...{
          className:
            "fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
          onClick: onClose,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          {...{
            className:
              "relative w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto",
            onClick: (e: React.MouseEvent) => e.stopPropagation(),
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900/20 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Manage Education
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {editingEducation.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-800 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">
                  No Education Added
                </h3>
                <p className="text-slate-500 mb-6">
                  Add your educational background to showcase your academic
                  achievements
                </p>
                <Button
                  onClick={addNewEducation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            ) : (
              <>
                {editingEducation.map((edu, index) => (
                  <motion.div
                    key={index}
                    {...{
                      className:
                        "bg-slate-800/50 rounded-lg p-6 border border-slate-700",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-200">
                        Education {index + 1}
                      </h3>
                      <Button
                        onClick={() => removeEducation(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          School/University *
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(index, "school", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter school or university name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Degree *
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Bachelor of Technology"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Field of Study *
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) =>
                            updateEducation(index, "field", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Computer Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Start Year *
                        </label>
                        <input
                          type="number"
                          value={edu.startYear}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "startYear",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1950"
                          max="2030"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center gap-4 mb-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={edu.isCurrently}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "isCurrently",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-300">
                              Currently studying here
                            </span>
                          </label>
                        </div>
                        {!edu.isCurrently && (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              End Year
                            </label>
                            <input
                              type="number"
                              value={edu.endYear || ""}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "endYear",
                                  e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined
                                )
                              }
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="1950"
                              max="2030"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-center">
                  <Button
                    onClick={addNewEducation}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Education
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-6">
            <div className="flex gap-3 justify-end">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
