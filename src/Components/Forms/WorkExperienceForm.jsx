  import React from "react";
  import axios from "axios";
  import { useParams } from "react-router-dom";
  import { useUser } from "@clerk/clerk-react";

  const WorkExperienceForm = ({
    resumeData,
    handleArrayChange,
    handleAddWorkExperience,
    handleRemoveWorkExperience,
    nextStep,
    prevStep,
    saveForm,
  }) => {
    const { resumeId } = useParams();
    const { user } = useUser(); // Fetch the user object from Clerk
    const userId = user?.id; // Extract the userId from the Clerk user object

    const handleSubmit = async () => {
      if (!userId || !resumeId) {
        console.error("User ID or Resume ID is missing.");
        return;
      }

      try {
        const response = await axios.post("https://resumeverse-backend.onrender.com/user", {
          userId,
          resumeId,
          workExperience: resumeData.workExperience,
        });
        if (response.status === 200 || response.status === 201) {
          console.log("Work experience data successfully submitted:", response.data);
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
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Work Experience</h2>

          {resumeData.workExperience.map((exp, index) => (
            <div
              key={index}
              className="mb-6 p-4 rounded-md border border-gray-300 shadow-sm bg-white"
            >
              <h3 className="font-bold text-lg">{`#${index + 1}`}</h3>

              {/* Company Name and Role in a row */}
              <div className="flex gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "companyName", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    Role:
                  </label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "role", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Duration:
                </label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) =>
                    handleArrayChange("workExperience", index, "duration", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  Description:
                </label>
                <textarea
                  value={exp.desc}
                  onChange={(e) =>
                    handleArrayChange("workExperience", index, "desc", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveWorkExperience(index)}
                className="text-red-500 text-sm mt-2 hover:underline focus:outline-none"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddWorkExperience}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Experience
          </button>

          <div className="flex justify-between items-center mt-6">
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

  export default WorkExperienceForm;
