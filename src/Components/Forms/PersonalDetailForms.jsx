import React, { useEffect, useState } from "react";
import PersonalDetails from "../preview/PersonalDetails";

const PersonalDetailForms = () => {
  const [resumeData, setResumeData] = useState({
    firstName: "",
    lastName:"",
    address: "",
    email: "",
    phoneNo: "",
    linkedin: "",
    github: "",
    education: {
      instituteName: "",
      degree: "",
      percentage: "",
      duration:""
    },
    experience: [],
    skills: {
      programmingLanguages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    projects: [],
  })

 
  const handleInputChange = ( key, value) => {
    setResumeData((prev) => ({
      ...prev,
        [key]: value
    }));
  }


  const handleArrayChange = (section, index, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: updatedArray
    }));
  };

  return (
    <div className="flex w-dvw gap-12">
    <form className="space-y-6 w-1/3">
      {/* General Information */}
      <div>
        <h2 className="text-xl font-bold">General Information</h2>
        {["firstName","lastName", "address", "email", "phoneNo", "linkedin","github"].map((key) => (
          <div key={key} className="mb-4">
            <label className="block font-medium capitalize">{key}:</label>
            <input
              type="text"
              value={resumeData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-bold">Education</h2>
        {Object.keys(resumeData.education).map((key) => (
          <div key={key} className="mb-4">
            <label className="block font-medium capitalize">{key}:</label>
            <input
              type="text"
              value={resumeData.education[key]}
              onChange={(e) =>
                handleInputChange("education", key, e.target.value)
              }
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>
        ))}
      </div>

      {/* Work Experience */}
      <div>
        <h2 className="text-xl font-bold">Work Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-6 border p-4 rounded-md">
            <h3 className="font-bold text-lg">{`Experience #${index + 1}`}</h3>
            {["company", "role", "location", "duration"].map((key) => (
              <div key={key} className="mb-2">
                <label className="block font-medium capitalize">{key}:</label>
                <input
                  type="text"
                  value={exp[key]}
                  onChange={(e) =>
                    handleArrayChange("experience", index, key, e.target.value)
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
            ))}
            <div>
              <label className="block font-medium">Tasks:</label>
              {exp.tasks.map((task, taskIndex) => (
                <input
                  key={taskIndex}
                  type="text"
                  value={task}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "tasks",
                      exp.tasks.map((t, i) =>
                        i === taskIndex ? e.target.value : t
                      )
                    )
                  }
                  className="w-full border rounded-md p-2 mt-1 mb-2"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-bold">Skills</h2>
        {Object.keys(resumeData.skills).map((key) => (
          <div key={key} className="mb-4">
            <label className="block font-medium capitalize">{key}:</label>
            {resumeData.skills[key].map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      [key]: prev.skills[key].map((s, i) =>
                        i === index ? e.target.value : s
                      )
                    }
                  }))
                }
                className="w-full border rounded-md p-2 mt-1 mb-2"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-bold">Projects</h2>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="mb-6 border p-4 rounded-md">
            <h3 className="font-bold text-lg">{`Project #${index + 1}`}</h3>
            {["name", "description"].map((key) => (
              <div key={key} className="mb-2">
                <label className="block font-medium capitalize">{key}:</label>
                <input
                  type="text"
                  value={project[key]}
                  onChange={(e) =>
                    handleArrayChange("projects", index, key, e.target.value)
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </form>
    <div className="w-1/2">
    <PersonalDetails resumeData={resumeData}/>
    </div>
    </div>

  );
};

export default PersonalDetailForms;
