import React from "react";

const WorkExperience = ({ workExperience }) => {
  if (!workExperience || workExperience.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Title with Line */}
      <h2 className="text-lg mt-5 font-serif text-gray-800 border-b border-gray-400 pb-0.5 mb-2">
        Work Experience
      </h2>

      {/* Work Experience Details */}
      {workExperience.map((work, index) => (
        <div key={index} className="flex justify-between">
          {/* Left Section: Company Name, Role, and Description */}
          <div>
            <h3 className="text-sm font-serif">{work.name}</h3>
            <p className="text-sm italic">{work.role}</p>
            <p className="text-sm italic text-gray-600 mt-1">{work.desc}</p>
          </div>

          {/* Right Section: Dates */}
          <div className="text-right ">
            <p className="text-xs font-medium  text-gray-600">{`${work.startDate} - ${work.endDate}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;
