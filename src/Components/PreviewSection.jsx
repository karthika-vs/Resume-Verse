import React, { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";

import PersonalDetails from "./preview/PersonalDetails";
import EducationDetails from "./preview/EducationDetails";
import WorkExperience from "./preview/WorkExperience";
import Skills from "./preview/Skills"; 
import Projects from "./preview/Projects";

const PreviewSection = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full p-7 border-t-[20px]"
      style={{
        borderColor: resumeInfo?.themeColor,
      }}
    >
      {/* Personal Details */}
      <PersonalDetails resumeInfo={resumeInfo} />

      {/* Education */}
      <EducationDetails education={resumeInfo?.education} />
      
      {/* Work Experience */}
      <WorkExperience workExperience={resumeInfo?.workExperience} />

      {/* Skills */}
      <Skills skills={resumeInfo?.skills} />

      {/* Projects */}
      <Projects projects={resumeInfo?.projects} />
    </div>
  );
};

export default PreviewSection;
