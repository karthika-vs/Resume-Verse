import React, { useState } from "react";
import GeneralInfoForm from "./Forms/GeneralInfoForm";
import EducationForm from "./Forms/EducationForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm"; // Added WorkExperienceForm
import PersonalDetails from "./preview/PersonalDetails";

const FormSection = () => {
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phoneNo: "",
    linkedin: "",
    github: "",
    jobTitle: "",
    education: [
      {
        instituteName: "",
        degree: "",
        percentage: "",
        duration: "",
      },
    ],
    workExperience: [
      {
        companyName: "",
        role: "",
        duration:"",
        desc: "",
      },
    ],
    skills: {
      programmingLanguages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    projects: [],
  });

  const handleInputChange = (key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayChange = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray[index][key] = value;
      return { ...prev, [section]: updatedArray };
    });
  };

  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { instituteName: "", degree: "", percentage: "", duration: "" },
      ],
    }));
  };

  const handleRemoveEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { companyName: "", role: "", duration: "", desc: "" },
      ],
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex w-full h-full">
      {/* Left: Form Section */}
      <div className="w-1/2 p-6">
        {step === 1 && (
          <GeneralInfoForm
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <EducationForm
            resumeData={resumeData}
            handleArrayChange={handleArrayChange}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <WorkExperienceForm
            resumeData={resumeData}
            handleArrayChange={handleArrayChange}
            handleAddWorkExperience={handleAddWorkExperience}
            handleRemoveWorkExperience={handleRemoveWorkExperience}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
      </div>

      {/* Right: Preview Section */}
      <div className="w-1/2 p-6 bg-gray-50 mt-5">
        <PersonalDetails resumeData={resumeData} />
      </div>
    </div>
  );
};

export default FormSection;
