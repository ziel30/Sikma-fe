import { z } from "zod";

/** Validation schema for the "create profile" (register) form. */
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  age: z
    .number("Umur harus berupa angka")
    .int("Umur harus bilangan bulat")
    .min(5, "Umur minimal 5 tahun")
    .max(120, "Umur maksimal 120 tahun"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export type RegisterValues = z.infer<typeof registerSchema>;

/** Validation schema for the login form. */
export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email atau nama pengguna wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type LoginValues = z.infer<typeof loginSchema>;
