import React, { useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

const EducationForm = ({
  resumeData,
  handleArrayChange,
  handleAddEducation,
  handleRemoveEducation,
  nextStep,
  prevStep,
  saveForm,
}) => {
  const { resumeId } = useParams();
  const { user } = useUser();
  const userId = user?.id;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Throttle function to limit API calls
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  };

  // Validate against NoSQL injection
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

  // Validate education form
  const validateForm = () => {
    const newErrors = {};
    const percentageRegex = /^([0-9]{1,2}(\.[0-9]{1,2})?|100)%?$/;
    const durationRegex = /^(\d{4}\s?-\s?\d{4}|[A-Za-z]+\s\d{4}\s?-\s?[A-Za-z]+\s\d{4})$/;

    resumeData.education.forEach((edu, index) => {
      // Validate institute name
      if (!edu.instituteName?.trim()) {
        newErrors[`instituteName-${index}`] = "Institute name is required";
      } else if (edu.instituteName.length > 100) {
        newErrors[`instituteName-${index}`] = "Institute name must be less than 100 characters";
      } else if (!validateNoSQL(edu.instituteName)) {
        newErrors[`instituteName-${index}`] = "Invalid characters in institute name";
      }

      // Validate degree
      if (!edu.degree?.trim()) {
        newErrors[`degree-${index}`] = "Degree is required";
      } else if (edu.degree.length > 50) {
        newErrors[`degree-${index}`] = "Degree must be less than 50 characters";
      } else if (!validateNoSQL(edu.degree)) {
        newErrors[`degree-${index}`] = "Invalid characters in degree";
      }

      // Validate percentage/grade
      if (edu.percentage && !percentageRegex.test(edu.percentage)) {
        newErrors[`percentage-${index}`] = "Please enter a valid percentage (e.g., 85 or 85.5%)";
      } else if (edu.percentage && !validateNoSQL(edu.percentage)) {
        newErrors[`percentage-${index}`] = "Invalid characters in percentage";
      }

      // Validate duration
      if (!edu.duration?.trim()) {
        newErrors[`duration-${index}`] = "Duration is required";
      } else if (!durationRegex.test(edu.duration)) {
        newErrors[`duration-${index}`] = "Please enter valid duration (e.g., 2015-2019 or June 2015 - May 2019)";
      } else if (!validateNoSQL(edu.duration)) {
        newErrors[`duration-${index}`] = "Invalid characters in duration";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Secure handleArrayChange with sanitization
  const secureHandleArrayChange = (arrayName, index, field, value) => {
    const sanitizedValue = sanitizeInput(value);
    handleArrayChange(arrayName, index, field, sanitizedValue);
  };

  // Throttled submit function
  const throttledSubmit = useCallback(throttle(async () => {
    if (!validateForm()) {
      return;
    }

    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare sanitized data
      const sanitizedEducation = resumeData.education.map(edu => ({
        instituteName: sanitizeInput(edu.instituteName),
        degree: sanitizeInput(edu.degree),
        percentage: sanitizeInput(edu.percentage),
        duration: sanitizeInput(edu.duration)
      }));

      const response = await axios.post(
        "https://resumeverse-backend.onrender.com/user",
        {
          userId,
          resumeId,
          education: sanitizedEducation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        nextStep();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, 1000), [resumeData.education, userId, resumeId, nextStep]);

  // Throttled save function
  const throttledSave = useCallback(throttle(() => {
    if (validateForm()) {
      saveForm();
    }
  }, 1000), [saveForm, resumeData.education]);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>

        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-md">
            <h3 className="font-bold text-lg text-gray-700">{`Education #${index + 1}`}</h3>

            {/* Institute Name and Degree */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label htmlFor={`institute-name-${index}`} className="block text-sm font-medium text-gray-700">
                  Institute Name: *
                </label>
                <input
                  id={`institute-name-${index}`}
                  type="text"
                  value={edu.instituteName || ""}
                  onChange={(e) => secureHandleArrayChange("education", index, "instituteName", e.target.value)}
                  className={`w-full border ${
                    errors[`instituteName-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  maxLength={100}
                />
                {errors[`instituteName-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`instituteName-${index}`]}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700">
                  Degree: *
                </label>
                <input
                  id={`degree-${index}`}
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) => secureHandleArrayChange("education", index, "degree", e.target.value)}
                  className={`w-full border ${
                    errors[`degree-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  maxLength={50}
                />
                {errors[`degree-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`degree-${index}`]}</p>
                )}
              </div>
            </div>

            {/* Percentage and Duration */}
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label htmlFor={`percentage-${index}`} className="block text-sm font-medium text-gray-700">
                  Percentage/Grade:
                </label>
                <input
                  id={`percentage-${index}`}
                  type="text"
                  value={edu.percentage || ""}
                  onChange={(e) => secureHandleArrayChange("education", index, "percentage", e.target.value)}
                  className={`w-full border ${
                    errors[`percentage-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g., 85% or 3.8 GPA"
                />
                {errors[`percentage-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`percentage-${index}`]}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700">
                  Duration: *
                </label>
                <input
                  id={`duration-${index}`}
                  type="text"
                  value={edu.duration || ""}
                  onChange={(e) => secureHandleArrayChange("education", index, "duration", e.target.value)}
                  className={`w-full border ${
                    errors[`duration-${index}`] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="e.g., 2015-2019 or June 2015 - May 2019"
                />
                {errors[`duration-${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`duration-${index}`]}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveEducation(index)}
              className="text-red-500 text-sm mt-2 hover:underline focus:outline-none"
            >
              Remove Education
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddEducation}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add Education
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
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
              onClick={throttledSave}
              disabled={isSubmitting}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={throttledSubmit}
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EducationForm.propTypes = {
  resumeData: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        instituteName: PropTypes.string,
        degree: PropTypes.string,
        percentage: PropTypes.string,
        duration: PropTypes.string,
      })
    ),
  }),
  handleArrayChange: PropTypes.func,
  handleAddEducation: PropTypes.func,
  handleRemoveEducation: PropTypes.func,
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
  saveForm: PropTypes.func,
};

export default EducationForm;