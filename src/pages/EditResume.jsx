import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import FormSection from '../Components/FormSection';
import PreviewSection from '../Components/PreviewSection';
import Header from '../Components/Header';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import dummy from '../data/dummy';

const EditResume = () => {
 
  
  return (
    <>
    <Header />
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
      <FormSection />
      {/* <PreviewSection /> */}
    </div>
    </>
  )
}

export default EditResume
