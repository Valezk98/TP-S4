export function formatearPrecio(numero = 0) {
  return (numero || 0).toLocaleString('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  });
}