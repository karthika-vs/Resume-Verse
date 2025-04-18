import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

const SkillsForm = ({ skills = [], handleSkillsUpdate, prevStep, nextStep }) => {
  const [localSkills, setLocalSkills] = useState([...skills]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const { resumeId } = useParams();

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

  // Validate skills form
  const validateForm = () => {
    const newErrors = {};
    
    localSkills.forEach((skill, index) => {
      // Validate skill
      if (!skill?.trim()) {
        newErrors[`skill-${index}`] = "Skill cannot be empty";
      } else if (skill.length > 50) {
        newErrors[`skill-${index}`] = "Skill must be less than 50 characters";
      } else if (!validateNoSQL(skill)) {
        newErrors[`skill-${index}`] = "Invalid characters in skill";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Secure skill change handler
  const handleSkillChange = (index, value) => {
    const sanitizedValue = sanitizeInput(value);
    const updatedSkills = [...localSkills];
    updatedSkills[index] = sanitizedValue;
    setLocalSkills(updatedSkills);
    
    // Clear error for this field if it exists
    if (errors[`skill-${index}`]) {
      const newErrors = {...errors};
      delete newErrors[`skill-${index}`];
      setErrors(newErrors);
    }
  };

  const handleAddSkill = () => {
    if (localSkills.length < 20) { // Limit to 20 skills
      setLocalSkills([...localSkills, ""]);
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = localSkills.filter((_, i) => i !== index);
    setLocalSkills(updatedSkills);
    
    // Remove error for this field if it exists
    if (errors[`skill-${index}`]) {
      const newErrors = {...errors};
      delete newErrors[`skill-${index}`];
      setErrors(newErrors);
    }
  };

  // Throttled save function
  const throttledSave = useCallback(throttle(async () => {
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
      const sanitizedSkills = localSkills.map(skill => sanitizeInput(skill));

      const response = await axios.post(
        "https://resumeverse-backend.onrender.com/user",
        {
          userId,
          resumeId,
          skills: sanitizedSkills,
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
      console.error("Error saving skills:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, 1000), [localSkills, userId, resumeId, nextStep]);

  // Sync with parent component
  useEffect(() => {
    if (JSON.stringify(localSkills) !== JSON.stringify(skills)) {
      handleSkillsUpdate(localSkills);
    }
  }, [localSkills]);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your relevant skills (max 20 skills, each limited to 50 characters)
        </p>

        {localSkills.map((skill, index) => (
          <div key={index} className="mb-4 flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className={`w-full border ${
                  errors[`skill-${index}`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder={`Skill ${index + 1}`}
                maxLength={50}
              />
              {errors[`skill-${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`skill-${index}`]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="text-red-500 hover:text-red-700 mt-2"
              aria-label="Remove skill"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSkill}
          disabled={localSkills.length >= 20}
          className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none ${
            localSkills.length >= 20 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {localSkills.length >= 20 ? 'Maximum skills reached' : 'Add Skill'}
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
              onClick={throttledSave}
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save & Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SkillsForm.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string),
  handleSkillsUpdate: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired
};

export default SkillsForm;