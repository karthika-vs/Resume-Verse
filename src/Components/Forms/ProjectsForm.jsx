import React, { useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { chatSession } from "../../Services/AiModal";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

// Throttle function implementation
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const prompt = " Project Title:{projectTitle}.Technology used: {technoUsed}. Based on this give a description paragraph not points for this project in 3 lines that needs to be added in a resume.";

const ProjectsForm = ({
  resumeData,
  handleArrayChange,
  handleAddProject,
  handleRemoveProject,
  nextStep,
  prevStep,
  saveForm,
}) => {
  const { resumeId } = useParams();
  const { user } = useUser();
  const userId = user?.id;

  const [showTech, setShowTech] = useState(false);
  const [techUsed, setTechUsed] = useState("");
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Remove all HTML tags
      ALLOWED_ATTR: []  // Remove all attributes
    });
  };

  // Validate and sanitize against NoSQL injection
  const validateNoSQL = (input) => {
    if (!input) return true;
    const nosqlPatterns = [
      /\$eq/i, /\$ne/i, /\$gt/i, /\$gte/i, /\$lt/i, /\$lte/i, 
      /\$in/i, /\$nin/i, /\$or/i, /\$and/i, /\$not/i, /\$nor/i,
      /\$exists/i, /\$type/i, /\$mod/i, /\$regex/i, /\$text/i,
      /\$where/i, /\$geoWithin/i, /\$geoIntersects/i, /\$near/i,
      /\$nearSphere/i, /\$all/i, /\$elemMatch/i, /\$size/i,
      /\$bitsAllClear/i, /\$bitsAllSet/i, /\$bitsAnyClear/i,
      /\$bitsAnySet/i, /\$[/i, /{[\s]*\$/i
    ];
    return !nosqlPatterns.some(pattern => pattern.test(input));
  };

  // Validate project fields
  const validateProject = (project, index) => {
    const newErrors = { ...errors };
    
    // Validate project name
    if (!project.projectName?.trim()) {
      newErrors[`projectName-${index}`] = "Project name is required";
    } else if (project.projectName.length > 100) {
      newErrors[`projectName-${index}`] = "Project name must be less than 100 characters";
    } else if (!validateNoSQL(project.projectName)) {
      newErrors[`projectName-${index}`] = "Invalid characters in project name";
    } else {
      delete newErrors[`projectName-${index}`];
    }

    // Validate project description
    if (project.desc && project.desc.length > 500) {
      newErrors[`desc-${index}`] = "Description must be less than 500 characters";
    } else if (project.desc && !validateNoSQL(project.desc)) {
      newErrors[`desc-${index}`] = "Invalid characters in description";
    } else {
      delete newErrors[`desc-${index}`];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Throttled validation function
  const throttledValidate = useCallback(throttle((project, index) => {
    validateProject(project, index);
  }, 500), []);

  // Secure handleArrayChange with sanitization and throttled validation
  const secureHandleArrayChange = (arrayName, index, field, value) => {
    const sanitizedValue = sanitizeInput(value);
    handleArrayChange(arrayName, index, field, sanitizedValue);
    
    // Validate the updated project
    const updatedProject = {
      ...resumeData.projects[index],
      [field]: sanitizedValue
    };
    throttledValidate(updatedProject, index);
  };

  // Throttled save function
  const throttledSave = useCallback(throttle(() => {
    if (validateAllProjects()) {
      saveForm();
    }
  }, 1000), [resumeData.projects, saveForm]);

  // Validate all projects before submission
  const validateAllProjects = () => {
    let isValid = true;
    const newErrors = {};
    
    resumeData.projects.forEach((project, index) => {
      if (!project.projectName?.trim()) {
        newErrors[`projectName-${index}`] = "Project name is required";
        isValid = false;
      }
      if (project.desc && !validateNoSQL(project.desc)) {
        newErrors[`desc-${index}`] = "Invalid characters in description";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const generateDescriptionFromAI = async (project, index) => {
    if (!techUsed.trim()) {
      setErrors(prev => ({ ...prev, [`tech-${index}`]: "Please enter technologies used" }));
      return;
    }

    setAiLoading(true);
    try {
      const PROMPT = prompt
        .replace('{projectTitle}', sanitizeInput(project.projectName))
        .replace('{technoUsed}', sanitizeInput(techUsed));
      
      const result = await chatSession.sendMessage(PROMPT);
      const resultText = await result.response.text();
      const sanitizedText = sanitizeInput(resultText);
      
      secureHandleArrayChange("projects", index, "desc", sanitizedText);
      setShowTech(false);
      setTechUsed("");
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateAllProjects()) {
      return;
    }

    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    try {
      // Prepare sanitized data for submission
      const sanitizedProjects = resumeData.projects.map(project => ({
        projectName: sanitizeInput(project.projectName),
        desc: project.desc ? sanitizeInput(project.desc) : ""
      }));

      const response = await axios.post(
        "https://resumeverse-backend.onrender.com/user",
        {
          userId,
          resumeId,
          projects: sanitizedProjects,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Projects data successfully submitted:", response.data);
        nextStep();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleSave = () => {
    throttledSave();
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>

        {resumeData.projects.map((project, index) => (
          <div
            key={index}
            className="mb-6 p-4 rounded-md border border-gray-300 shadow-sm bg-white"
          >
            <h3 className="font-bold text-lg">{`#${index + 1}`}</h3>

            {/* Project Name */}
            <div className="mb-2">
              <label htmlFor={`project-name-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Project Name: *
              </label>
              <input
                id={`project-name-${index}`}
                type="text"
                value={project.projectName || ""}
                onChange={(e) =>
                  secureHandleArrayChange("projects", index, "projectName", e.target.value)
                }
                className={`w-full border ${errors[`projectName-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                maxLength={100}
                required
              />
              {errors[`projectName-${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`projectName-${index}`]}</p>
              )}
            </div>

            {/* Project Description */}
            <div className="mb-2">
              <label htmlFor={`project-desc-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Description:
              </label>
              <div className="text-right">
                <button
                  type="button"
                  className="bg-purple-500 text-white px-2 py-1 rounded-md mt-1 hover:bg-purple-600 text-sm"
                  onClick={() => setShowTech(true)}
                  disabled={!project.projectName?.trim()}
                >
                  Generate from AI
                </button>
              </div>
              
              {showTech && (
                <div className="mb-2">
                  <label htmlFor={`tech-used-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                    Technologies used: *
                  </label>
                  <input
                    id={`tech-used-${index}`}
                    type="text"
                    placeholder="Eg: React, Node.js, MongoDB"
                    value={techUsed}
                    onChange={(e) => setTechUsed(e.target.value)}
                    className={`w-3/4 border ${errors[`tech-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    className="ml-6 bg-purple-500 text-white px-4 py-2 rounded-md mt-1 hover:bg-purple-600 disabled:bg-purple-300"
                    onClick={() => generateDescriptionFromAI(project, index)}
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Generating..." : "Submit"}
                  </button>
                  {errors[`tech-${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`tech-${index}`]}</p>
                  )}
                </div>
              )}

              <textarea
                id={`project-desc-${index}`}
                value={project.desc || ""}
                onChange={(e) =>
                  secureHandleArrayChange("projects", index, "desc", e.target.value)
                }
                className={`w-full border ${errors[`desc-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                rows="3"
                maxLength={500}
              />
              {errors[`desc-${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`desc-${index}`]}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProject(index)}
              className="text-red-500 text-sm mt-2 hover:text-red-700"
            >
              Remove Project
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProject}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Add Project
        </button>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectsForm.propTypes = {
  resumeData: PropTypes.shape({
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        projectName: PropTypes.string,
        desc: PropTypes.string,
      })
    ),
  }),
  handleArrayChange: PropTypes.func.isRequired,
  handleAddProject: PropTypes.func.isRequired,
  handleRemoveProject: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  saveForm: PropTypes.func.isRequired,
};

export default ProjectsForm;