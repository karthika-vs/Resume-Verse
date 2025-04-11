import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";

const GeneralInfoForm = ({ resumeData, handleInputChange, nextStep, saveForm }) => {
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
        ...resumeData,
      });
      if (response.status === 200 || response.status === 201) {
        console.log("Data successfully submitted:", response.data);
        nextStep(); 
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">General Information</h2>

        {/* First Name and Last Name in a row */}
        <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 capitalize">
          First Name:
          <input
            type="text"
            value={resumeData["firstName"]}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 capitalize">
          Last Name:
          <input
            type="text"
            value={resumeData["lastName"]}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
      </div>

        {/* Remaining fields */}
        {["address", "email", "phoneNo", "linkedin", "github"].map((key) => (
          <div key={key} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key}:
            </label>
            <input
              type="text"
              value={resumeData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}

        {/* Button Container */}
        <div className="flex justify-end gap-4 mt-6">
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
  );
};

GeneralInfoForm.propTypes = {
  resumeData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address: PropTypes.string,
    email: PropTypes.string,
    phoneNo: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
  }),
  handleInputChange: PropTypes.func,
  nextStep: PropTypes.func,
  saveForm: PropTypes.func
};

export default GeneralInfoForm;
