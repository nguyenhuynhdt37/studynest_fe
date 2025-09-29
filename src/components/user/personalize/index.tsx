"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface Field {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  selected?: boolean;
}

const Personalize = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{
    field?: string;
    skills?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Steps for navigation
  const steps = [
    {
      id: 0,
      title: "Bạn đang học lĩnh vực gì?",
      description:
        "Trả lời một số câu hỏi để chúng tôi có thể cải thiện để xuất nội dung của bạn",
    },
    {
      id: 1,
      title: "Bạn quan tâm đến kỹ năng nào?",
      description:
        "Hãy chọn một vài kỹ năng để bắt đầu. Bạn có thể thay đổi những kỹ năng này hoặc theo dõi nhiều kỹ năng hơn trong tương lai.",
    },
  ];

  // Danh sách lĩnh vực học tập
  const fields: Field[] = [
    { id: "software-development", name: "Phát triển phần mềm" },
    { id: "data-analysis", name: "Dữ liệu & Phân tích" },
    { id: "information-technology", name: "Công nghệ thông tin" },
    { id: "marketing", name: "Marketing" },
    { id: "design", name: "Thiết kế" },
    { id: "user-experience", name: "Người dùng trải nghiệm" },
    { id: "education", name: "Giáo dục và đào tạo" },
    { id: "support", name: "Hỗ trợ khách hàng" },
    { id: "health", name: "Sức khỏe thể chất & tinh thần" },
    { id: "arts", name: "Viết" },
    { id: "finance", name: "Tài chính & Kế toán" },
    { id: "project-management", name: "Quản lý sản phẩm và dự án" },
    { id: "business", name: "Hoạt động kinh doanh" },
    { id: "entertainment", name: "Không muốn nói ở trên" },
    { id: "retail", name: "Phát triển kinh doanh và bán hàng" },
  ];

  // Danh sách kỹ năng được đề xuất và phổ biến
  const popularSkills: Skill[] = [
    { id: "web-development", name: "Kiến trúc phần mềm" },
    { id: "devops", name: "DevOps (Phát triển và vận hành)" },
    { id: "data-engineering", name: "Kỹ thuật dữ liệu" },
    { id: "machine-learning", name: "Kiến trả phần mềm" },
    { id: "python", name: "Python" },
    { id: "web-development-full", name: "Phát triển web" },
    { id: "full-stack", name: "Phát triển web toàn diện (full stack)" },
    { id: "wordpress", name: "WordPress" },
    { id: "android", name: "Phát triển Android" },
    { id: "java", name: "Java" },
    { id: "javascript", name: "JavaScript" },
    { id: "dotnet", name: ".NET" },
    { id: "mobile-development", name: "Phát triển ứng dụng cho iOS" },
    { id: "mobile-dev", name: "Phát triển ứng dụng mobile" },
    { id: "software-development", name: "Phát triển phần mềm" },
    { id: "chat-bot", name: "Nguyên tắc cơ bản về phát triển trò chuyện" },
  ];

  const allSkills = [
    ...popularSkills,
    { id: "php", name: "PHP (programming language)" },
    { id: "react", name: "React JS" },
    { id: "html", name: "HTML" },
    { id: "laravel", name: "Laravel" },
    { id: "bootstrap", name: "Bootstrap" },
    { id: "php-mvc", name: "PHP MVC" },
    { id: "mysql", name: "MySQL" },
    { id: "css", name: "CSS" },
    { id: "oop", name: "Lập trình hướng đối tượng (OOP)" },
  ];

  // Filtered skills based on search
  const filteredSkills = allSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle field selection (radio button style)
  const handleFieldSelect = (fieldId: string) => {
    setSelectedField(fieldId);
    if (errors.field) {
      setErrors((prev) => ({ ...prev, field: "" }));
    }
  };

  // Handle skill selection (checkbox style)
  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) => {
      const newSelection = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];

      if (errors.skills && newSelection.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, skills: "" }));
      }

      return newSelection;
    });
  };

  // Remove selected skill
  const removeSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
  };

  // Navigate between steps
  const handleNext = () => {
    if (currentStep === 0) {
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
      return selectedField !== "";
    }
    if (currentStep === 1) {
      return selectedSkills.length > 0;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      setErrors({ skills: "Vui lòng chọn ít nhất một kỹ năng" });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call để lưu preferences
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save to localStorage hoặc gửi lên server
      const preferences = {
        field: selectedField,
        skills: selectedSkills,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("user-preferences", JSON.stringify(preferences));

      // Redirect to dashboard hoặc trang chính
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <img
              src="/logo/studynest-logo.svg"
              alt="StudyNest"
              className="h-10 w-auto"
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>
                Bước {currentStep + 1} / {steps.length}
              </span>
              <span>
                {Math.round(
                  ((currentStep +
                    (currentStep === 0 && selectedField
                      ? 0.5
                      : currentStep === 1 && selectedSkills.length > 0
                      ? 0.5
                      : 0)) /
                    steps.length) *
                    100
                )}
                %
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
                      steps.length) *
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
            {steps[currentStep].title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {steps[currentStep].description}
          </p>

          {/* Step 0: Field Selection */}
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 gap-3">
                {fields.map((field) => (
                  <label
                    key={field.id}
                    className={`group flex items-center p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedField === field.id
                        ? "bg-teal-50 border-2 border-teal-500 shadow-lg transform scale-[1.02]"
                        : "bg-white border-2 border-gray-100 hover:border-teal-200 hover:bg-teal-50/30"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedField === field.id
                          ? "border-teal-500 bg-teal-500"
                          : "border-gray-300 group-hover:border-teal-400"
                      }`}
                    >
                      {selectedField === field.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`ml-4 text-lg font-medium transition-colors ${
                        selectedField === field.id
                          ? "text-teal-900"
                          : "text-gray-700 group-hover:text-teal-800"
                      }`}
                    >
                      {field.name}
                    </span>
                    <input
                      type="radio"
                      name="field"
                      value={field.id}
                      checked={selectedField === field.id}
                      onChange={() => handleFieldSelect(field.id)}
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
              {/* Selected Skills Tags */}
              {selectedSkills.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = allSkills.find((s) => s.id === skillId);
                      return skill ? (
                        <span
                          key={skillId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {skill.name}
                          <button
                            type="button"
                            onClick={() => removeSkill(skillId)}
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
                  {popularSkills
                    .filter((skill) =>
                      skill.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((skill) => {
                      const isSelected = selectedSkills.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleSkillToggle(skill.id)}
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

              {/* All Skills Section */}
              {searchTerm && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tất cả kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {filteredSkills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleSkillToggle(skill.id)}
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
              )}

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
              ) : currentStep === steps.length - 1 ? (
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
