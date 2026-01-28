export type CustomerDocumentType = "CI" | "RUC";

export const normalizeDocument = (value: string) => {
  // Quita todo lo que no sea dígito (puntos, guiones, espacios, etc.)
  return value.replace(/\D/g, "");
};

export const isValidCi = (value: string) => {
  const digits = normalizeDocument(value);
  // CI (Paraguay) suele ser numérica. Permitimos un rango amplio para no bloquear casos reales.
  return digits.length >= 5 && digits.length <= 10;
};

export const isValidRuc = (value: string) => {
  const digits = normalizeDocument(value);
  // RUC (Paraguay) normalmente es base + dígito verificador.
  // Validación liviana: al menos 6 dígitos totales (base + DV) y máximo 11.
  return digits.length >= 6 && digits.length <= 11;
};

export const isValidDocument = (type: CustomerDocumentType, value: string) => {
  if (type === "CI") return isValidCi(value);
  return isValidRuc(value);
};

