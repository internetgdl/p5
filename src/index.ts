/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { validateUserForm } from "./validators";

export interface Env {
	p6: any; // Using any or D1Database if type definitions were present
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// Endpoint POST para crear un registro a partir de un form de HTML
		if (request.method === "POST" && url.pathname === "/user") {
			try {
				const formData = await request.formData();
				const name = formData.get("name") as string | null;
				const email = formData.get("email") as string | null;

				const errors = validateUserForm(name, email);
				
				if (errors.length > 0) {
					return Response.json({ errors }, { status: 400 });
				}

				// Insertamos en la BD de D1 (p6)
				await env.p6.prepare("INSERT INTO users (name, email) VALUES (?, ?)").bind(name, email).run();
				
				return Response.json({ message: "Registro creado exitosamente" }, { status: 201 });
			} catch (e) {
				const errorMessage = e instanceof Error ? e.message : "Error desconocido";
				return Response.json({ error: "No se pudo procesar la solicitud", details: errorMessage }, { status: 500 });
			}
		}

		// Default endpoint: consulta a la BD y retorna Hello World 3!
		const data = await this.queryDatabase(env.p6);
		return Response.json({ message: "Hello World 3!", dbData: data });
	},

	// Método para conectar/consultar la base de datos p6
	async queryDatabase(db: any) {
		const { results } = await db.prepare("SELECT * FROM users").all();
		return results;
	}
} satisfies ExportedHandler<Env>;
