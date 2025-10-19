import Servicios from "../componentes/Sevicios";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";

import React from 'react'

const ServiciosPages = ({ onAgregarServicios, serviciosExistentes = [] }) => {
  return (
    <>
    <Header/>
    <Servicios
    onAgregarServicios= {onAgregarServicios}
    serviciosExistentes={serviciosExistentes}/>
    <Footer/>
    </>
  )
}

export default ServiciosPages
