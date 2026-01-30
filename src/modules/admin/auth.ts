export function validateAdminCredentials(input: {
  username: string;
  password: string;
}) {
  // Hardcodeado por requerimiento
  return input.username === "admin" && input.password === "12345678";
}

