import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const Protected = () => {
    const token = localStorage.getItem('token');
  return (
    token ? <Outlet /> : <Navigate to="/loginSignup" />
  )
}

export default Protected