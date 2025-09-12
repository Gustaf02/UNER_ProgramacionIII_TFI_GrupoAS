import React from 'react'
import { Navigate } from 'react-router-dom'
// import Admin from '../components/Admin'
// import Header from '../components/Header'
// import Footer from '../components/Footer'
import { useUsuario } from '../contexto/UsuarioContexto'

const RutaProtegida = ({ children }) => {
  const {isAuthenticated } = useUsuario()
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  return (
 <>
    
    {children}
    
 </>
  )
}

export default RutaProtegida