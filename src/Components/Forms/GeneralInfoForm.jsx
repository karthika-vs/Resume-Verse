import React from "react";

const GeneralInfoForm = ({ resumeData, handleInputChange, nextStep, saveForm }) => {
  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">General Information</h2>

        {/* First Name and Last Name in a row */}
        <div className="flex gap-4 mb-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              First Name:
            </label>
            <input
              type="text"
              value={resumeData["firstName"]}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Last Name:
            </label>
            <input
              type="text"
              value={resumeData["lastName"]}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
            Save
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoForm;
