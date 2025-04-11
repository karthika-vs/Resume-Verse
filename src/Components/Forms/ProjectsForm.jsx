import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { chatSession } from "../../Services/AiModal";
import PropTypes from "prop-types";

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
    const { user } = useUser(); // Fetch the user object from Clerk
    const userId = user?.id; 

    const [showTech , setShowTech] = useState(false);
    const [techUsed , setTechUsed] = useState("");
  
    const generateDescriptionFromAI = async(project,index) => {
      
      const PROMPT = prompt.replace('{projectTitle}',project.projectName);
      const FinPrompt = PROMPT.replace('{technoUsed}',techUsed);
      const result = await chatSession.sendMessage(FinPrompt);
      const resultText = await result.response.text();
      console.log(result.response.text());
      handleArrayChange("projects",index,"desc",resultText);
    }

    const handleSubmit = async () => {
      if (!userId || !resumeId) {
        console.error("User ID or Resume ID is missing.");
        return;
      }
      try {
        const response = await axios.post("https://resumeverse-backend.onrender.com/user", {
          userId,
          resumeId,
          projects: resumeData.projects,
        });
        if (response.status === 200 || response.status === 201) {
          console.log("Projects data successfully submitted:", response.data);
          nextStep(); // Proceed to the next step if submission is successful
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>

        {resumeData.projects.map((project, index) => {
        return(
          <div
            key={index}
            className="mb-6 p-4 rounded-md border border-gray-300 shadow-sm bg-white"
          >
            <h3 className="font-bold text-lg">{`#${index + 1}`}</h3>

            {/* Project Name */}
            <div className="mb-2">
              <label  htmlFor={`project-name-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Project Name:
              </label>
              <input
                id={`project-name-${index}`}
                type="text"
                value={project.projectName}
                onChange={(e) =>
                  handleArrayChange("projects", index, "projectName", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Project Description */}
            <div className="mb-2">
              <label htmlFor={`project-desc-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Description:
              </label>
              <div className="text-right">
                <button type="button" 
                        className="bg-purple-500 text-white px-1 py-1 rounded-md mt-1 hover:bg-purple-600 "
                        onClick={() => setShowTech(true)}
                        >Generate from ai</button>
              </div>
              
              {showTech && (
                <div className="mb-2">
                  <label htmlFor={`tech-used-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                    Technologies used:
                  </label>
                  <input
                    id={`tech-used-${index}`}
                    type="text"
                    placeholder = "Eg: React,NestJs,MongoDB, "
                    onChange={(e) => setTechUsed(e.target.value)}
                    className="w-3/4 border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type ="button"
                          className="ml-6 bg-purple-500 text-white px-6 py-1 rounded-md mt-1 hover:bg-purple-600 "
                          onClick={()=> generateDescriptionFromAI(project,index)}
                          >
                            Submit
                  </button>
                </div>
              )
              }

              <textarea
                id={`project-desc-${index}`}
                value={project.desc || ""}
                onChange={(e) =>
                  handleArrayChange("projects", index, "desc", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProject(index)}
              className="text-red-500 text-sm mt-2"
            >
              Remove
            </button>
          </div>
        )})}

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
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Download
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
  handleArrayChange: PropTypes.func,
  handleAddProject: PropTypes.func,
  handleRemoveProject: PropTypes.func,
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
  saveForm: PropTypes.func,
};

export default ProjectsForm;
