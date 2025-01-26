import React, { useState,useRef} from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from 'jspdf';
import GeneralInfoForm from "./Forms/GeneralInfoForm";
import EducationForm from "./Forms/EducationForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import SkillsForm from "./Forms/SkillsForm";
import ProjectsForm from "./Forms/ProjectsForm";
import PersonalDetails from "./preview/PersonalDetails";

const FormSection = () => {
  const [step, setStep] = useState(1);
  const pdfRef = useRef(null);
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
        duration: "",
        desc: "",
      },
    ],
    skills: [],
    projects: [
      {
        projectName: "",
        desc: "",
      },
    ],
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

      if (index !== null && key !== null) {
        updatedArray[index][key] = value; // Update specific project or field
      } else {
        // If adding a new project, simply push the new value
        updatedArray.push(value);
      }

      return { ...prev, [section]: updatedArray };
    });
  };

  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          instituteName: "",
          degree: "",
          percentage: "",
          duration: "",
        },
      ],
    }));
  };

  const handleRemoveEducation = (index) => {
    setResumeData((prev) => {
      const updatedEducation = prev.education.filter((_, i) => i !== index);
      return { ...prev, education: updatedEducation };
    });
  };

  const handleAddWorkExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          companyName: "",
          role: "",
          duration: "",
          desc: "",
        },
      ],
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setResumeData((prev) => {
      const updatedWorkExperience = prev.workExperience.filter((_, i) => i !== index);
      return { ...prev, workExperience: updatedWorkExperience };
    });
  };

  const handleAddProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          projectName: "",
          desc: "",
        },
      ],
    }));
  };

  const handleRemoveProject = (index) => {
    setResumeData((prev) => {
      const updatedProjects = prev.projects.filter((_, i) => i !== index);
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleSkillsUpdate = (updatedSkills) => {
    setResumeData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const nextStep = async () => {
    if (step === 5) { 
      await downloadPDF();
    }
    setStep((prev) => prev + 1);
};
  const prevStep = () => setStep((prev) => prev - 1);

  const downloadPDF = async () => {
    const element = pdfRef.current;
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    }
  };
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
        {step === 4 && (
          <SkillsForm
            skills={resumeData.skills}
            handleSkillsUpdate={handleSkillsUpdate}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 5 && (
          <ProjectsForm
            resumeData={resumeData}
            handleArrayChange={handleArrayChange}
            handleAddProject={handleAddProject}
            handleRemoveProject={handleRemoveProject}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
      </div>

      {/* Right: Preview Section */}
      <div ref={pdfRef} className="w-1/2 p-6 bg-gray-50 mt-5">
        <PersonalDetails resumeData={resumeData} />
      </div>
    </div>
  );
};

export default FormSection;
