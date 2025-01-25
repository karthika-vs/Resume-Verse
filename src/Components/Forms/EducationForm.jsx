import React from "react";

const EducationForm = ({
  resumeData,
  handleArrayChange,
  handleAddEducation,
  handleRemoveEducation,
  nextStep,
  prevStep,
  saveForm
}) => {
  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>

        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-md">
            <h3 className="font-bold text-lg text-gray-700">{` #${index + 1}`}</h3>
            
            {/* Institute Name and Degree in a Row */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Institute Name:
                </label>
                <input
                  type="text"
                  value={edu["instituteName"]}
                  onChange={(e) =>
                    handleArrayChange("education", index, "instituteName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Degree:
                </label>
                <input
                  type="text"
                  value={edu["degree"]}
                  onChange={(e) =>
                    handleArrayChange("education", index, "degree", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Percentage and Duration in a Row */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Percentage:
                </label>
                <input
                  type="text"
                  value={edu["percentage"]}
                  onChange={(e) =>
                    handleArrayChange("education", index, "percentage", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Duration:
                </label>
                <input
                  type="text"
                  value={edu["duration"]}
                  onChange={(e) =>
                    handleArrayChange("education", index, "duration", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveEducation(index)}
              className="text-red-500 text-sm mt-2 hover:underline focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddEducation}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add Education
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
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

export default EducationForm;
