"use client";

import  React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchCities } from "@/lib/cities";

const inputClassName =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-gray-900 autofill:bg-slate-50";

export default function Details() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    jobTitle: "",
    school: "",
    startYear: "",
    endYear: "",
  });
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const debouncedSearch = React.useMemo(() =>
    async (query: string) => {
      if (query.length < 2) {
        setCitySuggestions([]);
        return;
      }
      const results = await searchCities(query);
      setCitySuggestions(results);
      setIsSearching(false);
    },
    []
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleInputChange(e);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleCitySelect = (city: string) => {
    setFormData((prev) => ({ ...prev, location: city }));
    setCitySuggestions([]);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="w-full bg-gray-100 h-2">
          <div
            className="bg-gray-600 h-2 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {"Let's fill the details for your portfolio"}
            </h1>
            <p className="text-gray-500">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="space-y-8 max-w-xl mx-auto">
            {/* Step 1: Name */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                currentStep > 1
                  ? "-translate-y-2 opacity-80 scale-98 bg-gray-50 rounded-lg p-4"
                  : ""
              }`}
            >
              {currentStep > 1 && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Personal Information
                    </span>
                  </div>
                  {currentStep === 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevStep}
                      className="text-gray-500 hover:text-gray-700 p-0 h-auto"
                    >
                      <span className="flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Edit
                      </span>
                    </Button>
                  )}
                </div>
              )}

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  currentStep > 1 ? "opacity-70" : ""
                }`}
              >
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 font-medium"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className={inputClassName}
                    disabled={currentStep > 1}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 font-medium"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="Enter your last name"
                    disabled={currentStep > 1}
                  />
                </div>
              </div>

              {currentStep === 1 && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={nextStep}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                    disabled={!formData.firstName || !formData.lastName}
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>

            {/* Step 2: Location */}
            {currentStep >= 2 && (
              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  currentStep > 2
                    ? "-translate-y-2 opacity-80 scale-98 bg-gray-50 rounded-lg p-4"
                    : "translate-y-0"
                }`}
              >
                {currentStep > 2 && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Location
                      </span>
                    </div>
                    {currentStep === 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevStep}
                        className="text-gray-500 hover:text-gray-700 p-0 h-auto"
                      >
                        <span className="flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Edit
                        </span>
                      </Button>
                    )}
                  </div>
                )}

                <div
                  className={`${currentStep > 2 ? "opacity-70" : ""} relative`}
                >
                  <Label
                    htmlFor="location"
                    className="text-gray-700 font-medium"
                  >
                    Where are you based?
                  </Label>
                  <div className="relative">
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      className={`${inputClassName} ${
                        citySuggestions.length > 0
                          ? "rounded-b-none border-b-0"
                          : ""
                      }`}
                      placeholder="Enter your city"
                      disabled={currentStep > 2}
                      autoComplete="off"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      </div>
                    )}
                  </div>
                  {citySuggestions.length > 0 && currentStep === 2 && (
                    <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg max-h-[180px] overflow-y-auto">
                      <ul className="py-1 divide-y divide-gray-100">
                        {citySuggestions.map((city, index) => (
                          <li
                            key={index}
                            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm transition-colors"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {currentStep === 2 && (
                  <div
                    className={`mt-6 flex justify-between ${
                      citySuggestions.length > 0 ? "pt-48" : ""
                    }`}
                  >
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="text-gray-600 border-gray-300"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                      disabled={!formData.location}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Job Title */}
            {currentStep >= 3 && (
              <div
                className={`transition-all duration-500 ease-in-out transform ${
                  currentStep > 3
                    ? "-translate-y-2 opacity-80 scale-98 bg-gray-50 rounded-lg p-4"
                    : "translate-y-0"
                }`}
              >
                {currentStep > 3 && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Professional Experience
                      </span>
                    </div>
                    {currentStep === 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevStep}
                        className="text-gray-500 hover:text-gray-700 p-0 h-auto"
                      >
                        <span className="flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Edit
                        </span>
                      </Button>
                    )}
                  </div>
                )}

                <div className={`${currentStep > 3 ? "opacity-70" : ""}`}>
                  <Label
                    htmlFor="jobTitle"
                    className="text-gray-700 font-medium"
                  >
                    Most Recent Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="e.g. Software Engineer"
                    disabled={currentStep > 3}
                  />
                </div>

                {currentStep === 3 && (
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="text-gray-600 border-gray-300"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                      disabled={!formData.jobTitle}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Education */}
            {currentStep >= 4 && (
              <div className="transition-all duration-500 ease-in-out transform translate-y-0">
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="school"
                      className="text-gray-700 font-medium"
                    >
                      School/College/University
                    </Label>
                    <Input
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      className={inputClassName}
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="startYear"
                        className="text-gray-700 font-medium"
                      >
                        Start Year
                      </Label>
                      <Input
                        id="startYear"
                        name="startYear"
                        value={formData.startYear}
                        onChange={handleInputChange}
                        className={inputClassName}
                        placeholder="e.g. 2018"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="endYear"
                        className="text-gray-700 font-medium"
                      >
                        End Year
                      </Label>
                      <Input
                        id="endYear"
                        name="endYear"
                        onChange={handleInputChange}
                        value={formData.endYear}
                        className={inputClassName}
                        placeholder="e.g. 2022 (or Present)"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="text-gray-600 border-gray-300"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                      disabled={!formData.school || !formData.startYear}
                      onClick={() => {
                        console.log(formData);
                        router.push("/user/jigar");
                      }}
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
