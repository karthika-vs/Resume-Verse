import React from "react";

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-4 mt-3">
      {/* Section Title with Line */}
      <h2 className="text-lg font-serif text-gray-800 border-b border-gray-400 pb-1 mb-3">
        Projects
      </h2>

      {/* Project Details */}
      {projects.map((project) => (
        <div key={project.id} className="mb-3">
          {/* Project Name */}
          <h3 className="text-sm font-serif ">{project.projectName}</h3>
          {/* Project Description */}
          <p className="text-sm italic text-gray-600 ">{project.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;
