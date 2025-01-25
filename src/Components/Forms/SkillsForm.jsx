import React, { useState, useEffect } from "react";

const SkillsForm = ({ skills, handleSkillsUpdate, prevStep, nextStep }) => {
  const [localSkills, setLocalSkills] = useState(skills || []);

  useEffect(() => {
    handleSkillsUpdate(localSkills);
  }, [localSkills, handleSkillsUpdate]);

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
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
