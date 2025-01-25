import React, { useState } from "react";
import PersonalDetails from "../preview/PersonalDetails";

const PersonalDetailForms = () => {
  const [resumeData, setResumeData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phoneNo: "",
    linkedin: "",
    github: "",
    education: [
      {
        instituteName: "",
        degree: "",
        percentage: "",
        duration: "",
      },
    ],
    experience: [],
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

  return (
    <div className="flex w-dvw gap-12">
      <form className="space-y-6 w-1/3">
        {/* General Information */}
        <div>
          <h2 className="text-xl font-bold">General Information</h2>
          {["firstName", "lastName", "address", "email", "phoneNo", "linkedin", "github"].map(
            (key) => (
              <div key={key} className="mb-4">
                <label className="block font-medium capitalize">{key}:</label>
                <input
                  type="text"
                  value={resumeData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
            )
          )}
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xl font-bold">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-6 border p-4 rounded-md">
              <h3 className="font-bold text-lg">{`Education #${index + 1}`}</h3>
              {["instituteName", "degree", "percentage", "duration"].map((key) => (
                <div key={key} className="mb-2">
                  <label className="block font-medium capitalize">{key}:</label>
                  <input
                    type="text"
                    value={edu[key]}
                    onChange={(e) =>
                      handleArrayChange("education", index, key, e.target.value)
                    }
                    className="w-full border rounded-md p-2 mt-1"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEducation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Add Education
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="w-1/2">
        <PersonalDetails resumeData={resumeData} />
      </div>
    </div>
  );
};

export default PersonalDetailForms;
