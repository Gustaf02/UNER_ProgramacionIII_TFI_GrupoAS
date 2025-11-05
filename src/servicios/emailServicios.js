import nodemailer from 'nodemailer';

// Configurar el transportador (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
    }
});

export const enviarEmailRecuperacion = async (email, token) => {
  //const enlace = `http://localhost:3000/api/v1/autenticacion/restablecer-contrasenia?token=${token}`;
  const enlace = `http://localhost:5173/restablecer-contrasenia?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecer tu contraseña - Programación III',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Restablecer Contraseña</h2>
    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
    
    <p><strong>Tu token de verificación:</strong></p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 16px; word-wrap: break-word; white-space: pre-wrap;">
    ${token}
</div>
    
    <p style="margin-top: 20px;">O haz clic en el siguiente enlace:</p>
    <a href="${enlace}" 
       style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
       Restablecer Contraseña
    </a>
    
    <p><strong>Este token expirará en 1 hora.</strong></p>
    <p>Si no solicitaste este restablecimiento, ignora este email.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">Equipo de Programación III</p>
</div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de recuperación enviado a:', email);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};

export const emailServicio = {
  async enviarCorreoConfirmacionReserva(email, reservaData) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmación de Reserva - Programación III',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Reserva Confirmada!</h2>
          <p>Hemos confirmado tu reserva exitosamente.</p>
          
          <h3>Detalles de la reserva:</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <p><strong>Número de reserva:</strong> #${reservaData.reserva_id}</p>
            <p><strong>Fecha:</strong> ${reservaData.fecha_reserva}</p>
            <p><strong>Salón ID:</strong> ${reservaData.salon_id}</p>
            <p><strong>Turno ID:</strong> ${reservaData.turno_id}</p>
            <p><strong>Temática:</strong> ${reservaData.tematica}</p>
            <p><strong>Importe salón:</strong> $${reservaData.importe_salon}</p>
            <p><strong>Total:</strong> $${reservaData.importe_total}</p>
          </div>

          <p style="margin-top: 20px;"><strong>Servicios contratados:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            <ul style="margin: 0; padding-left: 20px;">
              ${reservaData.servicios.map(servicio => `
                <li>Servicio ${servicio.servicio_id} - $${servicio.importe}</li>
              `).join('')}
            </ul>
          </div>

          <p style="margin-top: 20px;">Si tienes alguna pregunta, contáctanos.</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">Equipo de Programación III</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      return false;
    }
  },
};