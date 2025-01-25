import React from 'react'
import { ResumeInfoContext } from '../../context/ResumeInfoContext'
import {useContext} from 'react'

const PersonalDetailForma = () => {

  const{resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
  return (
    <div>
      Personal Details
    </div>
  )
}

export default PersonalDetailFroms
