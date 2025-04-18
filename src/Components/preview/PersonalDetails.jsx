import React from "react";
import PropTypes from "prop-types";

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
            {resumeData.education.map((edu) => (
            <div key={`${edu.instituteName}-${edu.degree}`} className="mt-2">
                <p className="font-semibold">{edu.instituteName}</p>
                <p>
                {edu.degree} | {edu.percentage} | {edu.duration}
                </p>
            </div>
            ))}
        </section>
        )}

      {/* Work Experience Section */}
      {resumeData.workExperience?.some(
        (exp) => exp.companyName || exp.role || exp.duration || exp.desc
        ) && (
        <section className="mt-6">
            <h2 className="text-xl font-bold border-b pb-2">Work Experience</h2>
            {resumeData.workExperience.map((exp) => (
            <div key={`${exp.companyName}-${exp.role}`} className="mt-2">
                <p className="font-semibold">{exp.companyName}</p>
                <p>
                {exp.role} | Duration: {exp.duration}
                </p>
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
            {resumeData.skills.map((skill) => (
                <span
                key={skill} // Using the skill itself as key since it should be unique
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                >
                {skill}
                </span>
            ))}
            </div>
        </section>
        )}


      {/* Projects Section */}
      {resumeData.projects?.some((proj) => proj.projectName || proj.desc) && (
        <section className="mt-6">
            <h2 className="text-xl font-bold border-b pb-2">Projects</h2>
            {resumeData.projects.map((proj) => (
            (proj.projectName || proj.desc) && (
                <div key={proj.projectName || proj.desc} className="mt-2">
                <p className="font-semibold">{proj.projectName}</p>
                <p className="text-gray-600">{proj.desc}</p>
                </div>
            )
            ))}
        </section>
        )}
    </div>
  );
};


PersonalDetails.propTypes = {
    resumeData: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      address: PropTypes.string,
      email: PropTypes.string,
      phoneNo: PropTypes.string,
      linkedin: PropTypes.string,
      github: PropTypes.string,
      education: PropTypes.arrayOf(
        PropTypes.shape({
          instituteName: PropTypes.string,
          degree: PropTypes.string,
          percentage: PropTypes.string,
          duration: PropTypes.string,
        })
      ),
      workExperience: PropTypes.arrayOf(
        PropTypes.shape({
          companyName: PropTypes.string,
          role: PropTypes.string,
          duration: PropTypes.string,
          desc: PropTypes.string,
        })
      ),
      skills: PropTypes.arrayOf(PropTypes.string),
      projects: PropTypes.arrayOf(
        PropTypes.shape({
          projectName: PropTypes.string,
          desc: PropTypes.string,
        })
      ),
    }),
  };

export default PersonalDetails;