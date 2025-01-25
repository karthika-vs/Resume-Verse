import React from "react";

const PersonalDetails = ({ resumeData }) => {
  return (
    <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-3xl font-bold">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        <p className="text-gray-600">
          {resumeData.address} | {resumeData.email} | {resumeData.phoneNo}
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href={resumeData.linkedin}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {resumeData.linkedin}
          </a>
          <a
            href={resumeData.github}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {resumeData.github}
          </a>
        </div>
      </header>

      {/* Education Section */}
      <section className="mt-6">
        <h2 className="text-xl font-bold border-b pb-2">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mt-2">
            <p className="font-semibold">{edu.instituteName}</p>
            <p>
              {edu.degree} | {edu.percentage}% | {edu.duration}
            </p>
          </div>
        ))}
      </section>

      {/* Work Experience Section */}
      <section className="mt-6">
        <h2 className="text-xl font-bold border-b pb-2">Work Experience</h2>
        {resumeData.workExperience.map((exp, index) => (
          <div key={index} className="mt-2">
            <p className="font-semibold">{exp.companyName}</p>
            <p>
              {exp.role} | Duration: {exp.duration}
            </p>
            <p className="text-gray-600">{exp.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PersonalDetails;
