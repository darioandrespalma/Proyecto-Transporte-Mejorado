export const validarCedulaEcuatoriana = (cedula) => {
  // Verificar que sea string y tenga 10 dígitos
  if (!cedula || typeof cedula !== 'string' || cedula.length !== 10) {
    console.log('Cédula inválida - longitud incorrecta:', cedula);
    return false;
  }
  
  // Verificar que todos sean números
  if (!/^\d{10}$/.test(cedula)) {
    console.log('Cédula inválida - contiene caracteres no numéricos:', cedula);
    return false;
  }
  
  const digitos = cedula.split('').map(Number);
  const provincia = digitos[0] * 10 + digitos[1];
  
  // Verificar código de provincia (1-24)
  if (provincia < 1 || provincia > 24) {
    console.log('Cédula inválida - código de provincia incorrecto:', provincia);
    return false;
  }
  
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  
  for (let i = 0; i < 9; i++) {
    let digito = digitos[i] * coeficientes[i];
    if (digito >= 10) digito -= 9;
    suma += digito;
  }
  
  const verificador = (10 - (suma % 10)) % 10;
  const esValida = verificador === digitos[9];
  
  console.log('Validando cédula:', cedula, 'Válida:', esValida);
  return esValida;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(telefono);
};