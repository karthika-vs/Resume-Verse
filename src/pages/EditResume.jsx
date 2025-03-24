import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import FormSection from '../Components/FormSection';
import Header from '../Components/Header';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import dummy from '../data/dummy';


const EditResume = () => {
  const {resumeId} = useParams();
  
  return (
    <>
    <Header />
    <div className=''>
      <FormSection />
      {/* <PreviewSection /> */}
    </div>
    </>
  )
}

export default EditResume
