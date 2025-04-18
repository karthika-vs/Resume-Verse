import React, { useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

// Throttle function implementation
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const WorkExperienceForm = ({
  resumeData = {
    workExperience: [{
      companyName: '',
      role: '',
      duration: '',
      desc: ''
    }]
  },
  handleArrayChange,
  handleAddWorkExperience,
  handleRemoveWorkExperience,
  nextStep,
  prevStep,
  saveForm,
}) => {
  const { resumeId } = useParams();
  const { user } = useUser();
  const userId = user?.id;
  const [errors, setErrors] = useState({});

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Remove all HTML tags
      ALLOWED_ATTR: []  // Remove all attributes
    });
  };

  // Validate and sanitize against NoSQL injection
  const validateNoSQL = (input) => {
    if (!input) return true;
    const nosqlPatterns = [
      /\$eq/i, /\$ne/i, /\$gt/i, /\$gte/i, /\$lt/i, /\$lte/i, 
      /\$in/i, /\$nin/i, /\$or/i, /\$and/i, /\$not/i, /\$nor/i,
      /\$exists/i, /\$type/i, /\$mod/i, /\$regex/i, /\$text/i,
      /\$where/i, /\$geoWithin/i, /\$geoIntersects/i, /\$near/i,
      /\$nearSphere/i, /\$all/i, /\$elemMatch/i, /\$size/i,
      /\$bitsAllClear/i, /\$bitsAllSet/i, /\$bitsAnyClear/i,
      /\$bitsAnySet/i, /\$[/i, /{[\s]*\$/i
    ];
    return !nosqlPatterns.some(pattern => pattern.test(input));
  };

  // Validate work experience fields
  const validateExperience = (exp, index) => {
    const newErrors = { ...errors };
    
    // Validate company name
    if (!exp.companyName?.trim()) {
      newErrors[`companyName-${index}`] = "Company name is required";
    } else if (exp.companyName.length > 100) {
      newErrors[`companyName-${index}`] = "Company name must be less than 100 characters";
    } else if (!validateNoSQL(exp.companyName)) {
      newErrors[`companyName-${index}`] = "Invalid characters in company name";
    } else {
      delete newErrors[`companyName-${index}`];
    }

    // Validate role
    if (!exp.role?.trim()) {
      newErrors[`role-${index}`] = "Role is required";
    } else if (exp.role.length > 100) {
      newErrors[`role-${index}`] = "Role must be less than 100 characters";
    } else if (!validateNoSQL(exp.role)) {
      newErrors[`role-${index}`] = "Invalid characters in role";
    } else {
      delete newErrors[`role-${index}`];
    }

    // Validate duration
    if (!exp.duration?.trim()) {
      newErrors[`duration-${index}`] = "Duration is required";
    } else if (exp.duration.length > 50) {
      newErrors[`duration-${index}`] = "Duration must be less than 50 characters";
    } else if (!validateNoSQL(exp.duration)) {
      newErrors[`duration-${index}`] = "Invalid characters in duration";
    } else {
      delete newErrors[`duration-${index}`];
    }

    // Validate description
    if (exp.desc && exp.desc.length > 500) {
      newErrors[`desc-${index}`] = "Description must be less than 500 characters";
    } else if (exp.desc && !validateNoSQL(exp.desc)) {
      newErrors[`desc-${index}`] = "Invalid characters in description";
    } else {
      delete newErrors[`desc-${index}`];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Throttled validation function
  const throttledValidate = useCallback(throttle((exp, index) => {
    validateExperience(exp, index);
  }, 500), []);

  // Secure handleArrayChange with sanitization and throttled validation
  const secureHandleArrayChange = (arrayName, index, field, value) => {
    const sanitizedValue = sanitizeInput(value);
    handleArrayChange(arrayName, index, field, sanitizedValue);
    
    // Validate the updated experience
    const updatedExperience = {
      ...resumeData.workExperience[index],
      [field]: sanitizedValue
    };
    throttledValidate(updatedExperience, index);
  };

  // Throttled save function
  const throttledSave = useCallback(throttle(() => {
    if (validateAllExperiences()) {
      saveForm();
    }
  }, 1000), [resumeData.workExperience, saveForm]);

  // Validate all experiences before submission
  const validateAllExperiences = () => {
    let isValid = true;
    const newErrors = {};
    
    resumeData.workExperience.forEach((exp, index) => {
      if (!exp.companyName?.trim()) {
        newErrors[`companyName-${index}`] = "Company name is required";
        isValid = false;
      }
      if (!exp.role?.trim()) {
        newErrors[`role-${index}`] = "Role is required";
        isValid = false;
      }
      if (!exp.duration?.trim()) {
        newErrors[`duration-${index}`] = "Duration is required";
        isValid = false;
      }
      if (exp.desc && !validateNoSQL(exp.desc)) {
        newErrors[`desc-${index}`] = "Invalid characters in description";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAllExperiences()) {
      return;
    }

    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    try {
      // Prepare sanitized data for submission
      const sanitizedExperiences = resumeData.workExperience.map(exp => ({
        companyName: sanitizeInput(exp.companyName),
        role: sanitizeInput(exp.role),
        duration: sanitizeInput(exp.duration),
        desc: exp.desc ? sanitizeInput(exp.desc) : ""
      }));

      const response = await axios.post(
        "https://resumeverse-backend.onrender.com/user",
        {
          userId,
          resumeId,
          workExperience: sanitizedExperiences,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Work experience data successfully submitted:", response.data);
        nextStep();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleSave = () => {
    throttledSave();
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
                <label htmlFor={`company-name-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                  Company Name: *
                </label>
                <input
                  id={`company-name-${index}`}
                  type="text"
                  value={exp.companyName || ''}
                  onChange={(e) =>
                    secureHandleArrayChange("workExperience", index, "companyName", e.target.value)
                  }
                  className={`w-full border ${errors[`companyName-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  maxLength={100}
                  required
                />
                {errors[`companyName-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`companyName-${index}`]}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                  Role: *
                </label>
                <input
                  id={`role-${index}`}
                  type="text"
                  value={exp.role || ''}
                  onChange={(e) =>
                    secureHandleArrayChange("workExperience", index, "role", e.target.value)
                  }
                  className={`w-full border ${errors[`role-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  maxLength={100}
                  required
                />
                {errors[`role-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`role-${index}`]}</p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-2">
              <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Duration: *
              </label>
              <input
                id={`duration-${index}`}
                type="text"
                value={exp.duration || ''}
                onChange={(e) =>
                  secureHandleArrayChange("workExperience", index, "duration", e.target.value)
                }
                className={`w-full border ${errors[`duration-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                maxLength={50}
                required
              />
              {errors[`duration-${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`duration-${index}`]}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-2">
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 capitalize">
                Description:
              </label>
              <textarea
                id={`description-${index}`}
                value={exp.desc || ''}
                onChange={(e) =>
                  secureHandleArrayChange("workExperience", index, "desc", e.target.value)
                }
                className={`w-full border ${errors[`desc-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                rows="3"
                maxLength={500}
              />
              {errors[`desc-${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`desc-${index}`]}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleRemoveWorkExperience(index)}
              className="text-red-500 text-sm mt-2 hover:text-red-700"
            >
              Remove Experience
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
              onClick={handleSave}
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

WorkExperienceForm.propTypes = {
  resumeData: PropTypes.shape({
    workExperience: PropTypes.arrayOf(
      PropTypes.shape({
        companyName: PropTypes.string,
        role: PropTypes.string,
        duration: PropTypes.string,
        desc: PropTypes.string,
      })
    ),
  }),
  handleArrayChange: PropTypes.func.isRequired,
  handleAddWorkExperience: PropTypes.func.isRequired,
  handleRemoveWorkExperience: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  saveForm: PropTypes.func.isRequired,
};

export default WorkExperienceForm;