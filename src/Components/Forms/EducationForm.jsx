import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";

const EducationForm = ({
  resumeData,
  handleArrayChange,
  handleAddEducation,
  handleRemoveEducation,
  nextStep,
  prevStep,
  saveForm,
}) => {
  const { resumeId } = useParams();
  const { user } = useUser(); 
  const userId = user?.id; 

  const handleSubmit = async () => {
    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    try {
      const response = await axios.post("https://resumeverse-backend.onrender.com/user", {
        userId,
        resumeId,
        education: resumeData.education,
      });
      
      if (response.status === 200 || response.status === 201) {
        console.log("Education data successfully submitted:", response.data);
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>

        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-md">
            <h3 className="font-bold text-lg text-gray-700">{`#${index + 1}`}</h3>

            {/* Institute Name and Degree in a Row */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label 
                htmlFor={`institute-name-${index}`}
                className="block text-sm font-medium text-gray-700 capitalize">
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
                <label 
                htmlFor={`degree-${index}`}
                className="block text-sm font-medium text-gray-700 capitalize">
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
                <label 
                htmlFor={`percentage-${index}`}
                className="block text-sm font-medium text-gray-700 capitalize">
                  Percentage/Grade:
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
                <label 
                htmlFor={`duration-${index}`} 
                className="block text-sm font-medium text-gray-700 capitalize">
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

EducationForm.propTypes = {
  resumeData: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        instituteName: PropTypes.string,
        degree: PropTypes.string,
        percentage: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
  }),
  handleArrayChange: PropTypes.func,
  handleAddEducation: PropTypes.func,
  handleRemoveEducation: PropTypes.func,
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
  saveForm: PropTypes.func,
};

export default EducationForm;
