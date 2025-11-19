"use client";

import api from "@/lib/utils/fetcher/client/axios";
import { LearningField } from "@/types/user/category";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface personalizeProps {
  learningFields: LearningField[];
}

const Personalize = ({ learningFields }: personalizeProps) => {
  console.log(learningFields);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedField, setSelectedField] = useState<LearningField | null>(
    null
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{
    field?: string;
    skills?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleFieldSelect = (learningField: LearningField) => {
    setSelectedField(learningField);
    setSelectedSkills([]);
    if (errors.field) {
      setErrors((prev) => ({ ...prev, field: "" }));
    }
  };

  // Handle skill selection (checkbox style)
  const handleSkillToggle = (skillname: string) => {
    setSelectedSkills((prev) => {
      const newSelection = prev.includes(skillname)
        ? prev.filter((name) => name !== skillname)
        : [...prev, skillname];

      if (errors.skills && newSelection.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, skills: "" }));
      }

      return newSelection;
    });
  };

  // Remove selected skill
  const removeSkill = (skillname: string) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillname));
  };

  // Navigate between steps
  const handleNext = () => {
    if (
      currentStep === 0 && selectedField
        ? selectedField?.children?.length > 0
        : false
    ) {
      if (!selectedField) {
        setErrors({ field: "Vui lòng chọn lĩnh vực học tập" });
        return;
      }
      setCurrentStep(1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step
  const isCurrentStepValid = () => {
    if (currentStep === 0) {
      return selectedField?.id !== -1;
    }
    if (currentStep === 1) {
      return selectedSkills.length > 0;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedField) {
      setErrors({ field: "Vui lòng chọn lĩnh vực học tập" });
      return;
    }
    if (selectedField?.children?.length > 0 && selectedSkills.length === 0) {
      setErrors({ skills: "Vui lòng chọn ít nhất một kỹ năng" });
      return;
    } else {
      let personalize = "";
      if (selectedSkills.length > 0) {
        selectedSkills.unshift(
          "Lĩnh vực: " +
            selectedField.name +
            ". Kỹ năng: " +
            selectedSkills.pop()
        );
        personalize = selectedSkills.join(", ");
      } else {
        personalize = "Lĩnh vực: " + selectedField.name + ".";
      }
      console.log(personalize);

      setIsLoading(true);
      try {
        await api.post("/learning_fields/save", {
          preferences: personalize,
        });
        router.push("/");
      } catch (error: any) {
        console.error("Error saving preferences:", error);
        if (error?.status === 401) {
          router.push("/auth/login?redirect=/personalize");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 bg">
          <div className="flex items-center justify-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-3">
                {/* Book Icon */}
                <div className="relative">
                  <img
                    src="/logo/studynest-logo.svg"
                    alt="StudyNest Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                {/* Brand Text */}
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-2xl font-black text-gray-900 tracking-wide">
                      STUDY
                    </span>
                    <span className="text-2xl font-black text-teal-500 ml-0.5">
                      NEST
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 tracking-widest uppercase -mt-1">
                    Spreading Knowledge
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>
                Bước {currentStep + 1} / {1}
              </span>
              <span>
                {Math.round(
                  ((currentStep +
                    (currentStep === 0 && selectedField
                      ? 0.5
                      : currentStep === 1 && selectedSkills.length > 0
                      ? 0.5
                      : 0)) /
                    1) *
                    100
                )}
                %s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${
                    ((currentStep +
                      (currentStep === 0 && selectedField
                        ? 0.5
                        : currentStep === 1 && selectedSkills.length > 0
                        ? 0.5
                        : 0)) /
                      1) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
        <div className="max-w-6xl mx-auto flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-orange-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              Trả lời một số câu hỏi để chúng tôi có thể cải thiện để xuất nội
              dung của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Current Step Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {/* {steps[currentStep].title} */}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {/* {steps[currentStep].description} */}
          </p>

          {/* Step 0: Field Selection */}
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
                {learningFields.map((learningField) => (
                  <label
                    key={learningField.id}
                    className={`group flex items-center p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedField?.id === learningField.id
                        ? "bg-teal-50 border-2 border-teal-500 shadow-lg transform scale-[1.02]"
                        : "bg-white border-2 border-gray-100 hover:border-teal-200 hover:bg-teal-50/30"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedField?.id === learningField.id
                          ? "border-teal-500 bg-teal-500"
                          : "border-gray-300 group-hover:border-teal-400"
                      }`}
                    >
                      {selectedField?.id === learningField.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`ml-4 text-lg font-medium transition-colors ${
                        selectedField?.id === learningField.id
                          ? "text-teal-900"
                          : "text-gray-700 group-hover:text-teal-800"
                      }`}
                    >
                      {learningField.name}
                    </span>
                    <input
                      type="radio"
                      name="field"
                      value={learningField.id}
                      checked={selectedField?.id === learningField.id}
                      onChange={() => handleFieldSelect(learningField)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              {errors.field && (
                <div className="text-red-600 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg">
                  {errors.field}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Skills Selection */}
          {currentStep === 1 && (
            <div>
              {selectedSkills?.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills?.map((skill) => {
                      return skill ? (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <HiX className="h-4 w-4" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Search Box */}
              <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm một kỹ năng"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              </div>

              {/* Popular Skills Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Phổ biến với những học viên như bạn
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedField?.children
                    .filter((skill) =>
                      skill.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((skill) => {
                      const isSelected = selectedSkills.includes(skill.name);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleSkillToggle(skill.name)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:shadow-md ${
                            isSelected
                              ? "bg-teal-600 text-white border-teal-600 shadow-lg"
                              : "bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-teal-50"
                          }`}
                        >
                          + {skill.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              {errors.skills && (
                <div className="text-red-600 text-sm mt-4">{errors.skills}</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center pt-12">
          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-teal-600 font-medium rounded-lg border border-teal-600 hover:bg-teal-50 transition-colors"
              >
                Quay lại
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepValid() || isLoading}
              className="px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : currentStep === 1 ||
                (currentStep === 0 && selectedField?.children?.length === 0) ? (
                "Hoàn thành"
              ) : (
                "Tiếp theo"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalize;
