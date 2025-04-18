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

const GeneralInfoForm = ({ resumeData, handleInputChange, nextStep, saveForm }) => {
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
    // Check for common NoSQL injection patterns
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    // Validate and sanitize firstName
    if (!resumeData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (resumeData.firstName.length > 50) {
      newErrors.firstName = "First name must be less than 50 characters";
    } else if (!validateNoSQL(resumeData.firstName)) {
      newErrors.firstName = "Invalid characters in first name";
    }

    // Validate and sanitize lastName
    if (!resumeData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (resumeData.lastName.length > 50) {
      newErrors.lastName = "Last name must be less than 50 characters";
    } else if (!validateNoSQL(resumeData.lastName)) {
      newErrors.lastName = "Invalid characters in last name";
    }

    // Validate email
    if (resumeData.email) {
      if (!emailRegex.test(resumeData.email)) {
        newErrors.email = "Please enter a valid email address";
      } else if (!validateNoSQL(resumeData.email)) {
        newErrors.email = "Invalid characters in email";
      }
    }

    // Validate phone number
    if (resumeData.phoneNo) {
      if (!phoneRegex.test(resumeData.phoneNo)) {
        newErrors.phoneNo = "Please enter a valid phone number (10-15 digits)";
      } else if (!validateNoSQL(resumeData.phoneNo)) {
        newErrors.phoneNo = "Invalid characters in phone number";
      }
    }

    // Validate URLs
    [['linkedin', 'LinkedIn URL'], ['github', 'GitHub URL']].forEach(([key, label]) => {
      if (resumeData[key]) {
        if (!urlRegex.test(resumeData[key])) {
          newErrors[key] = `Please enter a valid ${label}`;
        } else if (!validateNoSQL(resumeData[key])) {
          newErrors[key] = `Invalid characters in ${label}`;
        }
      }
    });

    // Validate address
    if (resumeData.address && resumeData.address.length > 200) {
      newErrors.address = "Address must be less than 200 characters";
    } else if (resumeData.address && !validateNoSQL(resumeData.address)) {
      newErrors.address = "Invalid characters in address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Throttled validation function
  const throttledValidate = useCallback(throttle(() => {
    validateForm();
  }, 500), []);

  // Throttled save function
  const throttledSave = useCallback(throttle(() => {
    if (validateForm()) {
      saveForm();
    }
  }, 1000), [saveForm]);

  // Secure handleInputChange with sanitization and throttled validation
  const secureHandleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    handleInputChange(field, sanitizedValue);
    throttledValidate();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is missing.");
      return;
    }

    try {
      // Prepare sanitized data for submission
      const sanitizedData = {
        firstName: sanitizeInput(resumeData.firstName),
        lastName: sanitizeInput(resumeData.lastName),
        email: sanitizeInput(resumeData.email),
        phoneNo: sanitizeInput(resumeData.phoneNo),
        address: sanitizeInput(resumeData.address),
        linkedin: sanitizeInput(resumeData.linkedin),
        github: sanitizeInput(resumeData.github)
      };

      const response = await axios.post("https://resumeverse-backend.onrender.com/user", {
        userId,
        resumeId,
        ...sanitizedData,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff'
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        console.log("Data successfully submitted:", response.data);
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">General Information</h2>

        {/* First Name and Last Name in a row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              First Name: *
              <input
                type="text"
                value={resumeData["firstName"] || ""}
                onChange={(e) => secureHandleInputChange("firstName", e.target.value)}
                className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                required
                maxLength={50}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </label>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              Last Name: *
              <input
                type="text"
                value={resumeData["lastName"] || ""}
                onChange={(e) => secureHandleInputChange("lastName", e.target.value)}
                className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                required
                maxLength={50}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </label>
          </div>
        </div>

        {/* Remaining fields */}
        {[
          { key: "email", label: "Email", required: false, type: "email", maxLength: 100 },
          { key: "phoneNo", label: "Phone Number", required: false, type: "tel", maxLength: 15 },
          { key: "address", label: "Address", required: false, type: "text", maxLength: 200 },
          { key: "linkedin", label: "LinkedIn URL", required: false, type: "url", maxLength: 200 },
          { key: "github", label: "GitHub URL", required: false, type: "url", maxLength: 200 },
        ].map(({ key, label, required, type, maxLength }) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {label}{required ? " *" : ""}:
              <input
                type={type}
                value={resumeData[key] || ""}
                onChange={(e) => secureHandleInputChange(key, e.target.value)}
                className={`w-full border ${errors[key] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 mt-1 focus:ring-blue-500 focus:border-blue-500`}
                required={required}
                maxLength={maxLength}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </label>
          </div>
        ))}

        {/* Button Container */}
        <div className="flex justify-end gap-4 mt-6">
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
  );
};

GeneralInfoForm.propTypes = {
  resumeData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address: PropTypes.string,
    email: PropTypes.string,
    phoneNo: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
  }),
  handleInputChange: PropTypes.func,
  nextStep: PropTypes.func,
  saveForm: PropTypes.func
};

export default GeneralInfoForm;