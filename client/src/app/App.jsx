import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useSelector } from 'react-redux'


const App = () => {
  const auth = useAuth();
  useEffect(() => {
    auth.handleGetMe();
  }, [])
  return (
   <RouterProvider router={router} />
  )
}

export default App