// projectsForm.jsx
import React from "react";

const ProjectsForm = ({
  resumeData,
  handleArrayChange,
  handleAddProject,
  handleRemoveProject,
  nextStep,
  prevStep,
  saveForm,
}) => {
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
              <label className="block text-sm font-medium text-gray-700 capitalize">
                Project Name:
              </label>
              <input
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
              <label className="block text-sm font-medium text-gray-700 capitalize">
                Description:
              </label>
              <textarea
                value={project.desc}
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
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveForm}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
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
    </div>
  );
};

export default ProjectsForm;
