import React from 'react'
import { useContext } from 'react';
import { ResumeInfoContext } from '../context/ResumeInfoContext';

import PersonalDetails from './preview/PersonalDetails';

const PreviewSection = () => {
  
  const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);

  return (
    <div>
      Preview Section
        {/* Personal Details */}
            <PersonalDetails  resumeInfo={resumeInfo}/>
        {/* Education */}

        {/* Skills */}

        {/* WorkExperience */}

        {/* Projects */}

    </div>
  )
}

export default PreviewSection
