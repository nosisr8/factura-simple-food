export const formatCurrency = (value: number) => {
  // Paraguay: Guaraní (PYG) se muestra típicamente sin decimales.
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};