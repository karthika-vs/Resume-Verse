import { useState } from 'react'
import Header from './Components/Header'
import Home from './pages/Home'
import {useUser} from '@clerk/clerk-react'
import {Navigate,Outlet} from 'react-router-dom'

function App() {
  const{user,isLoaded,isSignedIn}=useUser();
  if(!isSignedIn && isLoaded)
  {
    return <Navigate to={'/auth/sign-in'} />
  }

  return (
    <>
      <Outlet/>
    </>
  )
}

export default App
