import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import FormSection from '../Components/FormSection';
import PreviewSection from '../Components/PreviewSection';
import Header from '../Components/Header';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import dummy from '../data/dummy';

const EditResume = () => {
 
  const params = useParams();
  console.log(params);
  const [resumeInfo,setResumeInfo]=useState();
  useEffect(()=>{
    setResumeInfo(dummy);
  },[])

  return (
    <>
    <Header />
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
      <FormSection />
      <PreviewSection />
    </div>
    </ResumeInfoContext.Provider>
    </>
  )
}

export default EditResume
