import React from "react";

const ProjectsForm = ({ resumeData, handleArrayChange, nextStep, prevStep }) => {
  const handleAddProject = () => {
    // Add a new project with default values to the projects array
    const newProject = { projectName: "", desc: "" };
    // Directly update the projects array in the state
    handleArrayChange("projects", null, null, [...resumeData.projects, newProject]);
  };

  const handleRemoveProject = (index) => {
    // Remove the project at the given index
    const updatedProjects = resumeData.projects.filter((_, i) => i !== index);
    handleArrayChange("projects", null, null, updatedProjects);
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>

        {resumeData.projects.map((project, index) => (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-md">
            <h3 className="font-bold text-lg text-gray-700">{`#${index + 1}`}</h3>

            {/* Project Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                value={project.projectName}
                onChange={(e) =>
                  handleArrayChange("projects", index, "projectName", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the project name"
              />
            </div>

            {/* Project Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                value={project.desc}
                onChange={(e) =>
                  handleArrayChange("projects", index, "desc", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a brief description"
                rows="4"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProject(index)}
              className="text-red-500 text-sm mt-2 hover:underline focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProject}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add Project
        </button>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsForm;
