import { describe, it, expect } from "vitest";
import { validateUserForm } from "../src/validators";

describe("validateUserForm", () => {
	it("debe regresar un arreglo vacío cuando los datos son válidos", () => {
		const errors = validateUserForm("Eduardo", "eduardo@example.com");
		expect(errors).toEqual([]);
	});

	it("debe regresar error si el nombre está vacío", () => {
		const errors = validateUserForm("", "eduardo@example.com");
		expect(errors).toContain("El nombre es requerido");
	});

	it("debe regresar error si el email es inválido", () => {
		const errors = validateUserForm("Eduardo", "correo-invalido");
		expect(errors).toContain("Se requiere un correo electrónico válido");
	});

	it("debe regresar múltiples errores si ambos son inválidos", () => {
		const errors = validateUserForm("", "");
		expect(errors).toContain("El nombre es requerido");
		expect(errors).toContain("Se requiere un correo electrónico válido");
	});
});
