import React from "react";

const EducationDetails = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Title with Line */}
      <h2 className="text-lg font-serif text-gray-800 border-b border-gray-400 pb-0.5 mb-2">
        Education
      </h2>

      {/* Education Details */}
      {education.map((edu, index) => (
        <div key={index} className="flex justify-between">
          {/* Left Section: Institute & Degree */}
          <div>
            <h3 className="text-sm font-serif">{edu.institute}</h3>
            <p className="text-sm italic">{`${edu.degree}`}</p>
          </div>

          {/* Right Section: Duration */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">{`${edu.startTime} - ${edu.endTime}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationDetails;
