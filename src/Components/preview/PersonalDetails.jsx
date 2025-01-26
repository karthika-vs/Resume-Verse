import React from "react";

const PersonalDetails = ({ resumeData, pdfMode }) => {
  return (
    <div
      className={`max-w-4xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg ${
        pdfMode ? "bg-transparent shadow-none p-4" : ""
      }`}
    >
      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-3xl font-bold">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        <p className="text-gray-600">
          {resumeData.address} | {resumeData.email} | {resumeData.phoneNo}
        </p>
        <div className="flex justify-center gap-4 mt-2">
          {resumeData.linkedin && (
            <a
              href={resumeData.linkedin}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData.linkedin}
            </a>
          )}
          {resumeData.github && (
            <a
              href={resumeData.github}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData.github}
            </a>
          )}
        </div>
      </header>

      {/* Education Section */}
      {resumeData.education?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold border-b pb-2">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mt-2">
              <p className="font-semibold">{edu.instituteName}</p>
              <p>{edu.degree} | {edu.percentage} | {edu.duration}</p>
            </div>
          ))}
        </section>
      )}

      {/* Work Experience Section */}
      {resumeData.workExperience?.some(exp => exp.companyName) && (
        <section className="mt-6">
          <h2 className="text-xl font-bold border-b pb-2">Work Experience</h2>
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="mt-2">
              <p className="font-semibold">{exp.companyName}</p>
              <p>{exp.role} | Duration: {exp.duration}</p>
              <p className="text-gray-600">{exp.desc}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills Section */}
      {resumeData.skills?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold border-b pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {resumeData.projects?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold border-b pb-2">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mt-2">
              <p className="font-semibold">{project.projectName}</p>
              <p>{project.desc}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default PersonalDetails;
