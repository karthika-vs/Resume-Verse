import React from "react";

const Skills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="space-y-4 mt-3">
      {/* Section Title with Line */}
      <h2 className="text-lg font-serif text-gray-800 border-b border-gray-400 pb-1 mb-3">
        Skills
      </h2>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full shadow-sm"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Skills;
