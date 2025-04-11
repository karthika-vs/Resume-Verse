import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";

const SkillsForm = ({ skills = [], handleSkillsUpdate, prevStep, nextStep }) => {
  const [localSkills, setLocalSkills] = useState([...skills]);
  const { user } = useUser();
  const userId = user?.id;
  const { resumeId } = useParams();

  // Sync the parent state only when localSkills is explicitly updated by the user
  useEffect(() => {
    if (JSON.stringify(localSkills) !== JSON.stringify(skills)) {
      handleSkillsUpdate(localSkills);
    }
    // Only trigger on `localSkills` changes
  }, [localSkills]);

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...localSkills];
    updatedSkills[index] = value;
    setLocalSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    setLocalSkills([...localSkills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = localSkills.filter((_, i) => i !== index);
    setLocalSkills(updatedSkills);
  };

  const saveSkills = async () => {
    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    try {
      const payload = {
        userId,
        resumeId,
        skills: localSkills, // Send the array of skills
      };

      const response = await axios.post("https://resumeverse-backend.onrender.com/user", payload);
      if (response.status === 200 || response.status === 201) {
        console.log("Skills saved successfully:", response.data);
        nextStep();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>

        {localSkills.map((skill, index) => (
          <div key={index} className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Skill ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSkill}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Add Skill
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveSkills}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={saveSkills}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SkillsForm.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string),
  handleSkillsUpdate: PropTypes.func,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func
};

export default SkillsForm;
