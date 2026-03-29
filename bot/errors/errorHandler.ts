const errors = {
  '404': 'No se encontró el track.',
  '503': 'Service unavailable.',
  '400': 'Faltan parámetros.',
  '401': 'No autorizado.',
  '403':
    'Forbidden. You are not authorized to access this resource. In case of non-payment, please contact support.',
  '500': 'Error interno del servidor.'
}

export const handleError = (errorCode: keyof typeof errors) => {
  return errors[`${errorCode}`]
}
export default errors
